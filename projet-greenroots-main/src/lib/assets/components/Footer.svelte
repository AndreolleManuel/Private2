<script>
  // --- Static assets (SVG/WEBP icons) ---
  // Imported so bundlers can hash/optimize them and so <img src={...}> resolves correctly.
  import fbIcon from "$lib/assets/images/social/facebook-icon.webp";
  import igIcon from "$lib/assets/images/social/instagram-icon.webp";
  import tkIcon from "$lib/assets/images/social/tiktok-icon.webp";
</script>

<footer 
  class="footer"
  itemscope 
  aria-labelledby="footer-heading"
>
  <!-- Landmark title (visually hidden), improves screen reader navigation -->
  <h2 id="footer-heading" class="sr-only">Pied de page</h2>

  <!-- Home link + brand logo -->
  <a href="/" class="home-link" rel="home" aria-label="Page d'accueil GreenRoots">
    <img 
      src="/greenroots-logo-noir.webp" 
      alt="GreenRoots Logo" 
      class="logo-footer"
      loading="lazy"
      decoding="async"
      fetchpriority="low"
      itemprop="logo"
    />
  </a>

  <!-- Legal and contact links -->
  <nav class="footer-links" aria-label="Liens du pied de page">
      <a href="/legal" class="footer-link">Mentions Légales</a>
      <a href="/contact" class="footer-link">Contact</a>
  </nav>

  <!-- Copyright line -->
  <p class="footer-copyright">© 2025 GreenRoots. Tous droits réservés.</p>

  <!-- Social links (open in new tab, noopener for security) -->
  <nav aria-label="Réseaux sociaux" class="social-media-icons">
    <a 
        href="https://facebook.com" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Page Facebook (Nouvelle fenêtre)"
        class="social-media-link"
    >
        <!-- Decorative icon → empty alt is fine here -->
        <img src={fbIcon} alt="" loading="lazy" decoding="async" fetchpriority="low">
    </a>
    <a 
        href="https://instagram.com" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Page Instagram (Nouvelle fenêtre)"
        class="social-media-link"
    >
        <!-- Non-decorative alt text provided -->
        <img src={igIcon} alt="Instagram" loading="lazy" decoding="async" fetchpriority="low">
    </a>
    <a 
      href="https://tiktok.com" 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label="Page TikTok (Nouvelle fenêtre)"
      class="social-media-link"
    >
      <!-- Non-decorative alt text provided -->
      <img src={tkIcon} alt="TikTok" loading="lazy" decoding="async" fetchpriority="low">
    </a>
  </nav>
</footer>

<style>
    /* =========================
       FOOTER: desktop baseline
       ========================= */
    .footer {
      height: 80px;
      background-color: #ffffff56;      /* translucent background over page */
      display: flex;
      align-items: center;
      justify-content: space-between;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 0 20px;
    }
    
    /* Link group (legal/contact) aligned center-left */
    .footer-links {
      display: flex;
      align-items: center;
      margin-left: 2rem;
      margin-right: 10rem;              /* spacing before copyright/social */
      bottom: 3rem;                     /* harmless here; kept as-is */
    }
    .footer-link {
      text-decoration: none;
      color: rgb(0, 0, 0);
      font-weight: bold;
      margin-right: 1.5rem;
    }
    .footer-link:hover {
      text-decoration: underline;
    }

    /* Brand logo sizing + hover effect */
    .logo-footer {
      height: 50px;
      margin-right: 20px;
    }
    .logo-footer:hover {
      height: 50px;                     /* same height on hover (color change only) */
      margin-right: 20px;
      filter : hue-rotate(45deg);
      filter : saturate(500%);
      transition : ease-in-out 1s;
    }

    /* Social icons row (right side) */
    .social-media-icons {
      display: flex;
      align-items: center;
      justify-content: space-between;
      list-style: none;
      padding-left: 20rem;              /* pushes icons further right on wide screens */
    }
    .social-media-icons img {
      height: 3vh;                      /* proportional to viewport height */
      width: 3vh;
      object-fit: contain;
      margin-left: 10px;
    }
    .social-media-icons img:hover {
      transform: scale(1.2);
      transition: transform 0.3s ease;  /* subtle pop on hover */
    }
    .social-media-link {
      display: inline-block;
      padding-left: 1rem;
    }

    /* Copyright text block */
    .footer-copyright {
      margin: 0;
      font-size: 14px;
      font-weight: bold;
      align-self: center;
      margin-right: 6rem;
    }

    /* Visually hidden utility (kept for a11y) */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* =========================
       RESPONSIVE (≤ 600px)
       Switch to compact grid
       ========================= */
    @media (max-width: 600px) {
      .footer {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        grid-template-areas:
          "links logo socials"
          "copyright copyright copyright";
        align-items: center;
        justify-content: center;
        position: relative;
        bottom: 0;
        left: 0;
        width: 100vw;
        min-height: 120px;
        padding: 0.5rem 0.8rem;
        /* gap intentionally commented out */
        /* gap: 1rem; */
      }

      /* Stack legal/contact vertically on small screens */
      .footer-links {
        grid-area: links;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin: 0;
        gap: 0.3rem;
      }
      .footer-link {
        font-size: 0.9rem;
        font-weight: 600;
      }

      /* Center the logo in the middle column */
      .logo-footer {
        grid-area: logo;
        display: block;
        margin: 0 auto;
        height: 34px;
      }

      /* Place copyright on second row spanning all columns */
      .footer-copyright {
        grid-area: copyright;
        text-align: center;
        font-size: 0.6rem;
        font-weight: 600;
        /* align-self intentionally kept commented */
        /* align-self: end; */
        white-space: nowrap;
        margin: 0 auto;
        width: 100%;
        padding-top: 0.3rem;
      }

      /* Right-aligned socials, compact spacing */
      .social-media-icons {
        grid-area: socials;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin: 0;
        padding: 0;
        gap: 0.4rem;
      }
      .social-media-icons img {
        height: 20px;
        width: 20px;
      }

      /* Mobile logo hover: keep same height but apply color effect */
      .logo-footer:hover {
        height: 34px;
        filter : hue-rotate(45deg) saturate(500%);
        transition : ease-in-out 1s;
      }
    }
</style>