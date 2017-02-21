<template>
  <div class="row">
    <div class="col">
      <h2>{{ title }}</h2>
      <b-alert :show="true" state="success" dismissible>
        This is an alert
      </b-alert>
    </div>
  </div>
</template>

<script>
export default {
  name: 'attendee',
  data() {
    return {
      title: 'Attendee',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  margin-top: 2em;
  text-align: center;
}
.alert {
  width: 80%;
  margin: 0 auto;
}
</style>
