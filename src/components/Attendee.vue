<template>
  <div class="row">
    <div class="col-1"></div>
    <div class="col-10">

      <h2>{{ title }}</h2>
      <b-alert v-if="alert.success" :show="true" state="success" dismissible>
        {{ alert.success_text }}
      </b-alert>

      <b-alert v-if="alert.danger" :show="true" state="danger" dismissible>
        {{ alert.danger_text }}
      </b-alert>

      <b-form-input  v-model="form.attendee_name" maxlength="20" id="attendee_name" class="input" placeholder="Enter your name"></b-form-input>
      <label for="name">
        請輸入顯示名稱，長度不得超過 20 字符 (必填, 目前<a href="https://www.npmjs.com/package/wcwidth">字符</a>數：{{ form.attendee_name_wclen }})
      </label>

      <b-form-input v-model="form.email" id="email" class="input" type="email" placeholder="Enter your email"></b-form-input>
      <label for="email">
        請輸入電子郵件（選填，會自動取得關聯之 
        <a href="https://zh-tw.gravatar.com/">Gravatar</a> 顯示於投影幕）
      </label>

      <textarea v-model="form.summary" maxlength="200" name="summary" id="summary" class="form-control input" rows="5" placeholder="Enter your speaking summary"></textarea>
      <label for="summary">
        請輸入您的發言概要（顯示於投影幕），至多不超過 200 個字符 (選填, 目前<a href="https://www.npmjs.com/package/wcwidth">字符</a>數：{{ form.summary_wclen }})
      </label>

      <br>

      <div class="center">
        <div id="recaptcha">
          <vue-recaptcha ref="recaptcha" id="recaptcha" :options="opts" :sitekey="opts.siteKey" @verify="onVerify" @expired="onExpired"></vue-recaptcha>
        </div>
        <b-button id="submit" @click="click">
          {{ submit }}
        </b-button>
      </div>

    </div>
    <div class="col-1"></div>
  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
import wcWidth from 'wcwidth'; // Chinese length = 2
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
      title: '發言申請',
      form: {
        attendee_name: null,
        email: null,
        summary: null,
        attendee_name_wclen: 0,
        summary_wclen: 0,
      },
      opts: {
        siteKey: config.reCAPTCHA.site_key,
      },
      alert: {
        success: false,
        success_text: '成功送出發言申請，請留意投影幕上的講者 Queue',
        danger: false,
        danger_text: '發生錯誤，請重新整理後重試',
      },
      g_recaptcha_response: config.reCAPTCHA.enabled ? null : 'disabled-by-config',
      submit: 'Submit',
    };
  },
  watch: {
    // eslint-disable-next-line
    'form.attendee_name': function () {
      this.form.attendee_name_wclen = wcWidth(this.form.attendee_name);
    },
    // eslint-disable-next-line
    'form.summary': function () {
      this.form.summary_wclen = wcWidth(this.form.summary);
    },
  },
  methods: {
    click() {
      const checkResult = this.checkForm();
      if (this.g_recaptcha_response !== null && checkResult.status) {
        this.alert.danger = false;
        this.submit = '連線中...';
        this.$http.post(`${config.api_url}/public/attendee`, {
          attendee_name: this.form.attendee_name,
          email: this.form.email,
          summary: this.form.summary,
          g_recaptcha_response: this.g_recaptcha_response,
        }).then((response) => {
          // success
          if (response.body.status) {
            this.alert.success = true;
            this.form.attendee_name = '';
            this.form.email = '';
            this.form.summary = '';
            this.submit = 'Submit';
          } else if (response.status !== 200) {
            this.dangerAlert('伺服器資料寫入失敗，請稍候重試');
          } else {
            this.dangerAlert(`伺服器回傳錯誤代碼：${response.status}`);
          }
          this.resetWrap();
        }, () => {
          // Fail
          this.dangerAlert('連線失敗，請檢查網路連線後重試');
          this.resetWrap();
        });
      } else if (!checkResult.status) {
        this.dangerAlert(checkResult.message);
      } else {
        this.resetRecaptcha();
        this.dangerAlert('請完成 reCAPTCHA 驗證');
      }
    },
    checkForm() {
      let msg = '';
      let stat = true;
      if (this.form.attendee_name === '') {
        msg = '名稱為必填欄位';
        stat = false;
      } else if (wcWidth(this.form.attendee_name) > 20) {
        msg = '名稱超過 20 個字符';
        stat = false;
      } else if (wcWidth(this.form.summary) > 200) {
        msg = '發言摘要超過 200 個字符';
        stat = false;
      }
      return {
        status: stat,
        message: msg,
      };
    },
    dangerAlert(msg) {
      this.alert.success = false;
      this.alert.danger_text = msg;
      this.alert.danger = true;
      this.submit = 'Submit';
    },
    resetWrap() {
      this.resetRecaptcha();
      this.g_recaptcha_response = config.reCAPTCHA.enabled ? null : 'disabled-by-config';
      this.submit = 'Submit';
    },
    onVerify(response) {
      this.g_recaptcha_response = response;
    },
    onExpired() {
      this.resetWrap();
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
  margin-bottom: 6em;
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
