<script>
  import "/src/app.css";
  import { cart, removeFromCart, updateQuantity, clearCart } from "$lib/stores/cart";
  import { onMount } from "svelte";
  
  // ======== State ========
  let cartItems = [];

  // Reactive subscription to the cart store
  // Updates cartItems whenever the store changes
  $: cart.subscribe(value => { cartItems = value; });

  // Calculate total dynamically whenever cartItems change
  $: total = cartItems.reduce(
    (sum, item) => sum + (item.price / 100) * item.quantity,
    0
  );

  // ======== Lifecycle ========
  onMount(() => {
    document.title = "Mon Panier - GreenRoots";
  }); 
</script>

<!-- ======== PAGE CONTENT ======== -->
<div class="cart-container">
  <h1>Mon panier</h1>

  <!-- Display the cart if it contains items -->
  {#if cartItems.length > 0}
    <ul>
      {#each cartItems as item}
        <li>
          <!-- Product image -->
          <img src={item.image} alt={item.name} />
          
          <!-- Product info (name + price) -->
          <div class="product-info">
            <strong>{item.name}</strong>
            <div class="price">{item.price / 100} € l'unité</div>
          </div>

          <!-- Quantity input -->
          <div class="quantity-control">
            <span>Quantité:</span>
            <input
              type="number"
              min="1"
              bind:value={item.quantity}
              on:change={(e) => updateQuantity(item.id, +e.target.value)}
            />
          </div>

          <!-- Remove button -->
          <button class="remove-btn" on:click={() => removeFromCart(item.id)}>
            🗑️ Supprimer
          </button>
        </li>
      {/each}
    </ul>

    <!-- Cart summary -->
    <div style="text-align: center;">
      <div class="total-section">
        <h2>Total : {total.toFixed(2)} €</h2>
        <a href="/orders" class="checkout-btn">Procéder à la facturation</a>
      </div>
    </div>

  {:else}
    <!-- Empty cart fallback -->
    <div class="empty-cart">
      <p>Votre panier est vide 🛒</p>
    </div>
  {/if}
</div>

<!-- ======== STYLES ======== -->
<style>
  /* Main container styles */
  .cart-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem; 
    padding-top: 12vh; 
    min-height: 100vh;
    box-sizing: border-box;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem; 
    font-size: 2.2rem; 
    font-weight: 300;
    color: #2c3e50;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  /* Product list layout */
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    max-width: 700px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  li {
    background: white;
    border-radius: 12px; 
    padding: 1rem; 
    margin-bottom: 1rem; 
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); 
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: grid;
    grid-template-columns: 100px 1fr auto auto auto; 
    gap: 1rem; 
    align-items: center;
  }

  li:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  }

  li img {
    width: 100px; 
    height: 100px; 
    object-fit: cover;
    border-radius: 8px; 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); 
    transition: transform 0.3s ease;
  }

  li img:hover {
    transform: scale(1.05);
  }

  /* Product information */
  .product-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  li strong {
    font-size: 1.3rem;
    color: #2c3e50;
    font-weight: 600;
    margin: 0;
  }

  .price {
    font-size: 1.1rem;
    color: #27ae60;
    font-weight: 500;
  }

  /* Quantity input styles */
  .quantity-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 0.5rem;
  }

  input[type="number"] {
    width: 60px;
    padding: 0.5rem;
    border: none;
    border-radius: 8px;
    text-align: center;
    background: white;
    font-weight: 600;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
  }

  /* Remove button */
  .remove-btn {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(238, 90, 82, 0.3);
  }

  .remove-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(238, 90, 82, 0.4);
    background: linear-gradient(135deg, #ff5252, #d32f2f);
  }

  /* Total section */
  .total-section {
    width: fit-content;
    margin: 1.5rem auto 0.5rem auto;
    padding: 1rem 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    text-align: center;
    display: inline-block;
  }

  h2 {
    font-size: 1.4rem;
    color: #2c3e50;
    font-weight: 600;
    margin: 0 0 0.75rem 0;
  }

  /* Checkout button */
  .checkout-btn {
    display: inline-block;
    margin-top: 0;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
    border-radius: 6px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(39, 174, 96, 0.25);
    font-size: 1rem;
  }

  .checkout-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(39, 174, 96, 0.4);
    background: linear-gradient(135deg, #219a52, #27ae60);
  }

  /* Empty cart placeholder */
  .empty-cart {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 16px;
    max-width: 450px;
    margin: 3rem auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .empty-cart p {
    font-size: 1.3rem;
    color: #7f8c8d;
    margin: 0;
  }

  /* Responsive layout */
  @media (max-width: 768px) {
    li {
      grid-template-columns: 80px 1fr;
      gap: 1rem;
    }

    .quantity-control,
    .remove-btn {
      grid-column: 1 / -1;
      justify-self: center;
      margin-top: 1rem;
    }

    h1 {
      font-size: 2rem;
    }
  }
</style>