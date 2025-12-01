
<script>
  import "/src/app.css";
  import { onMount } from "svelte";

  // ======== State ========
  // Using $state (Svelte v5 feature) for reactive form data
  let formData = $state({
    name: "",
    email: "",
    message: ""
  });

  // Reset form after submission
  function resetForm() {
    formData = { name: "", email: "", message: "" };
  }

  // Loading and status states
  let isSubmitting = $state(false);
  let submitStatus = $state(""); // can be "success" or "error"
  let statusMessage = $state("");

  // ======== Submit handler ========
  async function submitForm() {
    isSubmitting = true;
    submitStatus = "";

    try {
      // POST request to contact API
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("API error: " + response.message);

      const data = await response.json();

      // ======== Success ========
      submitStatus = "success";
      statusMessage = "Message envoyé avec succès ! 🌿";

      // Reset form fields
      resetForm();

      // Hide status after delay
      setTimeout(() => {
        submitStatus = "";
        statusMessage = "";
      }, 5000);

    } catch (error) {
      // ======== Error handling ========
      console.error("submitForm error:", error);
      submitStatus = "error";
      statusMessage = "Une erreur est survenue. Veuillez réessayer.";

      setTimeout(() => {
        submitStatus = "";
        statusMessage = "";
      }, 5000);

    } finally {
      isSubmitting = false;
    }
  };

</script>
<svelte:head>
  <title>Contactez-nous | GreenRoots</title>
  <meta name="description" content="Contactez l'équipe de GreenRoots pour toute question ou suggestion. Nous sommes à votre écoute !" />
</svelte:head>
<!-- ======== PAGE CONTENT ======== -->
<section class="contact-wrapper">
  <div class="contact-container">

    <!-- Header -->
    <div class="contact-header">
      <div class="contact-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </div>
      <h1 class="contact-title">Contactez-nous</h1>
      <p class="contact-subtitle">Une question ? Une suggestion ? Nous sommes à votre écoute !</p>
    </div>

    <!-- ======== FORM ======== -->
    <form
      class="contact-form"
      onsubmit={(event) => {
        event.preventDefault();
        submitForm();
      }}
    >
      <!-- Name -->
      <div class="form-group">
        <label for="name" class="contact-label">Nom complet</label>
        <input 
          id="name"
          name="name"
          type="text"
          placeholder="Tony Montana"
          required
          bind:value={formData.name}
          disabled={isSubmitting}
          class="contact-input"
        />
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email" class="contact-label">Adresse email</label>
        <input 
          id="email"
          name="email"
          type="email"
          placeholder="tony.montana@example.com"
          required
          bind:value={formData.email}
          disabled={isSubmitting}
          class="contact-input"
        />
      </div>

      <!-- Message -->
      <div class="form-group">
        <label for="message" class="contact-label">Votre message</label>
        <textarea
          id="message"
          name="message"
          rows="6"
          placeholder="Écrivez votre message ici..."
          required
          bind:value={formData.message}
          disabled={isSubmitting}
          class="contact-textarea"
        ></textarea>
      </div>

      <!-- Status feedback -->
      {#if statusMessage}
        <div
          class="contact-status-message"
          class:success={submitStatus === "success"}
          class:error={submitStatus === "error"}
        >
          {statusMessage}
        </div>
      {/if}

      <!-- Submit button -->
      <button type="submit" class="contact-submit-btn" disabled={isSubmitting}>
        {#if isSubmitting}
          <span class="spinner"></span>
          Envoi en cours...
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Envoyer le message
        {/if}
      </button>
    </form>

    <!-- ======== STATIC CONTACT INFO ======== -->
    <div class="contact-info">
      <div class="info-item">
        <span class="info-icon">📍</span>
        <span class="info-text">123 rue des Érables, 75000 Paris</span>
      </div>
      <div class="info-item">
        <span class="info-icon">📞</span>
        <span class="info-text">01 23 45 67 89</span>
      </div>
      <div class="info-item">
        <span class="info-icon">✉️</span>
        <span class="info-text">contact@greenroots.org</span>
      </div>
    </div>
  </div>
</section>

<!-- ======== STYLES ======== -->
<style>
  :global(body) {
    background-color: white;
  }

  /* === Layout === */
  .contact-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .contact-container {
    width: 100%;
    max-width: 600px;
    background: white;
    border-radius: 24px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
    padding: 3rem;
    margin-top: 7rem;
  }

  /* === Header === */
  .contact-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .contact-icon {
    width: 70px;
    height: 70px;
    margin: 0 auto 1.5rem;
    background: linear-gradient(135deg, #246e15, #4caf50);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 12px 35px rgba(36, 110, 21, 0.5);
  }

  .contact-title {
    font-size: 2.2rem;
    color: #2c3e50;
    margin: 0 0 0.5rem 0;
    font-weight: 700;
  }

  .contact-subtitle {
    color: #7f8c8d;
    font-size: 1rem;
    margin: 0;
  }

  /* === Form === */
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .contact-label {
    font-weight: 600;
    color: #34495e;
    font-size: 0.95rem;
  }

  .contact-input,
  .contact-textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s ease;
    background: #fafafa;
  }

  .contact-input:focus,
  .contact-textarea:focus {
    outline: none;
    border-color: #4caf50;
    background: white;
    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
  }

  .contact-input:disabled,
  .contact-textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* === Status === */
  .contact-status-message {
    padding: 1rem;
    border-radius: 12px;
    text-align: center;
    font-weight: 500;
    animation: slideIn 0.3s ease;
  }

  .contact-status-message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .contact-status-message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  /* === Submit Button === */
  .contact-submit-btn {
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #246e15, #4caf50);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.05rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 8px 25px rgba(36, 110, 21, 0.4);
  }

  .contact-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(36, 110, 21, 0.6);
  }

  .contact-submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .contact-submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  /* === Contact Info === */
  .contact-info {
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #5a6c7d;
    font-size: 0.95rem;
  }

  .info-icon {
    font-size: 1.3rem;
  }

  .info-text {
    color: #2c3e50;
  }

  /* === Animations === */
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* === Responsive === */
  @media (max-width: 768px) {
    .contact-container {
      padding: 2rem 1.5rem;
      margin-top: 5rem;
    }

    .contact-title {
      font-size: 1.8rem;
    }

    .contact-icon {
      width: 60px;
      height: 60px;
    }
  }
</style>