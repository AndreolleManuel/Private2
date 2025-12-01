<script>
  import ProgressBar from "$lib/assets/components/ProgressBar.svelte";
  import { onMount } from "svelte";
  import { addToCart } from "$lib/stores/cart.js";
  import { treeProgress } from "$lib/utils/ProgressTree.js";
  import { formatPriceToDisplay } from "$lib/utils/PriceFormatter.js";

  export let params;

  let tree = [];
  const treeId = params.id;

  // ======== Fetch tree details from API ========
  async function fetchTree() {
    try {
      const response = await fetch(`http://localhost:3000/api/trees/${treeId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error("Erreur API : " + response.message);
      const data = await response.json();
      tree = data.tree;
    } catch (error) {
      console.error("Erreur fetchTree :", error);
    }
  }

  // ======== Lifecycle ========
  onMount(() => {
    fetchTree();
  });
</script>
<svelte:head>
  <title>Détails de l'arbre | GreenRoots</title>
  <meta name="description" content="Découvrez les détails de l'arbre que vous souhaitez financer. Participez à la reforestation avec GreenRoots." />
</svelte:head>
<!-- ======== PAGE CONTENT ======== -->
{#if tree}
  <div class="tree-detail-wrapper">
    <section class="tree-detail-card" itemscope itemtype="http://schema.org/Product">
      
      <!-- === IMAGE BLOCK === -->
      <div class="tree-detail-media">
        <img src={tree.image} alt={tree.name} itemprop="image" loading="eager" />
      </div>

      <!-- === INFO BLOCK === -->
      <div class="tree-detail-info">
        <hgroup class="tree-detail-header">
          <h1 class="tree-detail-name" itemprop="name">{tree.name}</h1>
          <h2 class="tree-detail-latin">{tree.latin_name}</h2>
        </hgroup>

        <!-- === BUY PANEL === -->
        <div class="tree-detail-buy">
          <p class="tree-detail-price"><strong>{formatPriceToDisplay(tree.price)}</strong></p>
          <button class="tree-detail-btn" onclick={() => addToCart(tree)}>Ajouter au panier</button>
          <p class="tree-detail-stock">
            {tree.stock - tree.quantity} / {tree.stock} financés
          </p>
        </div>

        <!-- === PROGRESS BAR === -->
        <ProgressBar value={treeProgress(tree.stock, tree.quantity)} showPercent={true} />

        <!-- === DESCRIPTION === -->
        <article class="tree-detail-description" itemprop="description">
          <p>{tree?.specie?.description}</p>
        </article>

        <!-- === LINKS === -->
        <p class="tree-detail-links">
          <a href="/campaigns/{tree.campaign_id}" class="tree-detail-link">{tree?.campaign?.name}</a>
          <a href="/trees" class="tree-detail-link">Retour</a>
        </p>
      </div>

      <!-- === STICKY CTA (mobile) === -->
      <div class="tree-detail-sticky" role="region" aria-label="Actions rapides">
        <span class="tree-detail-sticky-price">{formatPriceToDisplay(tree.price)}</span>
        <button class="tree-detail-btn" onclick={() => addToCart(tree)}>Ajouter au panier</button>
      </div>
    </section>
  </div>
{:else}
  <p>Arbre introuvable 🚫</p>
{/if}

<!-- ======== STYLES ======== -->
<style>
  /* === Layout === */
  .tree-detail-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: calc(100vh - 200px);
    padding: 2rem 1rem;
  }

  .tree-detail-card {
    --gr-green: #2e7d32;
    --gr-green-hover: #1b5e20;
    --gr-text: #0f172a;
    --gr-muted: #64748b;
    --radius: 20px;
    --shadow: 0 12px 32px rgba(0, 0, 0, 0.15),
               0 4px 16px rgba(0, 0, 0, 0.08);

    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: clamp(1rem, 3.5vw, 2rem);
    align-items: start;
    max-width: min(1600px, 98vw);
    margin: clamp(1rem, 1vw, 1.5rem) auto;
    padding: clamp(1.5rem, 3vw, 2.5rem);
    background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    border: 1px solid rgba(0, 0, 0, 0.06);
    position: relative;
    overflow: hidden;
    color: var(--gr-text);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  /* Decorative corner fold */
  .tree-detail-card::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    background: linear-gradient(-135deg, transparent 50%, rgba(0, 0, 0, 0.02) 50%, rgba(0, 0, 0, 0.04) 100%);
    clip-path: polygon(0% 0%, 100% 100%, 100% 0%);
    pointer-events: none;
  }

  /* Hover elevation */
  .tree-detail-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18), 0 6px 20px rgba(0, 0, 0, 0.1);
  }

  /* === Image === */
  .tree-detail-media {
    position: relative;
    overflow: hidden;
    border-radius: 14px;
    aspect-ratio: 4 / 3;
    background: #f1f5f9;
  }

  .tree-detail-media img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
  }

  .tree-detail-media:hover img {
    transform: scale(1.03);
  }

  /* === Info block === */
  .tree-detail-info {
    display: grid;
    gap: 1rem;
  }

  .tree-detail-header h1 {
    font-size: clamp(1.6rem, 3.5vw, 2rem);
    line-height: 1.15;
    background: linear-gradient(90deg, #246e15, #000);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 0 0.25rem 0;
  }

  .tree-detail-latin {
    font-size: clamp(1rem, 2.2vw, 1.125rem);
    font-style: italic;
    color: var(--gr-muted);
    margin: 0;
  }

  /* === Purchase area === */
  .tree-detail-buy {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.75rem 1rem;
    align-items: center;
  }

  .tree-detail-price {
    grid-column: 1 / -1;
    font-size: clamp(1.25rem, 2.8vw, 1.6rem);
    margin: 0;
  }

  .tree-detail-btn {
    border: 0;
    border-radius: 999px;
    padding: 0.75rem 1.1rem;
    font-weight: 600;
    background: var(--gr-green);
    color: #fff;
    box-shadow: 0 4px 14px rgba(46, 125, 50, 0.25);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .tree-detail-btn:hover {
    background: var(--gr-green-hover);
    transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(46, 125, 50, 0.28);
  }

  .tree-detail-stock {
    margin: 0;
    color: var(--gr-muted);
    font-size: 0.95rem;
  }

  /* === Description === */
  .tree-detail-description p {
    margin: 0;
    line-height: 1.6;
  }

  /* === Links === */
  .tree-detail-links {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4rem;
  }

  .tree-detail-link {
    font-weight: 600;
    text-decoration: none;
    color: var(--gr-green);
    border-bottom: 2px solid transparent;
    transition: color 0.2s ease, border-color 0.2s ease;
  }

  .tree-detail-link:hover {
    color: var(--gr-green-hover);
    border-color: currentColor;
  }

  /* === Sticky CTA (mobile) === */
  .tree-detail-sticky {
    position: sticky;
    bottom: 0;
    display: none;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: saturate(180%) blur(8px);
    border-top: 1px solid #e2e8f0;
  }

  .tree-detail-sticky-price {
    font-weight: 700;
    font-size: 1.05rem;
  }

  /* === Responsive === */
  @media (max-width: 720px) {
    .tree-detail-sticky {
      display: flex;
      bottom: -4rem;
    }
    .tree-detail-buy .tree-detail-btn {
      display: none;
    }
    .tree-detail-card {
      grid-template-columns: 1fr;
      margin-top: 5rem;
    }
    .tree-detail-media {
      aspect-ratio: 16 / 9;
    }
    .tree-detail-header h1 {
      font-size: 1.5rem;
    }
    .tree-detail-latin {
      font-size: 1rem;
    }
    .tree-detail-price {
      font-size: 1.25rem;
    }
  }
</style>