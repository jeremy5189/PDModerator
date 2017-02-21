<template>
  <div class="container" id="app">
    <div class="row">
      <div class="col-md-10 col-md-offset-1">
        <alert type="success">Current Topic: {{ topic }}</alert>
      </div>
    </div>
  </div>
</template>

<script>
import alert from 'vue-strap/src/Alert';

export default {
  name: 'app',
  components: {
    alert,
  },
  data() {
    return {
      topic: 'Testing',
    };
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
