
<script>
  import "/src/app.css";
  import { onMount } from "svelte";
  import { login } from "$lib/stores/auth.js";

  // ======== Form States ========
  // Stores user input for registration
  let formData = $state({
    mail: "",
    password: "",
    confirmPassword: ""
  });

  // UI feedback messages
  let errorMsg = $state("");
  let successMsg = $state("");

  // ======== Register User ========
  async function fetchRegisterUser() {
    try {
      // POST request to API for user registration
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("API error: " + response.message);

      const data = await response.json();

      // Automatically log in user after registration
      login({ token: data.token, mail: formData.mail });

      // Reset form and show confirmation message
      formData = { mail: "", password: "", confirmPassword: "" };
      successMsg = "Inscription réussie !";

      setTimeout(() => { successMsg = ""; }, 3000);
      setTimeout(() => { window.location.href = "/"; }, 3500); // Redirect after delay

      return response.json();
    } catch (error) {
      // Error handling and temporary display of message
      errorMsg = "Erreur lors de l'inscription : " + error.message;
      setTimeout(() => { errorMsg = ""; }, 5000);
    }
  }

  // ======== Page setup ========
  onMount(() => {
    document.title = "Créer un compte - GreenRoots";
  }); 
</script>

<!-- ======== FORM SECTION ======== -->
<div class="container">
  <div class="heading">Créer un compte</div>

  <form 
    class="form"
    onsubmit={(event) => {
      event.preventDefault();
      fetchRegisterUser();
    }}
  >
    <!-- Email -->
    <input 
      required 
      class="input" 
      type="email" 
      name="email" 
      id="email" 
      placeholder="E-mail"
      bind:value={formData.mail}
    >

    <!-- Password + Tooltip for requirements -->
    <div class="password-wrapper">
      <input 
        required 
        class="input" 
        type="password" 
        name="password" 
        id="password" 
        placeholder="Mot de passe"
        bind:value={formData.password}
      >
      <div class="password-tooltip">
        <strong>Exigences du mot de passe :</strong><br>
        • 6 caractères minimum<br>
        • 1 majuscule<br>
        • 1 minuscule<br>
        • 1 chiffre<br>
        • 1 caractère spécial
      </div>
    </div>

    <!-- Confirm password -->
    <input 
      required 
      class="input" 
      type="password" 
      name="confirmPassword" 
      id="confirmPassword" 
      placeholder="Confirmer le mot de passe"
      bind:value={formData.confirmPassword}
    >
    
    <!-- Feedback messages -->
    {#if errorMsg}
      <p class="error-msg">{errorMsg}</p>
    {/if}
    {#if successMsg}
      <p class="success-msg">{successMsg}</p>
    {/if}

    <!-- Submit button -->
    <input class="login-button" type="submit" value="Créer un compte">
  </form>
</div>

<!-- ======== STYLES ======== -->
<style>
  .container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2.5rem;
    background: linear-gradient(#f3f3f3, #3ba35c);
    border-radius: 20px;
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.15),
      0 10px 30px rgba(0, 0, 0, 0.1),
      0 5px 15px rgba(0, 0, 0, 0.05);
  }

  .heading {
    text-align: center;
    font-weight: 700;
    font-size: 2rem;
    color: #246e15;
    margin-bottom: 1.5rem;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .input {
    width: 100%;
    background: white;
    border: none;
    padding: 1rem;
    font-size: 1rem;
    color: #333;
    border-radius: 10px;
    box-shadow: inset 2px 2px 5px #b8b9be, inset -2px -2px 5px #fff;
    outline: none;
    transition: all 0.3s;
  }

  .input:focus {
    box-shadow: inset 1px 1px 2px #b8b9be, inset -1px -1px 2px #fff;
  }

  .password-wrapper {
    position: relative;
    width: 100%;
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
    z-index: 1000;
    transform: translateY(5px);
    transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    margin-top: 5px;
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

  .password-wrapper:hover .password-tooltip {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

  /* === Alerts === */
  .error-msg {
    color: #e74c3c;
    font-size: 0.9rem;
    margin: 0;
    text-align: center;
  }

  .success-msg {
    color: #27ae60;
    font-size: 0.9rem;
    margin: 0;
    text-align: center;
  }

  /* === CTA Button === */
  .login-button {
    padding: 1rem;
    background: linear-gradient(to right, #246e15, #4CAF50);
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    color: white;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 3px 3px 8px #b8b9be, -3px -3px 8px #fff;
    transition: all 0.3s;
  }

  .login-button:hover {
    box-shadow: inset 3px 3px 8px #b8b9be, inset -3px -3px 8px #fff;
    transform: translateY(2px);
  }
</style>