<script>
  import { formatDateToDisplay, formatDateToIso } from "$lib/utils/DateFormatter.js";
  import { formatPriceToDisplay } from "$lib/utils/PriceFormatter";

  // Expect an "order" object (contains number, date, order lines, total)
  export let order;

  // === Format helpers ===
  const dateIso = (d) => formatDateToIso(d);
  const dateDisplay = (d) => formatDateToDisplay(d);
  const priceDisplay = (p) => formatPriceToDisplay(p);
</script>

<!-- === ORDER CARD === -->
<article
  class="order-card"
  aria-labelledby={`order-${order?.id}-title`}
  itemscope
  itemtype="http://schema.org/Order"
>
  <!-- Order title -->
  <h3 id={`order-${order?.id}-title`} class="order-number">
    {order?.order_number}
  </h3>

  <!-- Order date -->
  <p class="order-date">
    Date :
    <time datetime={dateIso(order?.created_at)}>
      {dateDisplay(order?.created_at)}
    </time>
  </p>

  <!-- Table layout for details -->
  <div class="order-details" role="region" aria-label="Détail de la commande">
    <table>
      <caption class="sr-only">
        Détail de la commande {order?.order_number}
      </caption>

      <thead>
        <tr>
          <th scope="col">Produit</th>
          <th scope="col">Quantité</th>
          <th scope="col">Prix unitaire</th>
          <th scope="col">Sous-total</th>
        </tr>
      </thead>

      <tbody>
        {#each order?.order_lines ?? [] as line}
          <tr>
            <td data-label="Produit">{line?.tree?.name}</td>
            <td data-label="Quantité">{line?.quantity}</td>
            <td data-label="Prix unitaire">{priceDisplay(line?.unit_price)}</td>
            <td data-label="Sous-total">{priceDisplay(line?.total_price)}</td>
          </tr>
        {/each}
      </tbody>

      <tfoot>
        <tr>
          <th scope="row" colspan="3" class="total-label">Total</th>
          <td class="total-order">{priceDisplay(order?.total_price)}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</article>

<style>
  /* === CARD BASE === */
  .order-card {
    background: #fff;
    border: 1px solid rgba(36, 110, 21, 0.12);
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    padding: clamp(0.9rem, 1.2vw, 1.25rem) clamp(1rem, 2vw, 1.25rem);
    margin: clamp(0.6rem, 1.2vw, 0.9rem) 0;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .order-card:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  /* === HEADER === */
  .order-number {
    margin: 0.25rem 0;
    font-size: clamp(1rem, 1.2vw, 1.15rem);
    font-weight: 700;
    letter-spacing: 0.3px;
    color: #17351b;
  }

  .order-date {
    margin: 0 0 0.75rem;
    font-size: clamp(0.92rem, 1vw, 0.98rem);
    color: #3b4a3f;
  }
  .order-date time {
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    background: #f1f8f3;
    border: 1px solid rgba(36, 110, 21, 0.16);
    display: inline-block;
    margin-left: 0.35rem;
    font-variant-numeric: tabular-nums;
  }

  /* === TABLE WRAPPER === */
  .order-details {
    border: 1px solid rgba(36, 110, 21, 0.12);
    border-radius: 12px;
    background: #f9fbfa;
    overflow: hidden;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .order-details::-webkit-scrollbar {
    height: 8px;
  }
  .order-details::-webkit-scrollbar-thumb {
    background: rgba(23, 53, 27, 0.2);
    border-radius: 999px;
  }

  /* === TABLE STRUCTURE === */
  .order-details table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 620px;
    background: #fff;
  }

  .order-details thead th {
    text-align: left;
    font-size: clamp(0.8rem, 0.9vw, 0.9rem);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #2a5b2b;
    background: #f3f8f5;
    border-bottom: 1px solid rgba(36, 110, 21, 0.18);
    padding: 0.8rem 0.9rem;
  }

  .order-details tbody td {
    padding: 0.85rem 0.9rem;
    border-bottom: 1px solid rgba(36, 110, 21, 0.08);
    color: #132016;
    font-size: clamp(0.95rem, 1vw, 1rem);
    vertical-align: top;
  }

  .order-details tbody tr:nth-child(odd) td {
    background: #fbfdfc;
  }

  .order-details tfoot th,
  .order-details tfoot td {
    padding: 0.9rem 0.9rem;
    font-weight: 700;
    background: #f7fbf8;
    border-top: 1px solid rgba(36, 110, 21, 0.18);
    font-size: clamp(0.95rem, 1vw, 1rem);
  }

  .total-label {
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #2a5b2b;
  }
  .total-order {
    font-size: clamp(1rem, 1.2vw, 1.05rem);
    color: #17351b;
  }

  /* === RESPONSIVE TABLET (600–1024px) === */
  @media (max-width: 1024px) and (min-width: 600px) {
    .order-card {
      border-radius: 14px;
    }
    .order-details thead th,
    .order-details tbody td {
      padding: 0.8rem;
    }
    .order-details table {
      min-width: 560px;
    }
  }

  /* === MOBILE (≤599px): table → cards === */
  @media (max-width: 599px) {
    .order-details {
      overflow-x: visible;
    }
    .order-details table {
      min-width: 0;
      border-collapse: collapse;
      background: transparent;
    }

    /* Hide header visually but keep it accessible */
    .order-details thead {
      border: 0;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }

    .order-details tbody,
    .order-details tfoot {
      display: block;
      width: 100%;
    }

    /* Turn rows into cards */
    .order-details tbody tr {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.4rem;
      background: #fff;
      border: 1px solid rgba(36, 110, 21, 0.12);
      border-radius: 12px;
      padding: 0.8rem 0.9rem;
      margin: 0.7rem 0.6rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
    }

    .order-details tbody td {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 0.6rem;
      align-items: start;
      border: 0;
      padding: 0;
      font-size: 1rem;
    }

    .order-details tbody td::before {
      content: attr(data-label) " :";
      font-weight: 600;
      color: #2a5b2b;
      min-width: 7.5ch;
    }

    /* Footer as separate card */
    .order-details tfoot tr {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.6rem;
      background: #f7fbf8;
      border-top: 1px solid rgba(36, 110, 21, 0.18);
      border-radius: 12px;
      padding: 0.9rem;
      margin: 0.8rem 0.6rem 0.9rem;
    }

    .order-number {
      font-size: 1rem;
    }
    .order-date {
      font-size: 0.9rem;
    }
  }

  /* === ACCESSIBILITY HELPERS === */
  .sr-only {
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap;
    border: 0;
    padding: 0;
    margin: -1px;
  }
</style>