<script>
  import "/src/app.css";
  import { onMount } from 'svelte';

  // ======== Reactive states ========
  let showConfirmDelete = $state(false);   // Controls delete account modal
  let user = $state({});                   // Stores user info from backend

  // Form data for profile update
  let formData = $state({
    lastname: '',
    firstname: '',
    mail: '',
    phone_number: '',
    address_number: '',
    address_streetname: '',
    postal_code: '',
    city: ''
  });

  // Form data for password change
  let formPasswordData = $state({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // UI feedback messages
  let errorMsg = $state('');
  let successMsg = $state('');
  let errorPasswordMsg = $state('');
  let successPasswordMsg = $state('');

  // ======== Modal controls ========
  function openConfirmDelete() {
    showConfirmDelete = true;
  };

  function closeConfirmDelete() {
    showConfirmDelete = false;
  };

  // ======== Fetch user info from API ========
  async function fetchMe() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('API error: ' + response.message);

      const data = await response.json();
      user = data.user;

      // Fill form fields with fetched user data
      formData = {
        lastname: user.lastname || '',
        firstname: user.firstname || '',
        mail: user.mail || '',
        phone_number: user.phone_number || '',
        address_number: user.address_number || '',
        address_streetname: user.address_streetname || '',
        postal_code: user.postal_code || '',
        city: user.city || ''
      };
    } catch (error) {
      console.error("fetchMe error:", error);
    }
  };

  // ======== Delete user account ========
  async function deleteAccount() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) throw new Error('Error: ' + response.message);

      // Clear local data and redirect to home
      localStorage.removeItem('token');
      localStorage.removeItem('mail');
      window.location.href = '/';
    } catch (error) {
      console.error("deleteAccount error:", error);
    }
  };

  // ======== Update user data (profile info) ========
  async function updateUserDatas() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      await response.json();

      if (response.ok) {
        successMsg = "Données mises à jour avec succès.";
        setTimeout(() => { successMsg = ""; }, 3000);
        await fetchMe(); // refresh local user data

        // Update stored token/mail if email has changed
        if (formData.mail && formData.mail !== user.mail && response.token) {
          localStorage.setItem('mail', formData.mail);
          localStorage.setItem('token', response.token);
        }
      } else {
        errorMsg = "Erreur lors de la mise à jour.";
        setTimeout(() => { errorMsg = ""; }, 5000);
      }
    } catch (error) {
      console.error("updateUserDatas error:", error);
    }
  };

  // ======== Update user password ========
  async function updatePassword() {
    const token = localStorage.getItem('token');

    // Client-side validation
    if (formPasswordData.new_password !== formPasswordData.confirm_password) {
      errorPasswordMsg = "Les nouveaux mots de passe ne correspondent pas.";
      setTimeout(() => { errorPasswordMsg = ""; }, 5000);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/me/password', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formPasswordData)
      });

      const data = await response.json();

      if (response.ok) {
        successPasswordMsg = "Mot de passe mis à jour avec succès.";
        formPasswordData = { current_password: '', new_password: '', confirm_password: '' };
        setTimeout(() => { successPasswordMsg = ""; }, 3000);
      } else {
        errorPasswordMsg = data.message || "Erreur lors de la mise à jour du mot de passe.";
        setTimeout(() => { errorPasswordMsg = ""; }, 5000);
      }
    } catch (error) {
      console.error("updatePassword error:", error);
    }
  };

  // ======== Lifecycle ========
  onMount(() => {
    fetchMe();
    document.title = "Modifier mes informations - GreenRoots";
  });
</script>

<!-- ======== PAGE HEADER ======== -->
<header class="page-head">
  <h1 class="page-title">Modifier mes informations</h1>
  <p class="page-sub">Mets à jour tes données personnelles et coordonnées.</p>
</header>

<!-- ======== USER INFO FORM ======== -->
<form class="edit-form main-container" method="post" onsubmit={event => {
  event.preventDefault();
  updateUserDatas();
}}>
  <!-- Identity section -->
  <fieldset class="fs">
    <legend class="fs-legend">Identité</legend>

    <div class="field">
      <label for="lastname">Nom</label>
      <input id="lastname" name="lastname" type="text" autocomplete="family-name" placeholder={user.lastname} bind:value={formData.lastname} />
    </div>

    <div class="field">
      <label for="firstname">Prénom</label>
      <input id="firstname" name="firstname" type="text" autocomplete="given-name" placeholder={user.firstname} bind:value={formData.firstname} />
    </div>

    <div class="field">
      <label for="mail">Email</label>
      <input id="mail" name="mail" type="email" autocomplete="email" placeholder={user.mail} bind:value={formData.mail} inputmode="email" />
    </div>

    <div class="field">
      <label for="phone_number">Téléphone</label>
      <input id="phone_number" name="phone_number" type="tel" autocomplete="tel" placeholder={user.phone_number} bind:value={formData.phone_number} inputmode="tel" />
    </div>
  </fieldset>

  <!-- Address section -->
  <fieldset class="fs">
    <legend class="fs-legend">Adresse</legend>

    <div class="field">
      <label for="address_number">Numéro</label>
      <input id="address_number" name="address_number" type="text" autocomplete="address-line1" placeholder={user.address_number} bind:value={formData.address_number} />
    </div>

    <div class="field">
      <label for="address_streetname">Rue</label>
      <input id="address_streetname" name="address_streetname" type="text" autocomplete="address-line2" placeholder={user.address_streetname} bind:value={formData.address_streetname} />
    </div>

    <div class="field">
      <label for="postal_code">Code postal</label>
      <input id="postal_code" name="postal_code" type="text" autocomplete="postal-code" placeholder={user.postal_code} bind:value={formData.postal_code} />
    </div>

    <div class="field">
      <label for="city">Ville</label>
      <input id="city" name="city" type="text" autocomplete="address-level2" placeholder={user.city} bind:value={formData.city} />
    </div>
  </fieldset>

  <!-- Feedback messages -->
  <div class="form-alert" role="alert" aria-live="polite">
    {#if errorMsg}
      <p class="error-text">{errorMsg}</p>
    {/if}
    {#if successMsg}
      <p class="success-text">{successMsg}</p>
    {/if}
  </div>

  <!-- Buttons -->
  <div class="form-actions">
    <a href="/auth/mycount" class="btn ghost">Annuler</a>
    <button type="submit" class="btn primary">Enregistrer</button>
  </div>
</form>

<!-- ======== PASSWORD CHANGE FORM ======== -->
<form class="main-container" method="post" onsubmit={event => {
  event.preventDefault();
  updatePassword();
}}>
  <legend class="fs-legend">Sécurité</legend>

  <div class="field">
    <label for="current_password">Mot de passe actuel</label>
    <input id="current_password" name="current_password" type="password" autocomplete="current-password" placeholder="••••••••" bind:value={formPasswordData.current_password} />
    <small class="help">Requis si tu changes ton mot de passe ou ton email.</small>
  </div>

  <div class="grid-2">
    <div class="field">
      <label for="new_password">Nouveau mot de passe</label>
      <input id="new_password" name="new_password" type="password" autocomplete="new-password" placeholder="••••••••" bind:value={formPasswordData.new_password} />
    </div>

    <div class="field">
      <label for="confirm_password">Confirmer le mot de passe</label>
      <input id="confirm_password" name="confirm_password" type="password" autocomplete="new-password" placeholder="••••••••" bind:value={formPasswordData.confirm_password} />
    </div>
  </div>

  <!-- Feedback messages -->
  <div class="form-alert" role="alert">
    {#if errorPasswordMsg}
      <p class="error-text">{errorPasswordMsg}</p>
    {/if}
    {#if successPasswordMsg}
      <p class="success-text">{successPasswordMsg}</p>
    {/if}
  </div>

  <!-- Buttons -->
  <div class="form-actions">
    <a href="/auth/mycount" class="btn ghost">Annuler</a>
    <button type="submit" class="btn primary">Enregistrer</button>
  </div>
</form>

<!-- ======== ACCOUNT DELETION SECTION ======== -->
<section class="danger modern-card" aria-labelledby="danger-title">
  <p>La suppression du compte est <span>définitive</span>. Toutes tes données associées seront effacées.</p>
  <button type="button" class="btn danger" onclick={event => {
    event.preventDefault();
    openConfirmDelete();
  }}>Supprimer mon compte</button>
</section>

<!-- ======== CONFIRM DELETE MODAL ======== -->
{#if showConfirmDelete}
  <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirmDeleteTitle">
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
/* ===== Page ===== */
.page-head{
  margin-bottom: .75rem;
  margin-top: clamp(2rem, 8vw, 6rem);
  text-align: center;
}
.page-title{
  font-size: clamp(1.4rem, 4.2vw, 2rem);
  margin: 0;
  background: linear-gradient(90deg, #246e15, #0b2512);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
}
.page-sub{
  margin: .35rem 0 0;
  color: #3b4a3f;
  font-size: .98rem;
}

/* ===== Containers ===== */
.main-container{
  background: #fff;
  border: 1px solid rgba(36,110,21,.12);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.06);
  padding: clamp(1rem, 4vw, 2rem);
  margin: 1rem;
  width: min(100%, 760px);
  margin-inline: auto;
}
.danger.modern-card{
  width: min(100%, 760px);
  margin-inline: auto;
  padding: clamp(1rem, 4vw, 2rem);
}

/* ===== Form ===== */
.edit-form{ display: grid; gap: 1rem; min-width: 0; }
.fs{ border: none; margin: 0; padding: 0; }
.fs-legend{
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: .5rem;
  color: #17351b;
  border-left: 4px solid #246e15;
  padding-left: .5rem;
}
.grid-2{ display: grid; gap: .8rem; min-width: 0; }
.grid-2 > *, .field{ min-width: 0; }
.field{ display: grid; gap: .35rem; }
label{
  font-size: .92rem;
  color: #2a5b2b;
  letter-spacing: .02em;
}
input{
  appearance: none;
  width: 100%;
  max-width: 100%;
  padding: .7rem .85rem;
  border-radius: 10px;
  border: 1px solid rgba(36,110,21,.18);
  background: #f7fbf8;
  color: #132016;
  font-size: 1rem;
  transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease;
  margin-bottom: 1rem;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
}
input::placeholder{ color: #86968b; }
input:focus{
  outline: none;
  border-color: #246e15;
  box-shadow: 0 0 0 3px rgba(36,110,21,.18);
  background: #ffffff;
}
.help{ font-size: .85rem; color: #4a5d52; }

/* ===== Alerts ===== */
.form-alert{
  min-height: 1.25rem;
  font-size: .95rem;
  color: #0b3d22;
}
.error-text{ color: #b30000; margin: 0; }
.success-text{ color: #0b3d22; margin: 0; }

/* ===== Actions ===== */
.form-actions{
  display: flex;
  gap: .6rem;
  justify-content: flex-end;
  padding-top: .25rem;
}

/* ===== Buttons ===== */
.btn{
  display: inline-flex; align-items: center; justify-content: center;
  gap: .4rem;
  padding: .65rem 1.1rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  transition: transform .15s ease, box-shadow .15s ease, filter .15s ease, background-color .15s ease;
}
.btn:hover{ transform: translateY(-1px); }
.btn.primary{ background: #246e15; color: #fff; }
.btn.primary:hover{ box-shadow: 0 6px 14px rgba(36,110,21,.22); }
.btn.ghost{ background: #fff; color: #246e15; border-color: #246e15; }
.btn.ghost:hover{ box-shadow: 0 6px 14px rgba(36,110,21,.16); }
.btn.danger{ background: #b30000; color: #fff; }
.btn.danger:hover{ filter: brightness(.95); }

/* ===== Danger block ===== */
.danger{
  border: 1px solid rgba(179,0,0,.18);
  background: #fff0f0;
  box-shadow: 0 4px 12px rgba(179,0,0,.06);
  margin-top: 2rem;
  text-align: center;
  padding: 1rem;
}
.danger p{ margin: 0 0 .8rem; }
.danger span{ font-weight: 700; color: #b30000; }

/* ===== Modal ===== */
.modal-backdrop{
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-content{
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  width: min(90%, 400px);
  text-align: center;
  animation: fadeIn 0.25s ease-in-out;
}
#confirmDeleteTitle{
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--color-primary, #1c6b48);
}
.modal-content p{ margin-bottom: 1.5rem; line-height: 1.4; }
.warning-text{ color: #b30000; font-weight: 600; }
.modal-actions{ display: flex; justify-content: center; gap: 1rem; }
.btn-cancel,
.btn-confirm{
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: transform 0.15s ease;
}
.btn-cancel{ background-color: #f5f5f5; color: #333; }
.btn-cancel:hover{ transform: scale(1.05); }
.btn-confirm{ background-color: #c0392b; color: white; }
.btn-confirm:hover{ transform: scale(1.05); background-color: #a93226; }

@keyframes fadeIn{
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

/* ===== Responsive ===== */
/* 2 cols from 640px */
@media (min-width: 640px){
  .grid-2{ grid-template-columns: 1fr 1fr; }
}
/* slightly larger gaps from 820px */
@media (min-width: 820px){
  .edit-form{ gap: 1.1rem; }
}
/* side margins on narrow screens */
@media (max-width: 639px){
  .main-container,
  .danger.modern-card{
    margin-inline: auto;
    max-width: 600px;
    width: 90%;
  }
}
@media (max-width: 820px) {
  .main-container,
  .danger.modern-card {
    width: calc(100% - clamp(1rem, 6vw, 2.5rem));
  }
}
</style>
