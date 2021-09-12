<template>
  <div></div>
</template>

<script>
export default {
  name: "js-loader",
  props: {
    src: {type: String, required: true},
  },
  beforeMount() {
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = this.src
    document.body.appendChild(s)
  }
}
</script>

<style scoped>

</style>