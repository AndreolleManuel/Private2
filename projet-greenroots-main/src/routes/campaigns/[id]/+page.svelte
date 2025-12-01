<script>
  import "/src/app.css";
  import { campaignProgress } from "$lib/utils/ProgressCampaign.js";
  import { onMount } from "svelte";
  import { formatDateToDisplay } from "$lib/utils/DateFormatter.js";
  import ProgressBar from "$lib/assets/components/ProgressBar.svelte";

  // ======== Props from router ========
  export let params;

  // ======== State ========
  let campaign = [];
  const campaignId = params.id;

  // ======== Fetch campaign by ID ========
  async function fetchCampaign() {
    try {
      const response = await fetch(`http://localhost:3000/api/campaigns/${campaignId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("API error: " + response.message);

      const data = await response.json();
      campaign = data.campaign;
    } catch (error) {
      console.error("fetchCampaign error:", error);
    }
  };

  // ======== Lifecycle ========
  onMount(() => {
    fetchCampaign();
  });
</script>
<svelte:head>
  <title>Détails de la campagne | GreenRoots</title>
  <meta name="description" content="Détails et description de la campagne de reforestation." />
</svelte:head>
<!-- ======== PAGE CONTENT ======== -->
{#if campaign}
  <article class="campaign-page" style="--sticky-cta-h: 64px;">
    
    <!-- Hero banner with background image -->
    <header class="campaign-hero">
      <img
        class="hero-img"
        src={campaign.image}
        alt={campaign.name}
        decoding="async"
        fetchpriority="high"
      />
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="campaign-title">{campaign.name}</h1>
        <p class="campaign-sub">
          Campagne {campaign?.country?.name} — jusqu’au {formatDateToDisplay(campaign.end_date, "long")}
          {#if new Date(campaign.begin_date) > new Date()}
            <span class="badge badge-soon">Bientôt</span>
          {/if}
          {#if new Date(campaign.end_date) < new Date()}
            <span class="badge badge-soon">Terminée</span>
          {/if}
        </p>
      </div>
    </header>

    <!-- Progress and metrics -->
    <section class="campaign-metrics" aria-label="Indicateurs de la campagne">
      <ProgressBar
        value={campaignProgress(campaign.trees)}
        showPercent={true}
      />
      <div class="metric-card">
        <p class="metric-label">Échéance</p>
        <p class="metric-value">{formatDateToDisplay(campaign.end_date)}</p>
      </div>
    </section>

    <!-- Campaign description -->
    <section class="campaign-body">
      <h2 class="sr-only">Description de la campagne</h2>
      <p class="campaign-desc">{campaign.description}</p>
    </section>

    <!-- List of trees related to this campaign -->
    <section class="campaign-trees" aria-label="Arbres de la campagne">
      <h2>Arbres concernés</h2>
      <ul class="tree-grid">
        {#each campaign.trees as tree}
          <li class="tree-item">
            <a class="tree-link" href={`/trees/${tree.id}`}>
              <div class="tree-card">
                <div class="tree-head">
                  <h3 class="tree-name">{tree.name}</h3>
                </div>
                <div class="tree-meta">
                  <span class="tree-stock">Stock total : {tree.stock}</span>
                  <span class="tree-remaining">Restant : {tree.quantity}</span>
                </div>
                <div class="tree-cta">
                  <span class="btn btn-primary btn-sm">Voir l’arbre</span>
                </div>
              </div>
            </a>
          </li>
        {/each}
      </ul>
    </section>

    <!-- Sticky bottom CTA (mobile action bar) -->
    <nav class="sticky-cta" aria-label="Actions campagne">
      <a href={`/trees?campaign_id=${campaign.id}`} class="btn btn-cta">Voir la liste des arbres</a>
    </nav>
  </article>

{:else}
  <!-- Fallback if campaign not found -->
  <p>Campagne introuvable 🚫</p>
{/if}

<!-- ======== STYLES ======== -->
<style>
  /* Page wrapper */
  .campaign-page {
    --gr-green: #2e7d32;
    --gr-green-dark: #1b5e20;
    --gr-green-btn: #4CAF50;
    --gr-green-btn-hover: #45a049;
    --gr-gray-0: #f7f8f7;
    --gr-gray-1: #E8EAE7;
    --gr-gray-2: #DBFEDC;
    --gr-border: #ccc;
    --gr-muted: #9d9d9d;
    --radius: 10px;
    --shadow: 0 8px 24px rgba(0,0,0,.12);
    --pad-x: clamp(16px,4vw,48px);
    display: block;
    background: #fff;
    color: #111;
    margin-top: 10rem;
  }

  /* Hero section */
  .campaign-hero {
    position: relative;
    min-height: clamp(240px, 42vw, 520px);
    overflow: hidden;
  }
  .hero-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.02);
  }
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.45) 30%, rgba(0,0,0,0) 70%);
    pointer-events: none;
  }
  .hero-content {
    position: relative;
    z-index: 1;
    color: #fff;
    padding: clamp(16px, 4vw, 40px) var(--pad-x);
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .campaign-title {
    margin: 8vh 0 0 0;
    font-size: clamp(1.6rem, 3.5vw, 2.6rem);
    line-height: 1.1;
    text-shadow: 0 2px 12px rgba(0,0,0,.35);
  }
  .campaign-sub {
    font-size: clamp(.95rem, 1.6vw, 1.1rem);
    opacity: .95;
    display: flex;
    align-items: center;
    gap: .5rem;
    flex-wrap: wrap;
  }
  .badge {
    display: inline-block;
    border-radius: 999px;
    padding: .25rem .6rem;
    font-size: .85em;
    border: 1px solid rgba(255,255,255,.65);
    background: rgba(0,0,0,.25);
    backdrop-filter: blur(2px);
  }
  .badge-soon { color: #fff; }

  /* Metrics band */
  .campaign-metrics {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(12px, 2vw, 20px);
    padding: 16px var(--pad-x) 0;
  }
  @media (min-width: 768px) {
    .campaign-metrics { grid-template-columns: repeat(3, 1fr); }
  }
  .metric-card {
    background: #fff;
    border: 1px solid var(--gr-border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: clamp(12px, 2vw, 18px);
  }
  .metric-label {
    color: #333;
    font-weight: 600;
    margin-bottom: .35rem;
  }
  .metric-value {
    font-size: clamp(1.15rem, 2.5vw, 1.6rem);
    font-weight: 700;
    color: var(--gr-green-dark);
  }

  /* Body */
  .campaign-body {
    padding: 12px var(--pad-x) 24px;
  }
  .campaign-desc {
    max-width: none; 
    font-size: clamp(1rem, 1.6vw, 1.08rem);
    line-height: 1.65;
    color: #222;
  }

  /* Trees list */
  .campaign-trees {
    padding: 8px var(--pad-x);
  }
  .campaign-trees h2 {
    font-size: clamp(1.2rem, 2.2vw, 1.6rem);
    margin: 0 0 .6rem 0;
  }
  .tree-grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: clamp(10px, 1.8vw, 16px);
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  @media (min-width: 640px) {
    .tree-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .tree-grid { grid-template-columns: repeat(3, 1fr); }
  }

  .tree-item { display: block; }
  .tree-link { text-decoration: none; color: inherit; display: block; }

  .tree-card {
    background: #fff;
    border: 1px solid var(--gr-border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    transition: transform .2s ease, box-shadow .2s ease;
    padding: 14px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .tree-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0,0,0,.14);
  }
  .tree-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: .5rem;
  }
  .tree-name {
    font-size: 1.02rem;
    line-height: 1.2;
    margin: 0;
    color: #1b1b1b;
  }
  .tree-meta {
    display: flex;
    gap: .6rem;
    flex-wrap: wrap;
    color: #444;
    font-size: .95rem;
  }
  .tree-meta span {
    background: var(--gr-gray-1);
    border: 1px solid var(--gr-border);
    border-radius: 6px;
    padding: .2rem .5rem;
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: .45rem;
    border-radius: var(--radius);
    border: 1px solid transparent;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
    user-select: none;
  }
  .btn:active { transform: scale(.98); }
  .btn-sm { padding: .4rem .7rem; font-size: .95rem; }
  .btn-primary { background: var(--gr-green-btn); }
  .btn-primary:hover { background: var(--gr-green-btn-hover); }
  .btn-cta {
    width: 100%;
    padding: .9rem 1.1rem;
    font-size: 1.05rem;
    background: var(--gr-green);
    color: #fff;
  }
  .btn-cta:hover { background: var(--gr-green-dark); }

  /* Sticky CTA */
  .sticky-cta {
    bottom: 0;
    background: rgba(255,255,255,.85);
    backdrop-filter: blur(6px);
    border-top: 1px solid var(--gr-border);
    padding: .6rem var(--pad-x);
    margin-top: 2rem;
  }

  /* Accessibility helper */
  .sr-only {
    position: absolute !important;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
  }
</style>