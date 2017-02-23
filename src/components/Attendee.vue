<template>
  <div class="row">
    <div class="col-2"></div>
    <div class="col-8">

      <h2>{{ title }}</h2>
      <b-alert :show="true" state="success" dismissible>
        This is an alert
      </b-alert>

      <b-form-input v-model="attendee_name" id="attendee_name" class="input" placeholder="Enter your name"></b-form-input>
      <label for="name">
        請輸入顯示名稱以排入講者 Queue，長度不得超過 10 字元
      </label>

      <textarea v-model="summary" name="summary" id="summary" class="form-control input" rows="5" placeholder="Enter your speaking summary"></textarea>
      <label for="name">
        請輸入您的發言概要，至多不超過 140 個字元
      </label>

      <br>

      <div class="center">
        <b-button id="submit" @click="click">
          Submit
        </b-button>
      </div>

    </div>
    <div class="col-2"></div>
  </div>
</template>

<script>
export default {
  name: 'attendee',
  data() {
    return {
      title: 'Speaker Queue',
      attendee_name: null,
      summary: null,
    };
  },
  methods: {
    click() {
      this.$http.post('http://localhost:3000/api/attendee', {
        attendee_name: this.attendee_name,
        summary: this.summary,
      }).then((response) => {
        // success
        console.log(response.body);
      }, (response) => {
        // Fail
        console.error(response);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#submit {
  margin: 0 auto;
  margin-top: 2em;
}
h2 {
  margin-top: 2em;
  text-align: center;
  margin-bottom: 0.5em;
}
.alert {
  margin: 0 auto;
  margin-top: 1.5em;
  margin-bottom: 2em;
}
.input {
  margin-top: 1.5em;
  margin-bottom: 5px;
}
label {
  color: dimgray;
}
.center {
  text-align: center;
}
</style>
