
<script>
  import "/src/app.css";
  import { onMount } from "svelte";
  import { getStripe } from "$lib/utils/stripeClient.js";
  import { cart } from "$lib/stores/cart.js";
  import OrderCard from "$lib/assets/components/OrderCard.svelte";

  // ===== State =====
  let title = "Vérification du paiement…";
  let order = null;
  let error = "";

  // ===== Fetch order info after payment =====
  async function fetchOrder() {
    const stripe = await getStripe();
    const params = new URLSearchParams(location.search);
    const pi = params.get("payment_intent");
    const clientSecret = params.get("payment_intent_client_secret");

    // Retrieve payment intent status for logs
    if (stripe && clientSecret) {
      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
      console.log("[confirm] PI status:", paymentIntent?.status);
    }

    const token = localStorage.getItem("token") || "";
    let delay = 300;

    // Try multiple times to fetch the order while backend finalizes it
    for (let i = 0; i < 6; i++) {
      const res = await fetch(`http://localhost:3000/api/orders/by-payment-intent/${pi}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        order = data.order ?? data;
        title = "Paiement confirmé ✅";

        // Clear cart (both store + localStorage)
        cart.set([]);
        localStorage.removeItem("cart");
        return;
      }

      await new Promise(r => setTimeout(r, delay));
      delay = Math.min(delay * 2, 1500);
      title = "Traitement en cours…";
      error = "Commande en cours de finalisation… Veuillez patienter.";
    }

    // (Safety) Clear cart after final attempt
    cart.set([]);
    localStorage.removeItem("cart");
  };

  // ===== Lifecycle =====
  onMount(fetchOrder);
</script>

<!-- ===== PAGE CONTENT ===== -->
<section class="confirm-wrapper">
  <header class="confirm-header">
    <div
      class="confirm-status"
      class:success={!!order}
      class:processing={!order}
      aria-live="polite"
    >
      <span class="confirm-dot" aria-hidden="true"></span>
      <span class="confirm-status-text">{title}</span>
    </div>

    {#if error}
      <p class="confirm-helper">{error}</p>
    {/if}
  </header>

  {#if order}
    <div class="confirm-order">
      <h1 class="confirm-title">Merci pour votre commande 🌿</h1>
      <p class="confirm-subtitle">Voici le récapitulatif de votre commande.</p>
      <OrderCard {order} />
    </div>
  {:else}
    <div class="confirm-loading" aria-hidden="true">
      <div class="confirm-bar"></div>
    </div>
  {/if}

  <nav class="confirm-actions">
    <a href="/auth/mycount" class="confirm-btn ghost">Retour à mon compte</a>
    <a href="/" class="confirm-btn primary">Continuer mes achats</a>
  </nav>
</section>

<!-- ===== STYLES ===== -->
<style>
  /* === Page container === */
  .confirm-wrapper {
    width: min(100%, 880px);
    background: #fff;
    border: 1px solid rgba(36, 110, 21, 0.12);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    padding: clamp(1rem, 2.5vw, 1.5rem);
    margin: 5rem auto;
  }

  /* === Header section === */
  .confirm-header {
    display: grid;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  /* Status badge */
  .confirm-status {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.55rem 0.9rem;
    border-radius: 999px;
    font-weight: 600;
    font-size: 0.95rem;
    border: 1px solid transparent;
    background: #f3f8f5;
    color: #2a5b2b;
  }

  .confirm-status.processing {
    background: #fff9e8;
    color: #845700;
    border-color: rgba(245, 181, 56, 0.35);
  }

  .confirm-status.success {
    background: #e9f7ef;
    color: #1f7a4d;
    border-color: rgba(31, 122, 77, 0.25);
  }

  /* Animated status dot */
  .confirm-dot {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 999px;
    background: currentColor;
    box-shadow: 0 0 0 0 currentColor;
    animation: pulse 1.8s ease-out infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
      opacity: 0.9;
    }
    70% {
      box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
      opacity: 0.6;
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
      opacity: 0.9;
    }
  }

  .confirm-helper {
    margin: 0;
    color: #3b4a3f;
    font-size: 0.95rem;
  }

  /* === Titles === */
  .confirm-title {
    font-size: clamp(1.35rem, 4vw, 1.9rem);
    margin: 0.5rem 0 0;
    background: linear-gradient(90deg, #246e15, #0b2512);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  .confirm-subtitle {
    margin: 0.35rem 0 1rem;
    color: #4c5c51;
    font-size: 0.98rem;
  }

  /* === Order summary === */
  .confirm-order {
    display: grid;
    gap: 0.6rem;
  }

  /* Add spacing above the OrderCard */
  .confirm-order :global(.order-card) {
    margin-top: 0.35rem;
  }

  /* === Loading skeleton === */
  .confirm-loading {
    border: 1px solid rgba(36, 110, 21, 0.12);
    background: #fbfdfc;
    border-radius: 12px;
    padding: 1rem;
  }

  .confirm-bar {
    height: 10px;
    border-radius: 999px;
    width: 40%;
    background: linear-gradient(
      90deg,
      rgba(36, 110, 21, 0.18),
      rgba(36, 110, 21, 0.08),
      rgba(36, 110, 21, 0.18)
    );
    animation: loading 1s linear infinite;
    background-size: 200% 100%;
  }

  @keyframes loading {
    0% {
      background-position: 0% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* === Actions === */
  .confirm-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  .confirm-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.65rem 1.1rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease,
      filter 0.15s ease, background-color 0.15s ease;
  }

  .confirm-btn:hover {
    transform: translateY(-1px);
  }

  .confirm-btn.primary {
    background: #246e15;
    color: #fff;
  }

  .confirm-btn.primary:hover {
    box-shadow: 0 6px 14px rgba(36, 110, 21, 0.22);
  }

  .confirm-btn.ghost {
    background: #fff;
    color: #246e15;
    border-color: #246e15;
  }

  .confirm-btn.ghost:hover {
    box-shadow: 0 6px 14px rgba(36, 110, 21, 0.16);
  }

  /* === Responsive === */
  @media (max-width: 720px) {
    .confirm-wrapper {
      width: calc(100% - clamp(1.25rem, 6vw, 2rem));
      margin-inline: auto;
    }
    .confirm-actions {
      justify-content: center;
    }
  }

  @media (max-width: 960px) {
    .confirm-wrapper {
      width: calc(100% - clamp(1.25rem, 6vw, 2rem));
      margin-inline: auto;
      padding-inline: clamp(1rem, 4vw, 1.5rem);
      border-radius: 14px;
    }
  }
</style>