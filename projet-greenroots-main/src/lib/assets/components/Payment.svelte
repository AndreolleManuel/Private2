<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { getStripe } from "$lib/utils/stripeClient.js";
  import { cart } from "$lib/stores/cart";

  // === CONFIG ===
  export let createIntentUrl = "http://localhost:3000/api/payments/create-payment-intent";
  export let returnPath = "/order/confirm";

  // === STATE ===
  let stripe = null;
  let elements = null;
  let clientSecret = "";
  let isReady = false;
  let isProcessing = false;
  let message = "";
  let disabledReason = "initialisation en cours…";

  // === HELPERS ===

  // Build the payload from cart items
  function makeItemsPayload() {
    const cartItems = get(cart) || [];
    const items = cartItems.map((it) => ({
      tree_id: Number(it.id),
      quantity: Number(it.quantity)
    }));

    // Filter out invalid items
    return items.filter(i =>
      Number.isInteger(i.tree_id) && i.tree_id > 0 &&
      Number.isInteger(i.quantity) && i.quantity > 0
    );
  }

  // Secure JSON parsing
  async function safeJson(res) {
    try { return await res.json(); } catch { return null; }
  }

  // === STRIPE INITIALIZATION ===
  async function initStripe() {
    try {
      message = "";
      isReady = false;
      disabledReason = "initialisation Stripe…";
      clientSecret = "";
      elements = null;

      // 1. Load Stripe.js client
      stripe = await getStripe();
      if (!stripe) {
        message = "Stripe non initialisé (clé publique manquante ?)";
        disabledReason = message;
        return;
      }

      // 2. Verify user token
      const token = localStorage.getItem("token");
      if (!token) {
        message = "Vous devez être connecté(e) pour payer.";
        disabledReason = message;
        return;
      }

      // 3. Create a PaymentIntent via API
      const payload = { items: makeItemsPayload() };
      disabledReason = "Création du paiement…";

      const res = await fetch(createIntentUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await safeJson(res);
        message = err?.message || `Erreur création paiement (${res.status})`;
        disabledReason = message;
        return;
      }

      // 4. Get clientSecret and mount Stripe Element
      const data = await res.json();
      clientSecret = data.clientSecret;
      if (!clientSecret) {
        message = "Client secret manquant.";
        disabledReason = message;
        return;
      }

      elements = stripe.elements({ clientSecret });
      const paymentElement = elements.create("payment");
      paymentElement.mount("#payment-element");

      // 5. Ready for user interaction
      isReady = true;
      disabledReason = "";
    } catch (e) {
      console.error("[PaymentForm] initStripe error:", e);
      message = "Erreur d'initialisation du paiement.";
      disabledReason = message;
    }
  }

  // === PAYMENT SUBMISSION ===
  async function submitPayment() {
    if (!stripe || !elements || !clientSecret) return;

    isProcessing = true;
    message = "";

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + returnPath
        },
        redirect: "if_required"
      });

      if (error) {
        message = error.message || "Le paiement n'a pas abouti.";
        isProcessing = false;
        return;
      }

      // Redirect if successful
      if (paymentIntent && paymentIntent.status === "succeeded") {
        const qs = new URLSearchParams({
          payment_intent: paymentIntent.id,
          payment_intent_client_secret: clientSecret
        }).toString();

        window.location.assign(`${returnPath}?${qs}`);
        return;
      }
    } catch (err) {
      console.error("[PaymentForm] submitPayment error:", err);
      message = "Erreur lors du traitement du paiement.";
      isProcessing = false;
    }

    isProcessing = false;
  }

  onMount(() => {
    initStripe();
  });
</script>

<!-- === PAYMENT FORM === -->
<form
  onsubmit={(event) => {
    event.preventDefault();
    submitPayment();
  }}
  aria-label="Paiement sécurisé"
  style="margin-block: 1rem"
>
  <div id="payment-element" aria-busy={!isReady}></div>

  <button
    type="submit"
    class="btn-pay"
    disabled={!isReady || isProcessing}
    title={!isReady ? (disabledReason || "Initialisation…") : ""}
    aria-label={isProcessing ? "Paiement en cours" : "Payer maintenant"}
  >
    {isProcessing ? "Traitement…" : "Payer maintenant"}
  </button>

  {#if message}
    <p class="msg" role="alert" aria-live="polite">{message}</p>
  {/if}

  {#if !isReady && disabledReason}
    <p class="hint">⏳ {disabledReason}</p>
  {/if}
</form>

<style>
  #payment-element {
    margin: 1rem 0;
    border-radius: 12px;
  }

  .btn-pay {
    inline-size: 100%;
    padding: 0.875rem 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background-color: #4caf50;
    color: white;
    transition: all 0.3s ease;
  }

  .btn-pay:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(39, 174, 96, 0.4);
    background: linear-gradient(135deg, #219a52, #27ae60);
  }

  .btn-pay:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .msg {
    margin-top: 0.5rem;
  }

  .hint {
    margin-top: 0.25rem;
    opacity: 0.8;
    font-size: 0.9rem;
  }
</style>