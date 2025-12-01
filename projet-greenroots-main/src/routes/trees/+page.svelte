<script>
  import "/src/app.css";
  import { onMount } from "svelte";
  import TreeCard from "$lib/assets/components/TreeCard.svelte";

  // ================================
  // STATE VARIABLES
  // ================================
  let trees = [];                // List of trees to display
  let campaigns = [];            // List of available campaigns
  let selectedCampaign = '';     // Selected campaign ID
  let sortOrder = '';            // Sort order (asc, desc, or none)
  let displayTotal = 0;          // Animated total of planted trees
  let _raf;                      // Reference to requestAnimationFrame for cancellation

  // ================================
  // ANIMATED COUNTER FUNCTION
  // ================================
  function animateTo(to, duration = 1000) {
    if (_raf) cancelAnimationFrame(_raf); // Cancel ongoing animation if needed

    const from = Number.isFinite(displayTotal) ? displayTotal : 0;
    const start = performance.now();
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3); // Smooth easing function

    // Called every frame
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      displayTotal = Math.round(from + (to - from) * easeOutCubic(progress));
      if (progress < 1) _raf = requestAnimationFrame(tick);
    }

    _raf = requestAnimationFrame(tick);
  }

  // ================================
  // FETCH TREES (OPTIONALLY FILTERED BY CAMPAIGN)
  // ================================
  async function fetchTrees(campaign_id = null) {
    try {
      trees = []; // Reset before new fetch

      // Build query params dynamically (campaign + sort)
      const params = new URLSearchParams();
      if (campaign_id) params.set('campaign_id', campaign_id);
      if (sortOrder) params.set('sort', sortOrder);

      // Construct URL based on filters
      const url = params.toString()
        ? `http://localhost:3000/api/trees?${params.toString()}`
        : "http://localhost:3000/api/trees";

      // API request
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API Error: " + response.status);

      const data = await response.json();

      // Handle possible data structure (object or array)
      trees = Array.isArray(data.trees) ? data.trees : data;
      console.log(data.trees[0]);

      // Compute total planted trees (stock - quantity)
      const total = trees.reduce((sum, t) => sum + (t.stock - t.quantity || 0), 0);
      animateTo(total);
    } catch (error) {
      console.error("fetchTrees error:", error);
    }
  }

  // ================================
  // FETCH AVAILABLE CAMPAIGNS
  // ================================
  async function fetchCampaigns() {
    try {
      const response = await fetch("http://localhost:3000/api/campaigns", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("API Error: " + response.status);

      const data = await response.json();
      campaigns = data.campaigns || data;

      // Sort campaigns alphabetically by name
      campaigns.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error("fetchCampaigns error:", error);
    }
  }

  // ================================
  // EVENT HANDLERS FOR FILTER / SORT
  // ================================
  function handleFilterChange(event) {
    selectedCampaign = event.target.value;
    fetchTrees(selectedCampaign);
  }

  function handleSortChange(event) {
    sortOrder = event.target.value;
    fetchTrees(selectedCampaign);
  }

  // ================================
  // LIFECYCLE — onMount
  // ================================
  onMount(() => {
    fetchCampaigns();
    const params = new URLSearchParams(window.location.search);
    const campaign_id = params.get('campaign_id');
    if (campaign_id) selectedCampaign = campaign_id;
    fetchTrees(selectedCampaign || null);
  });
</script>
<svelte:head>
  <title>Nos Arbres | GreenRoots</title>
  <meta name="description" content="Découvrez notre catalogue d'arbres disponibles pour le financement. Participez à la reforestation avec GreenRoots." />
</svelte:head>
<!-- ================================
     MAIN SECTION
================================ -->
<section class="trees-header">
  <div class="tree-catalog-title">
    <h1 class="section-title">Nos Arbres</h1>
    <p class="subtitle">Chaque arbre planté contribue à restaurer la planète</p>
  </div>

  <!-- Animated statistics -->
  <div class="trees-stats">
    💚 <strong>{displayTotal.toLocaleString('fr-FR')}</strong>
    arbres déjà plantés grâce à vous
  </div>
</section>

<!-- ================================
     FILTERS SECTION
================================ -->
<div class="filters-wrapper">
  <div class="filters">
    <select bind:value={selectedCampaign} on:change={handleFilterChange}>
      <option value="">Toutes les campagnes</option>
      {#each campaigns as campaign}
        <option value={String(campaign.id)}>{campaign.name}</option>
      {/each}
    </select>

    <select bind:value={sortOrder} on:change={handleSortChange}>
      <option value="">Tri par défaut</option>
      <option value="asc">Prix croissant</option>
      <option value="desc">Prix décroissant</option>
    </select>
  </div>
</div>

<!-- ================================
     TREES GRID SECTION
================================ -->
<div class="tree-catalog-container grid-cards">
  {#each trees as tree}
    <TreeCard tree={tree}/>
  {/each}
</div>

<!-- ================================
     STYLES
================================ -->
<style>
  /* ===== Grid Container ===== */
  .tree-catalog-container {
  display: grid;
  grid-template-columns: repeat(auto-fill);
  gap: 1rem;
  justify-items: center;
  align-items: start;
  padding: 2rem;
  }


  /* ===== Statistics ===== */
  .trees-stats {
    text-align: center;
    padding: 2rem;
    font-size: 1.4rem;
    color: #2e6b3a;
    font-weight: 500;
  }

  .trees-stats strong {
    font-size: 1.8rem;
    color: #1c522a;
  }

  /* ===== Title & Subtitle ===== */
  .tree-catalog-title {
    font-family: 'Poppins', sans-serif;
    font-size: 2.8rem;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    background: linear-gradient(90deg, #2d572c, #4eb64e, #2d572c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .tree-catalog-title .subtitle {
    margin-top: 0.5rem;
    font-size: 1.2rem;
    font-style: italic;
  }

  /* ===== Filters ===== */
  .filters-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .filters {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
    width: 100%;
    max-width: 1500px;
    box-sizing: border-box;
  }

  select {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    background-color: #c7c5c5;
    font-size: 1rem;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  select:hover {
    border-color: #4caf50;
    box-shadow: 0 0 4px rgba(76, 175, 80, 0.3);
  }

  /* ===== Header Section ===== */
  .trees-header {
    background: linear-gradient(180deg, #dbdfdb 0%, #ffffff 100%);
  }

  /* ===== Responsive ===== */
  @media (max-width: 768px) {
    .filters {
      flex-direction: column;   /* stacked vertically */
      align-items: center;      /* horizontally centered */
      gap: 0.8rem;
      padding-left: 0;
      padding-right: 0;
    }

    .filters select {
      width: 90%;               /* full width on small screens */
      font-size: 0.95rem;
    }
  }
</style>