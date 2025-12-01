<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { isAuthenticated } from "$lib/stores/auth.js";
  import { wishlist, wishlistList } from "$lib/stores/wishlist.js";
  import TreeCard from "$lib/assets/components/TreeCard.svelte";

  let mounted = false;
  let loading = true;
  let error = "";
  let byId = new Map();

  function toTreeArray(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.trees)) return data.trees;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.rows)) return data.rows;
    if (data.id && (data.name || data.title)) return [data]; 
    return [];
  }
  async function loadTrees(idsToLoad) {
    try {
      if (!idsToLoad || idsToLoad.length === 0) return;
      const token = localStorage.getItem("token");
      const headers = $isAuthenticated && token ? { Authorization: `Bearer ${token}` } : {};
      const idsParam = idsToLoad.join(",");
      let res = await fetch(`http://localhost:3000/api/trees?ids=${idsParam}`, { headers });

      if (res.ok) {
        const text = await res.text();
        let data = null; try { data = text ? JSON.parse(text) : null; } catch {}
        const arr = toTreeArray(data);

        if (!arr.length && data) {
          console.warn("Réponse batch inattendue pour /api/trees?ids=", idsParam, data);
        }

        for (const t of arr) byId.set(t.id, t);
      } else {
        // Fallback
        const results = await Promise.all(idsToLoad.map(async (id) => {
          const r = await fetch(`http://localhost:3000/api/trees/${id}`, { headers });
          if (!r.ok) throw new Error(`GET /api/trees/${id} -> ${r.status}`);
          const text = await r.text();
          let data = null; try { data = text ? JSON.parse(text) : null; } catch {}
          const arr = toTreeArray(data);
          return arr.length ? arr[0] : null;
        }));

        for (const t of results.filter(Boolean)) byId.set(t.id, t);
      }
      byId = new Map(byId); // trigger reactivity
    } catch (e) {
      console.error(e);
      error = e?.message || "Erreur de chargement des arbres";
    }
  }

  onMount(async () => {
    mounted = true;
    if ($isAuthenticated) {
      try { await wishlist.hydrateFromApi(); } catch {}
    }
    loading = false;
  });

  // Reactive data
  $: ids = $wishlistList ?? [];
  $: if (mounted && ids?.length) {
    const missing = ids.filter((id) => !byId.has(id));
    if (missing.length) loadTrees(missing);
  }

  $: visibleTrees = ids.map((id) => byId.get(id)).filter(Boolean);
</script>

{#if !$isAuthenticated}
  <section class="guard">
    <h1>Ma liste d’envies</h1>
    <p>Connectez-vous pour voir votre liste d’envies complète.</p>
  </section>
{:else}
  <section class="wishlist">
    <h1>Ma liste d’envies</h1>
    {#if error}<p class="error">{error}</p>{/if}
    {#if loading}
      <p aria-live="polite">Chargement…</p>
    {:else if ids.length === 0}
      <p>Votre liste d’envies est vide.</p>
    {:else}
      <div class="grid">
        {#each visibleTrees as tree (tree.id)}
          <div out:fade={{ duration: 180 }}>
            <TreeCard {tree} />
          </div>
        {/each}
      </div>
    {/if}
  </section>
{/if}

<style>
        /* ===== Page container ===== */
    .wishlist,
    .guard{
        width: min(100%, 1100px);
        margin-inline: auto;
        padding: clamp(1rem, 3vw, 1.5rem);
    }

    /* ===== Heading ===== */
    .wishlist h1,
    .guard h1{
        font-size: clamp(1.4rem, 4vw, 2rem);
        margin: 0 0 .5rem 0;
        text-align: center;
        background: linear-gradient(90deg, #246e15, #0b2512);
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: transparent;
    }

    /* ===== Empty / loading / errors ===== */
    .wishlist p,
    .guard p{ 
        margin: .25rem 0 .75rem;
        color: #3b4a3f;
        font-size: 1rem;
    }
    .wishlist .error{
        color: #b00020;
        background: #fdecee;
        border: 1px solid rgba(176,0,32,.18);
        padding: .65rem .8rem;
        border-radius: 10px;
        margin: .5rem 0 1rem;
    }

    /* ===== Guard (not logged in) ===== */
    .guard{
        background: #ffffff;
        border: 1px solid rgba(36,110,21,.12);
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(0,0,0,.06);
        text-align: center;
        padding-block: clamp(1rem, 5vw, 2rem);
    }

    /* ===== Grid of trees ===== */
    .grid{
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: clamp(.8rem, 2.5vw, 1.25rem);
        margin-top: .75rem;
        justify-content: center;
    }

    /* Make sure nested cards don’t overflow */
    .grid > *{ min-width: 0; }

    /* ===== Card exit transition: respect reduced motion ===== */
    @media (prefers-reduced-motion: reduce){
        .grid > div{ transition: none !important; }
    }

    /* ===== Subtle page background on small screens (breathing room) ===== */
    @media (max-width: 640px){
        .wishlist,
        .guard{
            margin-inline: clamp(.75rem, 4vw, 1rem);
            margin-left: 0;
        }
    }

    /* ===== Medium screens: slightly tighter gutters ===== */
    @media (min-width: 641px) and (max-width: 1024px){
        .wishlist,
        .guard{
            padding-inline: clamp(1rem, 3vw, 1.25rem);
        }
    }

    /* ===== High-contrast tweak for status text ===== */
    @media (prefers-contrast: more){
        .wishlist .error{
            color: #7a0016; border-color: #7a0016;
        }
    }
    @media (max-width: 560px){
        .grid{
            grid-template-columns: min(100%, 420px);
            padding-inline: clamp(.75rem, 4vw, 1rem);
        }
        .grid > *{
            max-width: 420px;    
            width: 100%;             
            margin-inline: auto;    
        }
    }
</style>