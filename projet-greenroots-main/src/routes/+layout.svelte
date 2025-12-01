<!-- ================================
     GLOBAL HEAD
     (Google Fonts preconnect + stylesheets)
================================ -->
<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Lora:wght@400;700&family=Oswald:wght@200;400;700&display=swap"
    rel="stylesheet"
  >
</svelte:head>

<script>
  import "/src/app.css";
  import { page } from '$app/stores';
  import { user } from "$lib/stores/auth.js";
  import { wishlist } from "$lib/stores/wishlist.js";
  import { onMount } from "svelte"; 

  // Components
  import Navbar from "$lib/assets/components/Navbar.svelte";
  import Footer from "$lib/assets/components/Footer.svelte";
  import Carousel from "$lib/assets/components/Carousel.svelte";
  import Breadcrumbs from "$lib/assets/components/Breadcrumbs.svelte"; 

  // ================================
  // SLIDES DATA FOR CAROUSELS
  // ================================

  // Main homepage carousel (with text overlay)
  const slidesHome = [
    { src: '/img-trees/carousel1.webp', text: ["Petits gestes", "Grandes Forêts"] },
    { src: '/img-trees/carousel2.webp', text: ["Un arbre aujourd'hui", "Des forêts demain"] },
    { src: '/img-trees/carousel3.webp', text: ["Planter un arbre", "C'est écrire une histoire"] }
  ];

  // Simplified carousel version (used on inner pages)
  const slidesSmall = [
    { src: '/img-trees/carousel1.webp' },
    { src: '/img-trees/carousel2.webp' },
    { src: '/img-trees/carousel3.webp' }
  ];

  let mounted = false;
  let lastKey = null;

  $: if (mounted) {
    const id  = $user?.id ?? null;                  
    const key = id ? `user:${id}` : "guest";
    
    if (key !== lastKey) {                         
      lastKey = key;
      wishlist.init(key);
      if (id) wishlist.hydrateFromApi().catch(() => {});
    }
  }
  onMount(() => { mounted = true; });
</script>

<!-- ================================
     GLOBAL PAGE STRUCTURE
================================ -->

<!-- Top navigation bar -->
<Navbar />

<!-- Dynamic carousel:
     - Home page → full variant with text
     - Other pages → smaller variant without text -->
{#if $page.url.pathname === '/'}
  <Carousel slides={slidesHome} variant="home" />
{:else}
  <Carousel slides={slidesSmall} variant="page" />
{/if}

<!-- Breadcrumb navigation (hidden on homepage) -->
{#if $page.url.pathname !== '/'}
  <Breadcrumbs />
{/if}

<!-- Main content slot (dynamic page content injected here) -->
<main>
  <slot /> 
</main>

<!-- Global footer -->
<Footer />

<style>
/* Currently empty — place shared layout-level CSS here if needed */
</style>