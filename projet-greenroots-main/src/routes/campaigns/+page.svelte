<script>
  import "/src/app.css";
  import { onMount } from "svelte";
  import CampaignCard from "$lib/assets/components/CampaignCard.svelte";

  // ======== State ========
  let campaigns = [];

  // ======== Fetch all campaigns ========
  async function fetchCampaigns() {
    try {
      const response = await fetch('http://localhost:3000/api/campaigns', {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("API error: " + response.message);

      const data = await response.json();
      campaigns = data.campaigns;
    } catch (error) {
      console.error("fetchCampaigns error:", error);
    }
  };

  // ======== Lifecycle ========
  // Fetch data when page loads + set page title
  onMount(() => {
    fetchCampaigns();
  });
</script>
<svelte:head>
  <title>Nos Campagnes | GreenRoots</title>
  <meta name="description" content="Découvrez nos campagnes de reforestation en cours et à venir. Participez à la protection de l'environnement avec GreenRoots." />
</svelte:head>
<!-- ======== PAGE CONTENT ======== -->
 <section class="campaigns-page">
<h1 class="section-title">Nos Campagnes</h1>

<!-- Campaign grid container -->
<div class="campaign-catalog-container">
  {#each campaigns as campaign}
    <CampaignCard 
      id={campaign.id} 
      name={campaign.name} 
      image={campaign.image} 
      description={campaign.description}
      begin_date={campaign.begin_date}
      end_date={campaign.end_date} 
      trees={campaign?.trees}
      country={campaign.country}
    />
  {/each}
</div>
 </section>

<!-- ======== STYLES ======== -->
<style>

  .campaigns-page {
    background: linear-gradient(180deg, #dbdfdb 0%, #ffffff 100%);
    
  }


  .campaign-catalog-container {
    width: 100%;
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    justify-items: center;
    align-content: start;
    margin: 2rem 0;
    padding: 0 2rem;
    max-width: 1600px;
    margin-inline: auto;
  }

  /* Ensure consistent card size inside the grid */
  :global(.campaign-catalog-container .campaign-card) {
    width: 100%;
    max-width: 360px;
  }


  /* === Responsive grid adjustments === */
  @media (max-width: 1024px) {
    .campaign-catalog-container {
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    }
  }

  @media (max-width: 550px) {
    .campaign-catalog-container {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }

  @media (max-width: 435px) {
    .campaign-catalog-container {
      grid-template-columns: 1fr;
    }
  }
</style>