<script>
  import "/src/app.css";
  import { onMount } from "svelte";

  // Set document title when page loads
  onMount(() => {
    document.title = "Mentions Légales - GreenRoots";
  });
</script>

<svelte:head>
  <title>Mentions légales | GreenRoots</title>
  <meta name="description" content="Informations légales de l'association GreenRoots." />
</svelte:head>
<section class="legal-notice">
  <div class="legal-header">
    <h1 class="legal-title">Mentions légales</h1>
    <p class="legal-subtitle">
      Informations légales de l'association GreenRoots
    </p>
  </div>

  <div class="legal-content">
    <!-- Identity -->
    <div class="legal-card">
      <div class="legal-icon">🌿</div>
      <h2 class="legal-section-title">Identité de l'association</h2>
      <div class="legal-item">
        <span class="legal-label">Nom de l'association</span>
        <span class="legal-value">GreenRoots</span>
      </div>
      <div class="legal-item">
        <span class="legal-label">Statut juridique</span>
        <span class="legal-value">Association loi 1901 à but non lucratif</span>
      </div>
      <div class="legal-item">
        <span class="legal-label">Adresse</span>
        <span class="legal-value">123 rue des Érables, 75000 Paris, France</span>
      </div>
    </div>

    <!-- Contact -->
    <div class="legal-card">
      <div class="legal-icon">📧</div>
      <h2 class="legal-section-title">Contact</h2>
      <div class="legal-item">
        <span class="legal-label">Email</span>
        <span class="legal-value">contact@greenroots.org</span>
      </div>
      <div class="legal-item">
        <span class="legal-label">Téléphone</span>
        <span class="legal-value">01 23 45 67 89</span>
      </div>
      <div class="legal-item">
        <span class="legal-label">Responsable de la publication</span>
        <span class="legal-value">Jean Dupont, Président</span>
      </div>
    </div>

    <!-- Hosting -->
    <div class="legal-card">
      <div class="legal-icon">🖥️</div>
      <h2 class="legal-section-title">Hébergement</h2>
      <div class="legal-item">
        <span class="legal-label">Hébergeur</span>
        <span class="legal-value">OVH</span>
      </div>
      <div class="legal-item">
        <span class="legal-label">Adresse</span>
        <span class="legal-value">2 rue Kellermann, 59100 Roubaix, France</span>
      </div>
    </div>

    <!-- Purpose -->
    <div class="legal-card legal-full">
      <div class="legal-icon">🎯</div>
      <h2 class="legal-section-title">Objet du site</h2>
      <p class="legal-text">
        Le site GreenRoots a pour vocation de promouvoir la reforestation en
        permettant aux internautes de soutenir la plantation d'arbres via des
        dons ou l'achat symbolique d'arbres en ligne.
      </p>
    </div>

    <!-- Intellectual Property -->
    <div class="legal-card legal-full">
      <div class="legal-icon">©</div>
      <h2 class="legal-section-title">Propriété intellectuelle</h2>
      <p class="legal-text">
        L'ensemble du contenu du site (textes, images, graphismes, logo, etc.)
        est la propriété de l'association GreenRoots, sauf mention contraire.
        Toute reproduction, même partielle, est interdite sans autorisation
        préalable.
      </p>
    </div>

    <!-- Data Protection -->
    <div class="legal-card legal-full">
      <div class="legal-icon">🔒</div>
      <h2 class="legal-section-title">Protection des données personnelles</h2>
      <p class="legal-text">
        Conformément au Règlement Général sur la Protection des Données (RGPD),
        les données collectées via le site (formulaire de contact, achat
        d'arbres, etc.) sont utilisées uniquement dans le cadre de la mission de
        l'association. Vous pouvez exercer vos droits d'accès, de rectification
        ou de suppression en nous contactant à l'adresse suivante :
        <em>contact@greenroots.org</em>.
      </p>
    </div>

    <!-- Cookies -->
    <div class="legal-card legal-full">
      <div class="legal-icon">🍪</div>
      <h2 class="legal-section-title">Cookies</h2>
      <p class="legal-text">
        Le site peut utiliser des cookies à des fins statistiques et
        d'amélioration de l'expérience utilisateur. En continuant la navigation,
        vous acceptez l'utilisation de ces cookies.
      </p>
    </div>

    <!-- Responsibility -->
    <div class="legal-card legal-full">
      <div class="legal-icon">⚠️</div>
      <h2 class="legal-section-title">Limitation de responsabilité</h2>
      <p class="legal-text">
        L'association GreenRoots s'efforce d'assurer l'exactitude des
        informations diffusées sur son site, mais ne saurait être tenue
        responsable d'éventuelles erreurs ou omissions. L'utilisation du site se
        fait sous la responsabilité exclusive de l'utilisateur.
      </p>
    </div>
  </div>
</section>

<style>
  /* === PAGE WRAPPER === */
  .legal-notice {
    max-width: 1200px;
    margin: 9rem auto 2rem;
    padding: 2rem;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  /* === HEADER === */
  .legal-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, #246e15, #4caf50);
    border-radius: 20px;
    color: white;
    box-shadow: 0 8px 24px rgba(36, 110, 21, 0.2);
  }

  .legal-title {
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    font-weight: 700;
  }

  .legal-subtitle {
    font-size: 1.1rem;
    opacity: 0.95;
    margin: 0;
  }

  /* === GRID LAYOUT === */
  .legal-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  /* === CARD STYLES === */
  .legal-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid rgba(36, 110, 21, 0.1);
  }

  .legal-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(36, 110, 21, 0.15);
    border-color: rgba(36, 110, 21, 0.3);
  }

  .legal-full {
    grid-column: 1 / -1;
  }

  /* === ICONS & TITLES === */
  .legal-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: inline-block;
  }

  .legal-section-title {
    color: #246e15;
    font-size: 1.4rem;
    margin: 0 0 1.5rem 0;
    font-weight: 600;
  }

  /* === CARD ITEMS === */
  .legal-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .legal-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .legal-label {
    font-size: 0.85rem;
    color: #7f8c8d;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.3rem;
  }

  .legal-value {
    color: #2c3e50;
    font-size: 1rem;
    line-height: 1.6;
  }

  .legal-text {
    color: #34495e;
    line-height: 1.8;
    margin: 0;
    font-size: 1rem;
  }

  em {
    color: #246e15;
    font-style: normal;
    font-weight: 600;
  }

  /* === RESPONSIVE === */
  @media (max-width: 768px) {
    .legal-notice {
      margin-top: 5rem;
      padding: 1rem;
    }

    .legal-title {
      font-size: 2rem;
    }

    .legal-content {
      grid-template-columns: 1fr;
    }

    .legal-card {
      padding: 1.5rem;
    }
  }
</style>