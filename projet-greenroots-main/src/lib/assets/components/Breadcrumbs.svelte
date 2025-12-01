<script>
  import { page } from '$app/stores';


  // ===============================
  // CONSTANTS
  // ===============================

  // API base URL for fetching campaign/tree details
  const API_BASE = 'http://localhost:3000/api';

  // Human-readable route names for breadcrumb display
  const ROUTE_NAMES = {
    campaigns: 'Campagnes',
    trees: 'Arbres',
    cart: 'Panier',
    contact: 'Contact',
    auth: 'Authentification',
    signup: 'Inscription',
    login: 'Connexion',
    mycount: 'Mon compte',
    edit: 'Éditer le profil',
    orders: 'Commandes',
    confirm: 'Confirmation',
    legal: 'Mentions légales',
    wishlist: 'Liste d\'envies'
  };

  // Cache to store previously fetched names (avoids redundant API calls)
  const nameCache = new Map();

  // ===============================
  // BUILD SYNCHRONOUS BREADCRUMBS
  // ===============================
  // Generates a fallback breadcrumb trail directly from the URL path.
  // This runs server-side (or before API names are available).
  function buildSync(pathname) {
    const segs = pathname.split('/').filter(Boolean);
    const crumbs = [{ name: 'Accueil', path: '/' }];
    let cur = '';

    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];
      cur += `/${seg}`;
      const parent = segs[i - 1];

      // Detect if current segment is part of a dynamic entity (campaign/tree)
      if (parent === 'campaigns') crumbs.push({ name: 'Détail campagne', path: cur });
      else if (parent === 'trees') crumbs.push({ name: 'Détail arbre', path: cur });
      else crumbs.push({ name: ROUTE_NAMES[seg] ?? seg, path: cur });
    }
    return crumbs;
  }

  // ===============================
  // FETCH ENTITY NAME (ASYNC)
  // ===============================
  // Fetches campaign or tree name from API and caches it.
  async function fetchEntityName(collection, idOrSlug) {
    const key = `${collection}/${idOrSlug}`;
    if (nameCache.has(key)) return nameCache.get(key);

    try {
      const res = await fetch(`${API_BASE}/${collection}/${idOrSlug}`);
      const data = res.ok ? await res.json() : null;

      // Extract name from API response (handles different shapes)
      const name =
        data?.campaign?.name ??
        data?.tree?.name ??
        data?.name ??
        (collection === 'campaigns' ? 'Détail campagne' : 'Détail arbre');

      nameCache.set(key, name);
      return name;
    } catch {
      // Fallback name if request fails
      const fallback = collection === 'campaigns' ? 'Détail campagne' : 'Détail arbre';
      nameCache.set(key, fallback);
      return fallback;
    }
  }

  // ===============================
  // REACTIVE STATEMENTS
  // ===============================

  // Current path (auto-updated by Svelte store)
  $: pathname = $page.url.pathname;

  // Breadcrumb list (from data loader if available, otherwise built locally)
  $: crumbs = $page.data?.breadcrumbs ?? buildSync(pathname);

  // ===============================
  // CLIENT-SIDE NAME UPGRADE
  // ===============================
  // After hydration, replaces "Détail campagne/arbre" with the real entity name.
  $: (async () => {
    if (!crumbs || crumbs.length < 2) return;

    const segs = pathname.split('/').filter(Boolean);
    for (let i = 1; i < segs.length; i++) {
      const parent = segs[i - 1];
      const seg = segs[i];

      // Check if segment belongs to campaigns or trees
      if (parent === 'campaigns' || parent === 'trees') {
        const last = crumbs.at(-1);

        // Only replace placeholder names
        if (last && (last.name === 'Détail campagne' || last.name === 'Détail arbre')) {
          const name = await fetchEntityName(parent, seg);

          // Update last crumb reactively
          crumbs = crumbs.map((c, idx) =>
            idx === crumbs.length - 1 ? { ...c, name } : c
          );
        }
      }
    }
  })();
</script>

<!-- ===============================
     BREADCRUMBS MARKUP
================================ -->
{#if crumbs && crumbs.length > 1}
  <nav class="breadcrumbs" aria-label="Fil d’Ariane">
    <ol>
      {#each crumbs as crumb, index}
        <li>
          {#if index < crumbs.length - 1}
            <!-- Intermediate breadcrumb links -->
            <a href={crumb.path}>{crumb.name}</a>
          {:else}
            <!-- Current page (no link) -->
            <span class="current" aria-current="page">{crumb.name}</span>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>
{/if}

<style>
  /* ===============================
     BREADCRUMB CONTAINER
  =============================== */
  .breadcrumbs {
    background-color: #f5f5f5;
    padding: 10px 15px;
    margin: 10px 0;
    border-radius: 4px;
    font-size: 14px;
  }

  /* Ordered list (flex row layout) */
  .breadcrumbs ol {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin: 0;
    padding: 0;
  }

  /* Each breadcrumb item */
  .breadcrumbs li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  /* Separator between crumbs */
  .breadcrumbs li:not(:last-child)::after {
    content: "/";
    color: #666;
  }

  /* Link styles */
  .breadcrumbs a {
    color: #246e15;
    text-decoration: none;
  }

  .breadcrumbs a:hover {
    text-decoration: underline;
  }

  /* Current page crumb */
  .current {
    font-weight: 700;
    color: #333;
  }
</style>