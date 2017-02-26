<template>
  <div class="row">
    <div class="col-2"></div>
    <div class="col-8">

      <h2>{{ title }}</h2>
      <b-alert v-if="alert.success" :show="true" state="success" dismissible>
        {{ alert.success_text }}
      </b-alert>

      <b-alert v-if="alert.danger" :show="true" state="danger" dismissible>
        {{ alert.danger_text }}
      </b-alert>

      <b-form-input v-model="attendee_name" maxlength="10" id="attendee_name" class="input" placeholder="Enter your name"></b-form-input>
      <label for="name">
        請輸入顯示名稱以排入講者 Queue，長度不得超過 10 字元 (必填)
      </label>

      <b-form-input v-model="email" id="email" class="input" type="email" placeholder="Enter your email"></b-form-input>
      <label for="email">
        請輸入電子郵件（選填，會顯示於台上的
        <a src="https://zh-tw.gravatar.com/">Gravatar</a>）
      </label>

      <textarea v-model="summary" maxlength="100" name="summary" id="summary" class="form-control input" rows="5" placeholder="Enter your speaking summary"></textarea>
      <label for="summary">
        請輸入您的發言概要，至多不超過 100 個字元 (選填，會顯示於台上)
      </label>

      <br>

      <div class="center">
        <div id="recaptcha">
          <vue-recaptcha ref="recaptcha" :options="opts" :sitekey="opts.siteKey" @verify="onVerify" @expired="onExpired"></vue-recaptcha>
        </div>
        <b-button id="submit" @click="click">
          Submit
        </b-button>
      </div>

    </div>
    <div class="col-2"></div>
  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
import config from '../../common-config.json';

/* eslint-disable no-console */
/* eslint-disable no-undef */
const attendee = {
  name: 'attendee',
  components: {
    VueRecaptcha,
  },
  data() {
    return {
      title: 'Speaker Queue',
      attendee_name: null,
      email: null,
      summary: null,
      opts: {
        siteKey: '6LfanRYUAAAAAPL2JK96iI3Y7WeLsq1FxuG54zBG',
      },
      alert: {
        success: false,
        success_text: '成功排入講者 Queue 中',
        danger: false,
        danger_text: '發生錯誤，請重新整理後重試',
      },
      g_recaptcha_response: null,
    };
  },
  methods: {
    click() {
      if (this.g_recaptcha_response !== null) {
        this.alert.danger = false;
        this.$http.post(`${config.api_url}/api/attendee`, {
          attendee_name: this.attendee_name,
          email: this.email,
          summary: this.summary,
          g_recaptcha_response: this.g_recaptcha_response,
        }).then((response) => {
          // success
          if (response.body.status) {
            this.alert.success = true;
          } else {
            this.alert.danger = true;
          }
          this.resetRecaptcha();
        }, () => {
          // Fail
          this.alert.danger = true;
          this.resetRecaptcha();
        });
      } else {
        this.alert.danger_text = '請完成 CAPTCHA 驗證';
        this.alert.danger = true;
      }
    },
    onVerify(response) {
      // console.log('Verify: %s', response);
      this.g_recaptcha_response = response;
    },
    onExpired() {
      console.info('Recaptcha Expired');
      this.resetRecaptcha();
    },
    resetRecaptcha() {
      this.$refs.recaptcha.reset(); // Direct call reset method
    },
  },
};

export default attendee;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#recaptcha {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5em;
}
#submit {
  margin: 0 auto;
  margin-top: 1.5em;
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
