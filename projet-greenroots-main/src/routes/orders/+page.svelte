<script>
  import "/src/app.css";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { cart } from "$lib/stores/cart";
  import { formatPriceToDisplay } from "$lib/utils/PriceFormatter.js";
  import Payment from "$lib/assets/components/Payment.svelte";

  // ======== STATE ========
  let cartItems = get(cart);

  // Billing info (form fields)
  let billing = {
    firstname: "",
    lastname: "",
    mail: "",
    phone_number: "",
    address_number: "",
    address_streetname: "",
    city: "",
    postal_code: "",
  };

  // Required fields for validation
  const requiredFields = [
    "firstname", "lastname", "mail",
    "address_number", "address_streetname",
    "postal_code", "city"
  ];

  let errorMsg = "";
  let successMsg = "";
  let billingSaved = false;

  // Track touched inputs for validation feedback
  let touched = Object.fromEntries(requiredFields.map(k => [k, false]));
  const isPresent = v => String(v ?? "").trim() !== "";

  // ======== FORM VALIDATION ========
  function presenceErrors(b) {
    const e = {};
    for (const k of requiredFields) {
      e[k] = isPresent(b[k]) ? null : "Champ requis";
    }
    return e;
  }

  function touchAll() {
    for (const k of requiredFields) touched[k] = true;
  }

  // Reactive values
  $: total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  $: pErrors = presenceErrors(billing);
  $: isBillingReady = Object.values(pErrors).every(v => v === null);

  // ======== FETCH USER INFO ========
  async function fetchCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      if (!response.ok) throw new Error("Utilisateur introuvable");

      const { user } = await response.json();
      billing = {
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        mail: user.mail || "",
        phone_number: user.phone_number || "",
        address_number: user.address_number || "",
        address_streetname: user.address_streetname || "",
        city: user.city || "",
        postal_code: user.postal_code || "",
      };
      billingSaved = true;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
    }
  }

  // ======== UPDATE USER BILLING INFO ========
  async function updateBillingInfo() {
    const token = localStorage.getItem("token");
    if (!token) {
      errorMsg = "Vous devez être connecté pour mettre à jour vos informations.";
      setTimeout(() => (errorMsg = ""), 5000);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(billing),
      });

      await response.json();

      if (response.ok) {
        successMsg = "Données mises à jour avec succès.";
        setTimeout(() => (successMsg = ""), 3000);
        await fetchCurrentUser();
        billingSaved = true;
      } else {
        errorMsg = "Erreur lors de la mise à jour.";
        setTimeout(() => (errorMsg = ""), 5000);
      }
    } catch (error) {
      console.error("Erreur updateUserDatas :", error);
    }
  }

  // ======== ON MOUNT ========
  onMount(() => {
    document.title = "Finaliser ma commande - GreenRoots";
    fetchCurrentUser();
  });
</script>

<!-- ======== PAGE CONTENT ======== -->
<div class="checkout-wrapper">
  <h1 class="checkout-title">🌱 Finaliser ma commande</h1>

  <div class="checkout-grid">
    <!-- ===== LEFT COLUMN : FORM ===== -->
    <div class="checkout-forms">

      <!-- === Billing Form === -->
      <form
        class="checkout-billing-form"
        onsubmit={(e) => {
          e.preventDefault();
          updateBillingInfo();
        }}
      >
        <!-- Personal Info -->
        <fieldset class="checkout-section">
          <div class="checkout-section-header">
            <h2 class="checkout-section-title">Informations personnelles</h2>
          </div>

          <div class="checkout-form-grid">
            <!-- Firstname -->
            <div class="checkout-input-group">
              <label for="firstname" class="checkout-label">Prénom *</label>
              <input
                type="text"
                id="firstname"
                class="checkout-input"
                bind:value={billing.firstname}
                onblur={() => (touched.firstname = true)}
                oninput={() => (billingSaved = false)}
                aria-invalid={touched.firstname && !!pErrors.firstname}
                required
              />
              {#if touched.firstname && pErrors.firstname}
                <small class="checkout-field-error">Champ requis</small>
              {/if}
            </div>

            <!-- Lastname -->
            <div class="checkout-input-group">
              <label for="lastname" class="checkout-label">Nom *</label>
              <input
                type="text"
                id="lastname"
                class="checkout-input"
                bind:value={billing.lastname}
                onblur={() => (touched.lastname = true)}
                oninput={() => (billingSaved = false)}
                aria-invalid={touched.lastname && !!pErrors.lastname}
                required
              />
              {#if touched.lastname && pErrors.lastname}
                <small class="checkout-field-error">Champ requis</small>
              {/if}
            </div>

            <!-- Email -->
            <div class="checkout-input-group full">
              <label for="mail" class="checkout-label">Email *</label>
              <input
                type="email"
                id="mail"
                class="checkout-input"
                bind:value={billing.mail}
                onblur={() => (touched.mail = true)}
                oninput={() => (billingSaved = false)}
                aria-invalid={touched.mail && !!pErrors.mail}
                required
              />
              {#if touched.mail && pErrors.mail}
                <small class="checkout-field-error">Champ requis</small>
              {/if}
            </div>

            <!-- Phone -->
            <div class="checkout-input-group full">
              <label for="phone_number" class="checkout-label">Téléphone</label>
              <input
                type="tel"
                id="phone_number"
                class="checkout-input"
                bind:value={billing.phone_number}
                oninput={() => (billingSaved = false)}
              />
            </div>
          </div>
        </fieldset>

        <!-- === Address === -->
        <fieldset class="checkout-section">
          <div class="checkout-section-header">
            <h2 class="checkout-section-title">📍 Adresse de facturation</h2>
          </div>

          <div class="checkout-form-grid">
            <div class="checkout-input-group">
              <label for="address_number" class="checkout-label">Numéro *</label>
              <input
                id="address_number"
                type="text"
                class="checkout-input"
                bind:value={billing.address_number}
                onblur={() => (touched.address_number = true)}
                required
              />
              {#if touched.address_number && pErrors.address_number}
                <small class="checkout-field-error">Champ requis</small>
              {/if}
            </div>

            <div class="checkout-input-group full">
              <label for="address_streetname" class="checkout-label">Adresse complète *</label>
              <input
                id="address_streetname"
                type="text"
                class="checkout-input"
                bind:value={billing.address_streetname}
                onblur={() => (touched.address_streetname = true)}
                required
              />
              {#if touched.address_streetname && pErrors.address_streetname}
                <small class="checkout-field-error">Champ requis</small>
              {/if}
            </div>

            <div class="checkout-input-group">
              <label for="postal_code" class="checkout-label">Code postal *</label>
              <input
                id="postal_code"
                type="text"
                class="checkout-input"
                bind:value={billing.postal_code}
                onblur={() => (touched.postal_code = true)}
                required
              />
              {#if touched.postal_code && pErrors.postal_code}
                <small class="checkout-field-error">Champ requis</small>
              {/if}
            </div>

            <div class="checkout-input-group">
              <label for="city" class="checkout-label">Ville *</label>
              <input
                id="city"
                type="text"
                class="checkout-input"
                bind:value={billing.city}
                onblur={() => (touched.city = true)}
                required
              />
              {#if touched.city && pErrors.city}
                <small class="checkout-field-error">Champ requis</small>
              {/if}
            </div>
          </div>
        </fieldset>

        <!-- Status messages -->
        <div class="checkout-alert">
          {#if errorMsg}<div class="checkout-error">{errorMsg}</div>{/if}
          {#if successMsg}<div class="checkout-success">{successMsg}</div>{/if}
        </div>

        <button type="submit" class="checkout-btn">Enregistrer les informations</button>
      </form>

      <!-- === Payment === -->
      {#if isBillingReady && billingSaved}
        <Payment
          createIntentUrl="http://localhost:3000/api/payments/create-payment-intent"
          returnPath="/orders/confirm"
        />
      {:else}
        <section class="checkout-section">
          <div class="checkout-section-header">
            <h2 class="checkout-section-title">💳 Paiement</h2>
          </div>
          <button class="checkout-pay-disabled" disabled onclick={() => touchAll()}>
            Complétez les informations requises pour procéder au paiement
          </button>
          <p class="checkout-hint">Les champs marqués * sont requis.</p>
        </section>
      {/if}
    </div>

    <!-- ===== RIGHT COLUMN : SUMMARY ===== -->
    <div class="checkout-summary">
      <section class="checkout-section">
        <div class="checkout-section-header">
          <h2 class="checkout-section-title">📦 Récapitulatif de commande</h2>
        </div>

        <div class="checkout-cart">
          {#each cartItems as item}
            <div class="checkout-item">
              <img src={item.image} alt={item.name} class="checkout-item-img" />
              <div class="checkout-item-info">
                <h4>{item.name}</h4>
                <p>Quantité : {item.quantity}</p>
              </div>
              <div class="checkout-item-price">
                {formatPriceToDisplay(item.price * item.quantity)}
              </div>
            </div>
          {/each}
        </div>

        <div class="checkout-total">
          <span>Total</span>
          <span class="checkout-total-amount">{formatPriceToDisplay(total)}</span>
        </div>
      </section>
    </div>
  </div>
</div>

<!-- ======== STYLES ======== -->
<style>
  /* General layout */
  .checkout-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    padding-top: 12vh;
    min-height: 100vh;
  }

  .checkout-title {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.2rem;
    font-weight: 300;
    color: #2c3e50;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .checkout-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }

  /* Sections */
  .checkout-section {
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  .checkout-section-header {
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
  }

  .checkout-section-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }

  /* Form grid */
  .checkout-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .checkout-input-group {
    display: flex;
    flex-direction: column;
  }

  .checkout-input-group.full {
    grid-column: 1 / -1;
  }

  .checkout-label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .checkout-input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fafafa;
    transition: all 0.3s ease;
  }

  .checkout-input:focus {
    border-color: #27ae60;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.1);
    outline: none;
  }

  .checkout-field-error {
    color: #c0392b;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }

  /* Buttons */
  .checkout-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    background: #246e15;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
  }

  .checkout-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(36, 110, 21, 0.22);
  }

  .checkout-pay-disabled {
    width: 100%;
    padding: 0.9rem 1.2rem;
    border-radius: 10px;
    border: 1px dashed #ccc;
    background: #f7f7f7;
    cursor: not-allowed;
  }

  .checkout-hint {
    font-size: 0.9rem;
    color: #7f8c8d;
    margin-top: 0.5rem;
  }

  /* Messages */
  .checkout-alert {
    min-height: 1.25rem;
    margin-bottom: 1rem;
  }

  .checkout-error {
    color: #b30000;
  }

  .checkout-success {
    color: #0b3d22;
  }

  /* Summary */
  .checkout-summary {
    position: sticky;
    top: 1rem;
    height: fit-content;
  }

  .checkout-cart {
    margin-bottom: 1.5rem;
  }

  .checkout-item {
    display: grid;
    grid-template-columns: 60px 1fr auto;
    gap: 1rem;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .checkout-item:last-child {
    border-bottom: none;
  }

  .checkout-item-img {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    object-fit: cover;
  }

  .checkout-item-info h4 {
    margin: 0 0 0.25rem;
    font-size: 0.95rem;
    color: #2c3e50;
  }

  .checkout-item-info p {
    margin: 0;
    font-size: 0.85rem;
    color: #7f8c8d;
  }

  .checkout-item-price {
    color: #27ae60;
    font-weight: 600;
  }

  .checkout-total {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    border-top: 2px solid #f0f0f0;
    font-weight: 600;
    color: #2c3e50;
  }

  .checkout-total-amount {
    font-size: 1.3rem;
    color: #27ae60;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .checkout-grid {
      grid-template-columns: 1fr;
    }

    .checkout-form-grid {
      grid-template-columns: 1fr;
    }

    .checkout-summary {
      position: static;
    }
  }
</style>