<script>
  import "/src/app.css";
  import { onMount } from "svelte";
  import OrderCard from "$lib/assets/components/OrderCard.svelte";

  let user = $state({});
  let orders = $state([]);
  let showConfirmDelete = $state(false);

  // Carousel
  let currentIndex = $state(0);
  const slides = [
    { src: "/img-trees/carousel1.webp",},
    { src: "/img-trees/carousel2.webp",},
    { src: "/img-trees/carousel3.webp",}
  ];
  function next() {
    currentIndex = (currentIndex + 1) % slides.length;
  };
  
  // API calls to get user info and orders
  async function fetchMe() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erreur API : ' + response.message);
      const data = await response.json();
      user = data.user;
      // Process user info data
    } catch (error) {
      console.error("Erreur fetchUserInfo :", error);
    }
  };

  async function fetchUserOrders() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/users/me/orders', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erreur API : ' + response.message);
      const data = await response.json();
      orders = data.orders;
      // Process user orders data
    } catch (error) {
      console.error("Erreur fetchUserOrders :", error);
    }
  };

  // API calls to delete account
  async function deleteAccount() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erreur : ' + response.message);
      // Clear user data and token
      user = {};
      orders = [];
      localStorage.removeItem('token');
      localStorage.removeItem('mail');
      // Redirect to home page after account deletion
      window.location.href = '/';
    } catch (error) {
      console.error("Erreur lors de la suppression du compte :", error);
    }
  };

  // Modal handlers
  function openConfirmDelete() {
    showConfirmDelete = true;
  };
  function closeConfirmDelete() {
    showConfirmDelete = false;
  };

  onMount(() => {
    fetchMe();
    fetchUserOrders();
    // Automatic carousel change every 5 seconds
    setInterval(() => {
      next();
    }, 5000);
    document.title = "Mon Profil - GreenRoots";
  });
</script>

<h1 class="profile-title">Mon compte</h1>
<section class="profile-section" aria-labelledby="profile-info-title">
  <header class="profile-head">
    <div class="head-text">
      <h2 id="profile-info-title" class="profile-subtitle">Informations personnelles</h2>
      <p class="head-sub">{user.firstname} {user.lastname} · {user.mail}</p>
    </div>
  </header>
  <dl class="profile-grid">
    <div class="item">
      <dt>Nom</dt><dd>{user.lastname}</dd>
    </div>
    <div class="item">
      <dt>Prénom</dt><dd>{user.firstname}</dd>
    </div>
    <div class="item">
      <dt>Email</dt><dd>{user.mail}</dd>
    </div>
    <div class="item">
      <dt>Téléphone</dt><dd>{user.phone_number}</dd>
    </div>
    <div class="item span-2">
      <dt>Adresse</dt><dd>{user.address_number} {user.address_streetname}</dd>
    </div>
    <div class="item">
      <dt>Code Postal</dt><dd>{user.postal_code}</dd>
    </div>
    <div class="item">
      <dt>Ville</dt><dd>{user.city}</dd>
    </div>
    <!-- <div class="item"><dt>Pays</dt><dd>{user.country}</dd></div> -->
  </dl>
  <div class="profile-cta">
    <a href="/auth/mycount/edit" class="cta edit">Modifier</a>
    <button class="cta delete" onclick={openConfirmDelete}>Supprimer mon compte</button>
  </div>
</section>
<section class="order-section">
  <h2 class="order-subtitle">Mes commandes</h2>
  {#if orders && orders.length > 0}
    {#each orders as order}
      <OrderCard {order} />
    {/each}
  {:else}
    <p>Aucune commande trouvée.</p>
  {/if}
</section>
<!-- Modal -->
{#if showConfirmDelete}
  <div 
    class="modal-backdrop" 
    role="dialog" 
    aria-modal="true" 
    aria-labelledby="confirmDeleteTitle"
  >
    <div class="modal-content">
      <h2 id="confirmDeleteTitle">Confirmer la suppression</h2>
      <p>
        Êtes-vous sûr de vouloir supprimer votre compte ? 
        <span class="warning-text">Cette action est irréversible.</span>
      </p>
      <div class="modal-actions">
        <button class="btn-cancel" onclick={closeConfirmDelete}>Annuler</button>
        <button class="btn-confirm" onclick={deleteAccount}>Oui, supprimer</button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* ===Profile Styles=== */
  .profile-section{
    width: min(960px, 94%);
    margin: 2rem auto;
    padding: 1.5rem 1.5rem 1.75rem;
    background: #fff;
    border: 1px solid rgba(36,110,21,.12);
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,.06);
  }
  .profile-title{
    font-size: clamp(2rem, 3.2vw, 2.6rem);
    background: linear-gradient(90deg, #246e15, #000000);
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent; color:transparent;
    margin: 0 auto 1.25rem;
    width:min(960px, 94%);
    text-align: center;
    margin-top: 1.5rem;
  }

  /* Header */
  .profile-head{
    display:flex; gap:1rem; align-items:center;
    padding-bottom: .75rem; margin-bottom: 1rem;
    border-bottom: 1px dashed rgba(36,110,21,.25);
  }
  .head-text .profile-subtitle{
    margin:0; font-size:1.25rem; line-height:1.2;
    background: linear-gradient(90deg, #246e15, #0b2512);
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent; color:transparent;
  }
  .head-sub{
    margin:.25rem 0 0; font-size:.95rem; color:#3b4a3f;
    opacity:.9;
  }

  /* Data Grid */
  .profile-grid{
    display:grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: .9rem 1rem;
    margin-top:.25rem;
  }
  @media (min-width: 720px){
    .profile-grid{ grid-template-columns: repeat(3, minmax(0,1fr)); }
  }
  .profile-grid .item{
    padding:.9rem 1rem;
    background:#f7fbf8;
    border:1px solid rgba(36,110,21,.12);
    border-radius:10px;
    transition: box-shadow .2s ease, transform .2s ease;
  }
  .profile-grid .item:hover{
    box-shadow:0 6px 16px rgba(0,0,0,.06);
    transform: translateY(-1px);
  }
  .profile-grid .item.span-2{ grid-column: span 2; }
  @media (min-width: 720px){
    .profile-grid .item.span-2{ grid-column: span 2; }
  }
  .profile-grid dt{
    font-size:.78rem;
    text-transform:uppercase;
    letter-spacing:.06em;
    color:#2a5b2b;
    opacity:.8;
    margin-bottom:.25rem;
  }
  .profile-grid dd{
    margin:0; font-size:1.02rem; color:#132016;
    word-break: break-word;
  }

  /* CTA */
  .profile-cta{
    display:flex; gap:.75rem; margin-top:1.25rem; justify-content:flex-end; width:100%;
  }
  .cta{
    padding:.6rem 1.1rem; border-radius:10px; border:1px solid transparent;
    font-weight:600; text-decoration:none; cursor:pointer;
    transition: transform .15s ease, box-shadow .15s ease, background-color .15s ease, border-color .15s ease;
  }
  .cta.edit{
    background:#ffffff; color:#246e15; border-color:#246e15;
  }
  .cta.edit:hover{
    box-shadow:0 4px 12px rgba(36,110,21,.18);
    transform: translateY(-1px);
  }
  .cta.delete{
    background:#b30000; color:#fff;
  }
  .cta.delete:hover{
    filter: brightness(0.95);
    transform: translateY(-1px);
  }

  /* Order Styles */
  /* ====== Section commandes : conteneur ====== */
  .order-section{
    width: min(960px, 94%);
    margin: 1.25rem auto 0;
  }
  .order-subtitle{
    font-size: clamp(1.25rem, 2.4vw, 1.6rem);
    margin: 0 0 .75rem;
    background: linear-gradient(90deg, #246e15, #0b2512);
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent; color:transparent;
    letter-spacing: .2px;
  }

  /* === Modale backdrop === */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }

  /* === Modal container === */
  .modal-content {
    background: #fff;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    width: min(90%, 400px);
    text-align: center;
    animation: fadeIn 0.25s ease-in-out;
  }
  #confirmDeleteTitle {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--color-primary, #1c6b48);
  }
  .modal-content p {
    margin-bottom: 1.5rem;
    line-height: 1.4;
  }
  .warning-text {
    color: #b30000;
    font-weight: 600;
  }
  .modal-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  .btn-cancel,
  .btn-confirm {
    padding: 0.6rem 1.4rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: transform 0.15s ease;
  }
  .btn-cancel {
    background-color: #f5f5f5;
    color: #333;
  }
  .btn-cancel:hover {
    transform: scale(1.05);
  }
  .btn-confirm {
    background-color: #c0392b;
    color: white;
  }

  .btn-confirm:hover {
    transform: scale(1.05);
    background-color: #a93226;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
</style>
