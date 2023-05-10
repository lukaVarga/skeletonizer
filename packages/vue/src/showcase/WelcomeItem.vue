<template>
  <div class="item">
    <i>
      <slot name="icon" />
    </i>
    <div class="details">
      <h3>
        <slot name="heading" />
      </h3>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  margin-top: 2rem;
}

.details {
  flex: 1;
  margin-left: 1rem;
}

i {
  color: var(--color-text);
  display: flex;
  height: 32px;
  place-content: center;
  place-items: center;
  width: 32px;
}

h3 {
  color: var(--color-heading);
  font-weight: 500;
  margin-bottom: .4rem;
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: .4rem 0 1rem calc(var(--section-gap) / 2);
  }

  i {
    background: var(--color-background);
    border: 1px solid var(--color-border);
    /*border-radius: 8px;*/
    height: 50px;
    left: -26px;
    position: absolute;
    top: calc(50% - 25px);
    width: 50px;
  }

  .item::before {
    border-left: 1px solid var(--color-border);
    bottom: calc(50% + 25px);
    content: ' ';
    height: calc(50% - 25px);
    left: 0;
    position: absolute;
  }

  .item::after {
    border-left: 1px solid var(--color-border);
    content: ' ';
    height: calc(50% - 25px);
    left: 0;
    position: absolute;
    top: calc(50% + 25px);
  }

  .item:first-of-type::before {
    display: none;
  }

  .item:last-of-type::after {
    display: none;
  }
}
</style>
