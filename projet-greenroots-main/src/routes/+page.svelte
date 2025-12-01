<script>
  import { onMount, onDestroy } from 'svelte';
  import CampaignCard from '../lib/assets/components/CampaignCard.svelte';
  import TreeCard from '../lib/assets/components/TreeCard.svelte';

  // ================================
  // STATE VARIABLES
  // ================================
  let currentIndex = 0; // Reserved for future carousel/slider use
  let campaigns = [];   // List of active campaigns from API
  let trees = [];       // List of featured trees from API
  let sectionEl;        // DOM reference for scroll animation
  let rafId = null;     // requestAnimationFrame ID

  // ================================
  // FETCH ACTIVE CAMPAIGNS
  // ================================
  async function fetchCampaigns() {
    try {
      const response = await fetch('http://localhost:3000/api/campaigns/landing', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('API Error: ' + response.status);

      const data = await response.json();
      campaigns = data.campaigns;
    } catch (err) {
      console.error("fetchCampaigns error:", err);
    }
  }

  // ================================
  // FETCH FEATURED TREES
  // ================================
  async function fetchTrees() {
    try {
      const response = await fetch('http://localhost:3000/api/trees/landing', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('API Error: ' + response.status);

      const data = await response.json();
      trees = data.trees;
    } catch (err) {
      console.error("fetchTrees error:", err);
    }
  }

  // ================================
  // SCROLL ANIMATION HANDLERS
  // ================================
  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function computeProgress() {
    const rect = sectionEl.getBoundingClientRect();
    const vh = window.innerHeight || 1;

    // Progress from 0 (not visible) to 1 (centered on screen)
    const raw = 1 - (rect.top / (vh * 1));
    const eased = Math.pow(clamp01(raw), 0.65); // 0.65 gives smoother ease-out

    sectionEl.style.setProperty('--scroll', String(eased));
  }

  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      computeProgress();
    });
  }

  // ================================
  // LIFECYCLE — onMount
  // ================================
  onMount(() => {
    fetchCampaigns();
    fetchTrees();
    document.title = 'GreenRoots - Accueil';

    // Scroll tracking only client-side
    if (sectionEl) {
      sectionEl.style.setProperty('--scroll', '0');
      computeProgress();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  });
</script>
<svelte:head>
  <title>GreenRoots - Accueil</title>
  <meta name="description" content="Bienvenue sur GreenRoots, l'association dédiée à la reforestation et à la biodiversité. Découvrez nos campagnes et financez des arbres pour un avenir plus vert." />
</svelte:head>
<!-- ================================
     PRESENTATION SECTION
================================ -->
<section class="presentation-block" bind:this={sectionEl}>
  <div class="presentation-text">
    <img
      src="/greenroots-logo-noir.webp"
      alt="GreenRoots logo"
      class="logo-presentation"
    />
    <h1>Qui sommes-nous ?</h1>
    <p>
      GreenRoots est une association à but non lucratif qui œuvre pour la reforestation et la biodiversité.
      Nous plantons des arbres avec des communes, écoles et entreprises pour restaurer les forêts,
      protéger les sols et améliorer l’air.
      Chaque geste compte : particuliers, entreprises ou collectivités peuvent soutenir la plantation
      d’arbres et suivre leur impact.
      Notre vision : un monde plus vert, solidaire et durable 🌍💚.
    </p>
  </div>
</section>

<!-- ================================
     CAMPAIGNS SECTION
================================ -->
<section class="campaign-block">
  <h2 class="section-title">Nos campagnes en cours</h2>
  <div class="card-campaign-container grid-cards">
    {#each campaigns as campaign}
      <CampaignCard
        id={campaign.id}
        name={campaign.name}
        description={campaign.description}
        begin_date={campaign.begin_date}
        end_date={campaign.end_date}
        trees={campaign?.trees}
        image={campaign.image}
        country={campaign.country}
      />
    {/each}
  </div>
  <div class="see-more">
    <a href="/campaigns" class="see-more-link">🌳 Voir toutes nos campagnes...</a>
  </div>
</section>

<!-- ================================
     TREES SECTION
================================ -->
<section class="tree-block">
  <h2 class="section-title">Quelques-uns de nos arbres</h2>
  <div class="tree-card-container grid-cards">
    {#each trees as tree}
      <TreeCard tree={tree} />
    {/each}
  </div>
  <div class="see-more">
    <a href="/trees" class="see-more-link">🌳 Voir tous nos arbres...</a>
  </div>
</section>

<!-- ================================
     STYLES
================================ -->
<style>
  /* ===== Presentation Section ===== */
  .presentation-block {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .presentation-text {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgb(231, 227, 227);
    padding: 2rem 1rem 5rem 1rem;
    margin: 0 1rem 0;
    box-shadow: 1px 1px 10px gray;
    text-align: center;
    margin-top: 1rem;
  }

  .presentation-text img {
    width: 30%;
    margin: 2rem 0;
  }

  .presentation-text p {
    width: 80%;
    font-size: 1.5rem;
    color: #000;
    line-height: 1.8;
    margin: 0 2rem;

    /* Scroll-based fade-in animation */
    opacity: calc(var(--scroll, 0));
    transform: translateY(calc((1 - var(--scroll, 0)) * 80px));
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    will-change: opacity, transform;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h1 {
    font-size: 2.5rem;
    background: linear-gradient(90deg, #246e15, #063025);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    margin-bottom: 2rem;
  }

  /* ===== Campaigns Section ===== */
  .campaign-block,
  .tree-block {
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 2rem 3rem;
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
  }

  .campaign-block {
    background: linear-gradient(180deg, #dbdfdb 0%, #ffffff 100%);
    margin-top: 1rem;
  }

  .card-campaign-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.2rem;
    justify-items: center;
    width: 100%;
    max-width: 1600px;
  }

  .logo-presentation:hover {
    filter: hue-rotate(90deg) saturate(500%);
    transition: ease-in-out 1s;
  }

  /* ===== Trees Section ===== */
  .tree-card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    justify-items: center;
    align-content: start;
    width: 100%;
    max-width: 1600px;
    margin: 2rem auto;
    padding: 0 1rem 0;
    overflow: visible;
  }
  
.see-more {
  width: 100%;                     
  display: flex;
  justify-content: flex-end;
  margin-right: 20vh;
  margin-top: 1rem;
}

.see-more-link {
  display: inline-flex;
  align-items: flex-end;
  gap: 0.4rem;
  font-weight: 600;
  color: #2e7d32;
  background: linear-gradient(90deg, #e8f5e9 0%, #dcedc8 100%);
  padding: 0.9rem 1.8rem;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.see-more-link:hover {
  background: linear-gradient(90deg, #43a048b9, #76ad78bd);
  color: #fff;
  box-shadow: 0 6px 12px rgba(85, 136, 87, 0.25);
  transform: translateY(-2px);
}

/* 📱 Centré sur mobile */
@media (max-width: 768px) {
  .see-more {
    justify-content: center;
    margin-right: 0;
  }
}
  /* ===== Responsive Breakpoints ===== */

  /* Tablet */
  @media (max-width: 1024px) {
    .presentation-text {
      width: 85%;
      padding: 1.5rem;
    }

    .presentation-text img {
      width: 40%;
    }

    .presentation-text p {
      font-size: 1.2rem;
      width: 90%;
      line-height: 1.6;
    }

    h1 {
      font-size: 2rem;
    }

    .tree-card-container,
    .grid-cards,
    .card-campaign-container {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.2rem;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    .presentation-text {
      width: 90%;
      padding: 1.2rem;
      border-radius: 15px;
      margin-top: 2.5rem;
    }

    .presentation-text img {
      width: 60%;
      margin-bottom: 1.2rem;
    }

    .presentation-text p {
      width: 95%;
      font-size: 1rem;
      line-height: 1.5;
      text-align: justify;
      margin: 0.5rem 0;
    }

    h1 {
      font-size: 1.6rem;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .tree-block {
      margin: 1rem;
    }

    .tree-card-container,
    .grid-cards,
    .card-campaign-container {
      grid-template-columns: 1fr;
      gap: 0.8rem;
      padding: 0 0.5rem;
    }
  }
</style>