<script>
  // Current progress value (0–100)
  export let value = 0;

  // Whether to display the percentage label visually
  export let showPercent = true;

  // Dynamic ARIA label for accessibility
  $: ariaLabel = `Progression : ${value}% de l'objectif atteint`;
</script>

<!-- === COMPONENT MARKUP === -->
<div class="progress-wrap">
  {#if showPercent}
    <p class="progress-label">{value}% de l'objectif atteint</p>
  {/if}

  <div
    class="progress-bar"
    role="progressbar"
    aria-label={ariaLabel}
    aria-valuenow={value}
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="progress" style="width: {value}%;"></div>
  </div>
</div>

<style>
  /* === WRAPPER === */
  .progress-wrap {
    display: grid;
    gap: 0.35rem;
    width: 100%;
  }

  /* === LABEL === */
  .progress-label {
    margin: 0;
    font-size: 0.9rem;
    color: #ffffff;
    text-align: center;
  }

  /* === BAR BACKGROUND === */
  .progress-bar {
    width: 100%;
    height: 14px;
    background: #e2e8f0;
    border-radius: 999px;
    overflow: hidden;
  }

  /* === FILLING BAR === */
  .progress {
    height: 100%;
    background: #2e7d32;
    transition: width 0.4s ease;
  }
</style>