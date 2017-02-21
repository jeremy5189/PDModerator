<template>
  <div class="row">
    <div class="col"></div>
    <div class="col-auto">
      <h2>{{ title }}</h2>
    </div>
    <div class="col"></div>
  </div>
</template>

<script>
export default {
  name: 'queue',
  data() {
    return {
      title: 'Queue',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
