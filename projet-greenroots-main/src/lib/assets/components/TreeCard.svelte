<script>
  import { onMount, onDestroy } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { treeProgress } from "../../utils/ProgressTree.js";
  import { addToCart } from "$lib/stores/cart.js";
  import { wishlist, isInWishlist } from "$lib/stores/wishlist.js";
  import { isAuthenticated } from "$lib/stores/auth.js";
  import { formatPriceToDisplay } from "../../utils/PriceFormatter.js";
  import ProgressBar from "$lib/assets/components/ProgressBar.svelte";

  // ===================================
  // PROPS & INITIAL STATE
  // ===================================
  export let tree;
  let { id, name, image, price, stock, quantity } = tree;
  const wished = isInWishlist(id);
  let showFullDescription = false;

  // Computed reactive values
  $: formattedPrice = formatPriceToDisplay(price);
  $: progress = treeProgress(stock, quantity);

  // ===================================
  // DESCRIPTION HANDLING
  // ===================================
  // Cleanly truncate text without cutting words
  function truncate(text, maxLength = 120) {
    if (!text) return "";
    if (text.length <= maxLength) return text;

    let truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 0) truncated = truncated.slice(0, lastSpace);

    truncated = truncated.replace(/[.,;:!?…]+$/u, "");
    return truncated + " ...";
  }

  // Toggle card expanded mode
  function toggleDescription() {
    showFullDescription = !showFullDescription;
    document.body.classList.toggle("expanded-mode", showFullDescription);

    // Disable grid interactions while popup is active
    const grid = document.querySelector(".trees-grid, .campaigns-grid");
    if (grid) {
      grid.style.transition = "none";
      if (showFullDescription) {
        grid.style.pointerEvents = "none";
      } else {
        setTimeout(() => grid.style.pointerEvents = "auto", 300);
      }
    }
  }

  // ===================================
  // EVENT HANDLERS
  // ===================================
  // Close popup on Escape
  function onKeydown(e) {
    if (e.key === "Escape") {
      showFullDescription = false;
      document.body.classList.remove("expanded-mode");
    }
  }

  // Close popup when clicking outside expanded card
  function onDocumentClick(e) {
    if (!showFullDescription) return;
    const card = e.target.closest(".tree-card");
    const expandedCard = document.querySelector(".tree-card.expanded");
    if (expandedCard && card !== expandedCard) {
      showFullDescription = false;
      document.body.classList.remove("expanded-mode");
    }
  }

  // Reset expanded mode on navigation
  afterNavigate(() => {
    showFullDescription = false;
    document.body.classList.remove("expanded-mode");
  });

  // Wishlist toggle (local or API)
  async function toggleWishlist(e) {
    e.stopPropagation();
    if (!isAuthenticated) {
      wishlist.toggleLocal(id);
      return;
    }
    try {
      await wishlist.toggleWithApi(id);
    } catch (err) {
      console.error("Wishlist API error:", err);
    }
  }

  // ===================================
  // LIFECYCLE HOOKS
  // ===================================
  onMount(() => {
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("click", onDocumentClick, true);
  });

  onDestroy(() => {
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("click", onDocumentClick, true);
    document.body.classList.remove("expanded-mode");
  });
</script>

<!-- ===================================
     CARD MARKUP
=================================== -->
<article
  class="tree-card {showFullDescription ? 'expanded' : ''}"
  itemscope 
  itemtype="http://schema.org/Product"
  aria-labelledby={`tree-title-${id}`}
  data-tree-id={id}
>
  <!-- SEO Metadata -->
  <meta itemprop="name" content={name} />
  <meta itemprop="image" content={image} />
  <meta itemprop="price" content={price / 100} />
  <meta itemprop="priceCurrency" content="EUR" />
  <meta itemprop="url" content={`/trees/${id}`} />

  <!-- Image & Wishlist -->
  <div class="media-wrap">
    <img 
      class="tree-img" 
      src={image} 
      alt={`Arbre ${name}`}
      loading="lazy"
      decoding="async"
      fetchpriority="low"
      itemprop="image" 
    />
    <button
      type="button"
      class="wish-btn"
      aria-pressed={$wished}
      aria-label={$wished ? `Retirer ${name} de ma wishlist` : `Ajouter ${name} à ma wishlist`}
      title={$wished ? "Dans ma wishlist" : "Ajouter à ma wishlist"}
      onclick={toggleWishlist}
    >
      <svg class="heart" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12.1 21.35l-1.1-1.01C5.14 15.2 2 12.28 2 8.99 2 6.42 4.02 4.4 6.59 4.4c1.54 0 3.03.73 3.96 1.86.93-1.13 2.42-1.86 3.96-1.86 2.57 0 4.59 2.02 4.59 4.59 0 3.29-3.14 6.21-8.9 11.35l-1 1.01z"
          class={$wished ? "fill" : "stroke"}
        />
      </svg>
      <span class="sr-only">Wishlist</span>
    </button>
  </div>

  <!-- Info & Description -->
  <div class="tree-info">
    <h3 class="tree-name" id={`tree-title-${id}`} itemprop="name">{name}</h3>

    {#if tree?.specie?.description}
      <p class="tree-description {showFullDescription ? 'expanded' : ''}" itemprop="description">
        {#if showFullDescription}
          {tree.specie.description}
        {:else}
          {truncate(tree.specie.description, 60)}
        {/if}
      </p>

      <button class="see-toggle" type="button" onclick={toggleDescription}>
        {showFullDescription ? "Voir moins " : "Voir plus "}
      </button>
    {/if}

    {#if !showFullDescription}
      <div class="tree-progress">
        <ProgressBar
          value={treeProgress(tree.stock, tree.quantity)}
          showPercent={true}
        />
      </div>
    {/if}
  </div>

  <!-- Price -->
  <p class="tree-price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
    Prix unitaire : <span itemprop="price">{formattedPrice}</span>
  </p>

  <!-- Action Buttons -->
  <div class="btn-container">
    <a 
      href={`/trees/${id}`} 
      class="btn btn-outline" 
      onclick={() => document.body.classList.remove("expanded-mode")}
    >
      Voir Détails
    </a>
    <button 
      onclick={() => addToCart(tree)} 
      type="button" 
      class="btn btn-fill"
      aria-label="Ajouter {name} au panier"
    >
      Ajouter 🛒
    </button>
  </div>
</article>

<!-- ===================================
     STYLES
=================================== -->
<style>
  /* === Card Layout === */
  .tree-card {
    background: linear-gradient(0deg, #cac8c8 25%, #575a58 100%);
    border-radius: 18px;
    overflow: hidden;
    box-shadow:
      0 2px 3px rgba(255, 255, 255, 0.3) inset,
      0 -2px 4px rgba(0, 0, 0, 0.25) inset,
      0 10px 18px rgba(0, 0, 0, 0.25),
      0 5px 10px rgba(0, 0, 0, 0.18),
      0 0 0 1px rgba(0, 0, 0, 0.1);
    transition: all 0.25s ease;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0;
    box-sizing: border-box;
    max-width: 380px;
  }

  .tree-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .tree-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    transition: transform 0.35s ease;
  }

  .tree-card:hover .tree-img {
    transform: scale(1.03);
  }

  /* === Info Section === */
  .tree-info {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    min-height: 120px;
  }

  .tree-name {
    font-size: 1.2rem;
    font-weight: 700;
    background: linear-gradient(90deg, #099b09, #070707);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
    margin: 0.5rem 0 1rem;
    letter-spacing: 0.5px;
    min-height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tree-price {
    font-size: 1.1rem;
    font-weight: 700;
    text-align: center;
    color: #1b5e20;
    margin-top: 0.5rem;
  }

  /* === Buttons === */
  .btn-container {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .btn {
    flex: 1;
    text-align: center;
    padding: 0.5rem 0.8rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.25s ease;
    cursor: pointer;
  }

  .btn-outline {
    border: 2px solid #2e7d32;
    color: #63aa67;
    background: transparent;
  }

  .btn-outline:hover {
    background: rgba(46, 125, 50, 0.1);
  }

  .btn-fill {
    border: none;
    background: linear-gradient(90deg, #43a047, #2e7d32);
    color: #fff;
  }

  .btn-fill:hover {
    background: linear-gradient(90deg, #4caf50, #1b5e20);
  }

  /* === Wishlist === */
  .media-wrap {
    position: relative;
    display: grid;
    aspect-ratio: 4/3;
    overflow: hidden;
  }

  .wish-btn {
    position: absolute;
    top: .6rem;
    right: .6rem;
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 50%;
    background: rgba(255,255,255,.85);
    backdrop-filter: blur(6px);
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: transform .15s ease, background .2s ease, box-shadow .2s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,.15);
  }

  .wish-btn:hover { transform: scale(1.06); }
  .wish-btn:active { transform: scale(.98); }
  .wish-btn:focus-visible { outline: 2px solid #2e7d32; outline-offset: 2px; }

  .heart { width: 22px; height: 22px; }
  .stroke { fill: none; stroke: #2e7d32; stroke-width: 2; }
  .fill { fill: #e53935; }

  .see-toggle {
    align-self: center;
    margin-top: 0.5rem;
    background: none;
    border: none;
    color: #1b5e20;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  /* === Accessibility helper: hides the "Wishlist" text visually === */
.sr-only {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

  .see-toggle:hover { color: #43a047; }

  /* === Popup Mode === */
  .tree-card.expanded {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.05);
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    z-index: 20;
    background: #f6f8f6;
    border-radius: 18px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    transition: all 0.4s ease;
  }

  .tree-card.expanded .tree-img {
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }

  .tree-card.expanded .tree-price,
  .tree-card.expanded .btn-container {
    margin-bottom: 3rem;
  }

  .tree-card.expanded .see-toggle {
    position: static;
    margin-top: 1rem;
    background: rgba(255, 255, 255, 0.9);
    text-align: center;
    padding: 1rem;
    border-radius: 10px;
  }

  /* === Global Overlay === */
  :global(body.expanded-mode::before) {
    content: "";
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 5;
    backdrop-filter: blur(3px);
  }
</style>
