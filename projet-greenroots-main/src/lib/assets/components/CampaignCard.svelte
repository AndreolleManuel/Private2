<script>
  // ===============================
  // Imports
  // ===============================
  // Local component for progress display
  import ProgressBar from "$lib/assets/components/ProgressBar.svelte";
  // Utility function to compute campaign completion percentage
  import { campaignProgress } from "../../utils/ProgressCampaign.js";
  // Date formatters for display and metadata
  import { formatDateToDisplay, formatDateToIso } from "../../utils/DateFormatter.js";
  
  // ===============================
  // Props received from parent
  // ===============================
  export let id;
  export let name;
  export let image;
  export let begin_date;
  export let end_date;
  export let trees = [];
  export let country;

  // ===============================
  // Date formatting
  // ===============================
  // Convert to ISO for SEO microdata
  const beginIso = formatDateToIso(begin_date);
  const endIso = formatDateToIso(end_date);

  // Convert to localized readable format for UI
  const beginDisplay = formatDateToDisplay(begin_date);
  const endDisplay = formatDateToDisplay(end_date);

  // ===============================
  // Progress calculation (reactive)
  // ===============================
  $: progress = campaignProgress(trees);
</script>

<!-- ===============================
     CAMPAIGN CARD CONTAINER
================================ -->
<a
  href={`/campaigns/${id}`}
  class="campaign-card" 
  aria-labelledby={`title-${id}`} 
  itemscope 
  itemtype="http://schema.org/Event"
>
  <!-- SEO metadata for structured data -->
  <meta itemprop="name" content={name}>
  <meta itemprop="image" content={image}>
  <meta itemprop="startDate" content={begin_date}>
  <meta itemprop="endDate" content={end_date}>
  <meta itemprop="url" content={`/campaigns/${id}`}>
  <meta itemprop="country" content={country}>

  <!-- Country title displayed above the image -->
  <h3 class="card-title">{country?.name}</h3>

  <!-- Campaign cover image -->
  <img 
    src={image} 
    alt={`Campagne ${name}`} 
    class="campaign-img" 
    loading="lazy"
    decoding="async"
    fetchpriority="low"
    itemprop="image"
  />
  
  <!-- Hover overlay with info and button -->
  <div class="overlay">
     
    <!-- Dates section -->
    <div class="date-container">
      <p class="date">
        Début: 
        <time datetime={beginIso}></time>{beginDisplay}</p>
      <p class="date">
        Fin: 
        <time datetime={endIso}></time>{endDisplay}</p>
    </div>

    <!-- Progress bar -->
    <div class="progress-wrap">
      <ProgressBar
        value={progress}
        showPercent={true}
      />
    </div>

    <!-- Call-to-action button -->
    <button 
      class="btn"
      on:click|stopPropagation={() => (window.location.href = `/campaigns/${id}`)}
    >
      Voir détails
    </button>
  </div>
</a>

<style>
  /* ===============================
     CARD CONTAINER
  =============================== */
  .campaign-card {
    position: relative;
    overflow: hidden;
    background: #888080e1;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform .25s ease, box-shadow .25s ease;
    width: 100%;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    margin: 0rem;
    aspect-ratio: 4/5;
  }

  /* Hover animation (lift up + shadow) */
  .campaign-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 22px rgba(0,0,0,0.15);
  }

  /* ===============================
     CARD IMAGE
  =============================== */
  .campaign-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    flex: 1;
    display:block;
    transition: transform 0.35s ease;
  }
  .campaign-card:hover .campaign-img,
  .campaign-card:focus-within .campaign-img {
    transform: scale(1.03);
  }

  /* ===============================
     CTA BUTTON
  =============================== */
  .btn {
    pointer-events: auto;
    text-decoration: none;
    background: linear-gradient(to right, #5c975f, #2e7d32a6);
    color: #fff;
    padding: .5rem 1rem;
    border-radius: 15px 0 15px 0;
    border-bottom: 2px solid #000000bb;
    font-weight: bold;
    grid-row: 5;
    align-self: end;
    justify-self: center;
    position: static;
    cursor: pointer;
  }

  /* ===============================
     OVERLAY (appears on hover)
  =============================== */
  .overlay {
    position: absolute;
    inset: 0;
    padding: 0.5rem;
    padding-top: var(--overlay-top);
    display: grid;
    grid-template-rows: 1fr auto auto auto auto;
    align-items: end;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity .24s ease, transform .24s ease;
    background: linear-gradient( #ffffff00, gray);
    pointer-events: none;
    z-index: 1;
  }
  .campaign-card:hover .overlay {
    opacity: 1;
    transform: translateY(0);
  }

  /* Progress bar wrapper inside overlay */
  .overlay .progress-wrap {
    grid-row: 3;
    align-self: end;
    width: 100%;
    margin-top: 0.5rem;
    z-index: 2;
  }

  /* Common text style within overlay */
  .overlay p,
  .overlay .btn {
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,.35); 
  }

  /* ===============================
     TITLE (Country name)
  =============================== */
  .card-title {
    text-align: center;
    font-size: 1.6rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 0.6rem 0;
    margin: 0;
    background: linear-gradient(135deg, #567a6b 0%, #54b461 100%);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(2px);
}

  /* ===============================
     DATES
  =============================== */
  .date-container {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    font-weight: 600;
    grid-row: 2;
    align-self: end;
  }
  .date-container .date {
    background: transparent;
  }

  /* ===============================
     RESPONSIVE STYLES
  =============================== */
  @media (max-width: 960px) {
    /* Overlay always visible on smaller devices */
    .overlay {
      opacity: 1;
    }
  }

  @media (max-width: 515px) {
    .campaign-card {
      min-height: 420px;
    }

    .card-title {
      font-size: clamp(0.9rem, 1vw + 0.5rem, 1.2rem);
    }

    .overlay p {
      font-size: 0.9rem;
      line-height: 1.3;
    }

    .btn {
      font-size: 0.85rem;
      padding: 0.4rem 0.6rem;
    }
  }

  @media (max-width: 1400px) {
    .card-title {
      font-size: clamp(1rem, 0.6vw + 0.8rem, 1.4rem);
    }
  }
</style>