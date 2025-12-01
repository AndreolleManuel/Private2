<script>
  import { login, auth, logout } from '$lib/stores/auth.js';
  import { wishlist } from "$lib/stores/wishlist";
  import { cart } from "$lib/stores/cart";
  import Icon from "@iconify/svelte";
  
  // ================================
  // State management (Svelte runes)
  // ================================
  // Tracks login modal visibility
  let isConnexionModalOpen = $state(false);
  // Tracks mobile burger menu state
  let isMenuOpen = $state(false);
  // Controlled inputs for the login form
  let formData = $state({
       mail: '',
       password: ''
   });
   // Transient UI messages for feedback
   let errorMsg = $state('');
   let successMsg = $state('');

  // ================================
  // DOM/UI event handlers
  // ================================
  // Open/close the login modal
  function toggleModal() {
    isConnexionModalOpen = !isConnexionModalOpen;
  };
  // Close modal when user clicks on the backdrop
  function closeOnBackdrop(e) {
    if (e.target === e.currentTarget) {
      isConnexionModalOpen = false;
    }
  };
  // Close modal on Escape key
  function closeOnEscapeKey(e) {
    if (e.key === 'Escape') {
      isConnexionModalOpen = false;
    }
  };
  function stopPropagation(e) {
    e?.stopPropagation?.();
  };
  // Logout user and redirect to home
  function handleLogout() {
    logout();
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith("wishlist:u")) localStorage.removeItem(k);
    }
    wishlist.init('guest'); // Re-initialize wishlist to guest
    cart.set([]); // Clear cart on logout
    window.location.href = '/'; // Redirect to homepage after logout
  }
  // Toggle mobile menu (burger)
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  // Close mobile menu and scroll to top
  function closeMenu() {
    if (isMenuOpen) isMenuOpen = false;
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  // ================================
  // API call for login form
  // ================================
  // Sends credentials to the backend and stores the JWT on success
  async function loginFetch() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.status === 401) {
      logout();
      errorMsg = "Identifiants invalides.";
      setTimeout(() => (errorMsg = ''), 5000);
      return;
    }

    if (!res.ok) {
      // Essaye de lire un message d'erreur JSON si dispo
      let details = '';
      try { const j = await res.json(); details = j?.error || j?.message || ''; } catch {}
      throw new Error(`Erreur API login (${res.status}) ${details}`.trim());
    }

    const data = await res.json();

    // 1) Auth OK -> enregistre tout de suite
    login({ token: data.token, mail: formData.mail });

    // 2) Ferme la modal + feedback succès immédiatement
    formData = { mail: '', password: '' };
    successMsg = 'Connexion réussie !';
    isConnexionModalOpen = false;
    setTimeout(() => { successMsg = ''; }, 3000);

    // 3) Opérations post-login NON bloquantes (wishlist)
    try {
      const { payload } = auth.get();
      const userId = payload?.id;
      if (userId) {
        wishlist.init(`user:${userId}`);
        await wishlist.mergeGuestAndPush(`user:${userId}`);
      } else {
        console.warn("Token sans id : impossible de migrer la wishlist.");
      }
    } catch (mergeErr) {
      // Ne casse PAS l’UX si la fusion échoue
      console.warn('Wishlist merge échoué (non bloquant) :', mergeErr);
      // Optionnel: petit toast non bloquant
      // errorMsg = "Connecté, mais la synchronisation de votre liste d’envies a échoué.";
      // setTimeout(() => (errorMsg=''), 5000);
    }

  } catch (err) {
    console.error('Erreur login :', err);
    errorMsg = 'Erreur de connexion. Veuillez réessayer.';
    setTimeout(() => { errorMsg = ''; }, 5000);
  }
}
      
  

</script>

<!-- ================================
     NAVBAR
================================ -->
<nav class="{isMenuOpen ? 'menu-open' : ''}"> 
  <div class="logo">
    <a href="/" aria-label="Retour à l’accueil">
      <img src="/greenroots-logo-blanc.webp" alt="logo GreenRoots blanc" class="logo-navbar"/>
    </a>
  </div>

  <!-- Main links + auth/cart section -->
  <div class="nav-links {isMenuOpen ? 'open' : ''}">
    <div class="nav-links-pages">
      <ul>
        <li><a href="/campaigns" onclick={closeMenu}>Campagnes</a></li>
        <li><a href="/trees" onclick={closeMenu}>Arbres</a></li>
      </ul>
    </div>

    <div class="nav-links-log">
      <ul>
        {#if !$auth.token}        
          <!-- Not authenticated: show login + signup -->
          <li>
            <button
              class="connexion-button" 
              onclick={event => {
                event.preventDefault(); 
                toggleModal();
              }}>
              Connexion
            </button>
          </li>
          <li><a href="/auth/signup" onclick={closeMenu}>Inscription</a></li>
        {:else}
          <!-- Authenticated: profile + logout -->
          <li><a href="/auth/mycount" onclick={closeMenu}>Mon profil</a></li>
          <li><a href="/wishlist" onclick={closeMenu}>Ma liste d’envies</a></li>
          <li>
            <button
              class="connexion-button" 
              onclick={handleLogout}>
              Déconnexion
            </button>
          </li>
        {/if}    

        <!-- Cart icon + badge -->
        <li class="cart-wrapper">
          <a href="/cart" class="cart-link" onclick={closeMenu}>
            <Icon icon="mdi:cart" width="24" height="24" />
            {#if $cart.length > 0}
              <span class="cart-count">
                {$cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            {/if}
          </a>
        </li>
      </ul>
    </div>
  </div>

  <!-- Burger menu button (mobile) -->
  <button
      class="burger-menu {isMenuOpen ? 'open' : ''}"
      onclick={toggleMenu}
      aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={isMenuOpen}
      aria-controls="main-navigation"
  >
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
  </button>
</nav>

<!-- ================================
     LOGIN MODAL
================================ -->
{#if isConnexionModalOpen}
  <div 
    class="modal-backdrop" 
    aria-label="Connexion" 
    role="dialog" 
    aria-modal="true"
    tabindex="-1"
    onclick={closeOnBackdrop}
    onkeydown={(event) => {closeOnEscapeKey(event)}}
  >
    <form 
      method="POST"
      class="login-form" 
      onsubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        loginFetch();
      }}
    >
      <div 
        onclick={stopPropagation}   
        onkeydown={stopPropagation} 
        role="none"
      >
        <!-- Email input -->
        <label>
          Email
          <input id="mail" name="mail" type="email" bind:value={formData.mail} required>
        </label>

        <!-- Password input with requirements tooltip -->
        <label class="password-field">
          Mot de passe
          <input id="password" name="password" type="password" bind:value={formData.password} required>
          <div class="password-tooltip">
            <strong>Exigences du mot de passe :</strong><br>
            • 6 caractères minimum<br>
            • 1 majuscule<br>
            • 1 minuscule<br>
            • 1 chiffre<br>
            • 1 caractère spécial
          </div>
        </label>

        <!-- Feedback messages -->
        {#if errorMsg}
          <p class="error-message" role="alert">{errorMsg}</p>
        {/if}
        {#if successMsg}
          <p class="success-message" role="alert">{successMsg}</p>
        {/if}

        <!-- Submit -->
        <button type="submit" class="login-button">Se connecter</button>

        <!-- Link to signup -->
        <p class="signup-link">
          Pas encore de compte ? 
          <button 
            type="button"
            class="link-button"
            onclick={() => {
              isConnexionModalOpen = false;
              // Navigate to signup
              window.location.href = '/auth/signup';
            }}
          >
            S'inscrire
          </button>
        </p>
      </div>
    </form>
  </div>
{/if}

<style>
  /* ================================
     NAVBAR BASE STYLES
     Fixed, translucent background, horizontal layout
  ================================ */
  nav {
    height : 10vh;
    width :100%;
    background-color: #9d9d9d62;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    /* position: absolute; */
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
  }
  .nav-links-pages, .nav-links-log {
    display: flex;
    align-items: center;
  }
  .nav-links {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 50%;
  }
  ul {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
  }
  .nav-links-pages li a,
  .nav-links-log li a {
    text-decoration: none;
    margin: 0 10px;
    color: rgb(255, 255, 255);
    font-weight: bold;
  }
  .connexion-button {
    background: none;
    border: none;
    color: inherit;
    text-decoration: none;
    padding: 0;
    font: inherit;
    font-weight: bold;
    color: rgb(255, 255, 255);
    margin: 0 10px;
  }
  .connexion-button:hover {
    color: #ffffff;
    text-shadow: 0px 0px 12px rgb(255, 255, 255) ;
  }
  .logo-navbar:hover {
    filter : hue-rotate(90deg);
    filter : saturate(500%);
    transition : ease-in-out 1s;
  }
  li a:hover {
    color: #ffffff;
    text-shadow: 0px 0px 12px rgb(255, 255, 255) ;
  }

  /* ================================
     BURGER MENU (hidden on desktop)
  ================================ */
  .burger-menu {
    display: none;
    font-size: 2rem;
    cursor: pointer;
    color: white;
  }
  img {  
    background: none;
    border: none;
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font: inherit;
    width: 20%;
  }

  /* ================================
     LOGIN MODAL STYLES
     Backdrop + centered card
  ================================ */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-backdrop .login-form {
    background: linear-gradient(0deg, #f3f3f3, #3c9749);
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  .modal-backdrop label {
    display: block;
    margin-bottom: 1rem;
    font-weight: bold;
  }
  .modal-backdrop input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 0.25rem;
    box-sizing: border-box;
  }
  .modal-backdrop .login-button{
    width: 100%;
    padding: 0.75rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
  }
  .modal-backdrop .login-button:hover {
    background-color: #45a049;
  }
  .signup-link {
    text-align: center;
    margin-top: 1rem;
    color: #666;
    font-size: 0.9rem;
  }

  /* ================================
     Alerts & links inside modal
  ================================ */
  .error-message {
    color: red;
    font-weight: bold;
    margin-top: 0.5rem;
  }
  .success-message {
    color: green;
    font-weight: bold;
    margin-top: 0.5rem;
  }
  .link-button {
    background: none;
    border: none;
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font: inherit;
    font-weight: bold;
    color: #4CAF50;
  }
  .link-button:hover {
    text-decoration: none;
  }

  /* ================================
     Password tooltip on hover
  ================================ */
  .password-field {
    position: relative;
  }
  .password-tooltip {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #333;
    color: white;
    padding: 10px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1001;
    transform: translateY(5px);
    transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    font-weight: normal;
  }
  .password-tooltip::before {
    content: "";
    position: absolute;
    top: -5px;
    left: 20px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #333;
  }
  .password-field:hover .password-tooltip {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

  /* ================================
     CART BADGE
  ================================ */
  .cart-wrapper {
    position: relative;
  }
  .cart-count {
    position: absolute;
    top: -6px;
    right: -10px;
    background: red;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 0.7rem;
    font-weight: bold;
    line-height: 1;
  }
  /* .cart-text { kept as reference, intentionally disabled } */
  /* display: none; margin-left: .25rem; font-weight: bold; color: white; */

  /* ================================
     MOBILE LAYOUT (≤ 560px)
  ================================ */
  @media (max-width: 560px) {
    nav {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 8vh;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: rgba(157, 157, 157, 0.38);
      transition: height 0.4s ease;
      overflow: hidden;
      z-index: 10;
    }
    nav.menu-open {
      /* height: 60vh; */
      overflow: visible;
      background-color: rgba(100, 100, 100, 0.9);
    }
    .logo {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100;
      top: 0;
    }
    .logo-navbar {
      top: 0;
      width: 13rem;
      height: auto;
    }
    .nav-links {
      display: none;
    }
    .nav-links.open {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 8vh;
      left: 0;
      width: 100vw;
      height: calc(60vh - 8vh);
      background: rgba(100, 100, 100, 0.95);
      z-index: 9;
      padding-top: 2rem;
    }
    .nav-links.open ul {
      flex-direction: column;
      gap: .8rem;
    }
    .nav-links.open a, .nav-links.open .connexion-button {
      color: white;
      font-size: 1.4rem;
      text-decoration: none;
    }
    .burger-menu {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 2rem;
      height: 1.8rem;
      position: absolute;
      right: 1rem;
      top: 1.5rem;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      cursor: pointer;
      z-index: 101;
      padding: 0;
    }
    .burger-menu .bar {
      display: block;
      width: 100%;
      height: .2rem;
      background-color: white;
      margin: 4px 0;
      transition: all 0.4s ease;
    }
    .burger-menu.open .bar:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    .burger-menu.open .bar:nth-child(2) {
      opacity: 0;
    }
    .burger-menu.open .bar:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
    }
    .cart-count {
      top: 1rem;
      right: -4rem;
      width: 1.5rem;
      height: 1.5rem;
      background: red;
      color: white;
      border-radius: 80%;
      /* padding: 0; */
      font-size: 0.6rem;
      font-weight: bold;
      line-height: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>