<script>
  // ===============================
  // Props
  // ===============================
  // slides: array of { src, text } objects passed by parent component
  export let slides = [];
  // variant: defines height style ("home" for large, "page" for small)
  export let variant = 'page'; // accepted values: "home" or "page"

  // ===============================
  // Internal state
  // ===============================
  let currentIndex = 0; // current slide index

  // ===============================
  // Logic
  // ===============================
  // Moves to the next slide; loops back at the end
  const next = () => (currentIndex = (currentIndex + 1) % slides.length);

  // Auto-advance every 5 seconds
  setInterval(next, 5000);
</script>

<!-- ===============================
     CAROUSEL CONTAINER
     variant defines layout height
================================ -->
<div class="carousel {variant}">
  {#each slides as slide, index}
    <!-- Each slide becomes active if its index matches currentIndex -->
    <div class="slide" class:active={index === currentIndex}>
      <!-- Slide background image -->
      <img src={slide.src} alt="" />
      
      <!-- Optional text overlay (supports multiple lines) -->
      {#if slide.text}
        <div class="slide-text">
          {#each slide.text as line}
            <p>{line}</p>
          {/each}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  /* ===============================
     BASE STYLES
     =============================== */
  .carousel {
    position: relative;
    width: 100vw;
    overflow: hidden;
  }

  /* Variant: home → large hero banner */
  .carousel.home {
    height: 60vh;
  }

  /* Variant: page → smaller banner */
  .carousel.page {
    height: 30vh;
  }

  /* Each slide is absolutely positioned and fades via opacity */
  .slide {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.7s ease-in-out;
  }

  /* The visible slide */
  .slide.active {
    opacity: 1;
  }

  /* Image covers the full slide area */
  .slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Text overlay at bottom-left corner */
  .slide-text {
    position: absolute;
    bottom: 50px;
    left: 50px;
    color: white;
    font-size: 2rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  }
</style>