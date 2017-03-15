<template>
<div class="row">
  <div class="col-1"></div>
  <div class="col-10">
    <h2>SITCON 2017 論壇發言系統</h2>
    <b-alert :show="true" :state="alert.state" v-html="alert.message">

    </b-alert>
    <h3>同學，你這樣經營社群？學生資訊社群的藝術</h3>
    <p>
      為了尋得志同道合的朋友一同探索資訊技術的堂奧，許多夥伴們都曾在校內外留下自己的足跡：他們有些升起大旗，組織起在地的社團與讀書會，有些則跨越領域、學校的藩籬互相合作，透過新創媒合、黑客松拓展同學的視野。這些組織往往是促進社會創新的第一線，但在實務運作過程中卻經常面臨到許多難題。作爲吸引全臺灣對資訊有興趣的學生一同分享的平臺，SITCON 今年在近兩小時的論壇中，希望能回顧各地校園內的資訊參與近況，探討經營資訊社群時遇到的困難與挑戰，共塑學生資訊社群共同的理想與展望。
    </p>
    <h3>論壇進行說明</h3>
    <ul>
      <li>每位與會者都可以透過 SITCON 論壇發言系統登記發言</li>
      <li>完成登記後經過主持人確認，將被排入發言佇列（Queue），並顯示於投影幕上</li>
      <li>與會者每次皆有 90 秒發言時間，超過則需停止發言</li>
      <li>所有發言請務必遵守 SITCON CoC 及符合討論主題</li>
      <li>允許匿名發言，請於名稱填寫匿名，於發言摘要表達您的意見</li>
      <li>我們保留在同時發言登記過量時調節發言順序的權力</li>
    </ul>
    <h3>發言方式說明</h3>
    <p>
      提出發言申請後請留意場內投影幕下方的 Speaker Queue，當快要輪到您發言時，請前往離您座位最近的發言點準備。並請參考下列圖片中標示的 R0 發言點。
    </p>
    <div class="img-wrap">
      <img src="../assets/speak_point.jpg" alt="">
    </div>
    <footer>
      <p>&copy; SITCON 2017. Powered by <a target="_blank" href="https://github.com/jeremy5189/PDModerator">PDModerator</a></p>
    </footer>
  </div>
  <div class="col-1"></div>
    
</div>
</template>

<script>
import Moment from 'moment';
import config from '../../common-config.json';

export default {
  name: 'indexpage',
  data() {
    return {
      alert: {
        state: 'info',
        message: `<strong>系統將於下列時間開放</strong> ${config.allow_speaker_ts.comment1} - ${config.allow_speaker_ts.comment2}`,
      },
    };
  },
  created() {
    if (config.allow_speaker_ts.force_ignore) {
      this.openLink();
    }
    if (config.allow_speaker_ts.start !== 0 && config.allow_speaker_ts.end !== 0) {
      const now = Moment().unix();
      if (now < config.allow_speaker_ts.start || now > config.allow_speaker_ts.end) {
        // Not in open time
      } else {
        // Open time
        this.openLink();
      }
    } else {
      // Both equal zero, no limit
      this.openLink();
    }
  },
  methods: {
    openLink() {
      this.alert.state = 'success';
      this.alert.message = '<strong>系統已經開放</strong> <a href="/#/attendee">請點此前往發言</a>';
    },
  },
};
</script>

<style scoped>
h2 {
  margin-top: 2em;
  text-align: center;
  margin-bottom: 1.5em;
}
h3 {
  margin-top: 1.5em;
  text-align: center;
  margin-bottom: 1em;
}
.img-wrap {
  text-align: center;
  margin-top: 2em;
  margin-bottom: 3em;
}
.img-wrap img {
  width: 100%;
  height: auto;
  max-width: 419px;
}
footer {
  text-align: center;
  margin-bottom: 2em;
}
</style>
