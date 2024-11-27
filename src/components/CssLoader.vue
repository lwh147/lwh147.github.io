<template>
  <div></div>
</template>

<script>
export default {
  name: 'CssLoader',
  props: {
    href: {type: String, required: true},
  },
  beforeMount() {
    const s = document.createElement('link');
    s.href = this.href;
    s.rel = 'stylesheet';
    document.head.appendChild(s);
  }
};
</script>

<style scoped>

</style>