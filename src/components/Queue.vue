<template>
  <div class="no-use">
    <div class="row">
      <div class="col-9">
        <!-- Data -->
        <div class="row">
          <!-- Forum Name -->
          <div class="col-12" id="title-contain">
            <img id="logo" src="../assets/sitcon.svg" alt="">
          </div>
          <!-- Subject -->
          <div class="col-12" id="subject-contain">
            <h1>
              <span class="highlight">目前主題</span> {{ subject }}
            </h1>
          </div>
          <!-- Current user -->
          <div class="col-12" id="userdata-contain">
            <div class="row">
              <div class="col-4" id="gravatar-contain">
                <img v-bind:src="attendee_gravatar" alt="">
              </div>
              <div class="col-8" id="username-contain">
                <h2>{{ attendee_name }}</h2>
              </div>
            </div>
          </div>
          <div class="col-12" id="summary-contain">
            <h4>{{ summary }}</h4>
          </div>
        </div>
      </div>
      <!-- Timer -->
      <div class="col-3">

      </div>
    </div>
    <div class="row">
      <div class="col-12" id="queue-contain">
        <div class="row">
          <div class="col-2"></div>
          <div class="col-2"></div>
          <div class="col-2"></div>
          <div class="col-2"></div>
          <div class="col-2"></div>
          <div class="col-2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'queue',
  data() {
    return {
      title: 'SITCON 論壇',
      subject: '早安我的朋友，PCC 蒸蚌，平安喜樂，認同請分享，另外我是第二行',
      attendee_gravatar: 'https://www.gravatar.com/avatar/ab28213a16494a32a1f1c896276037eb?s=150',
      attendee_name: '一二三四五六七八九十',
      summary: '洛克的政治哲學對「分配正義」這個議題有多麼重大的意義：它在「自然律」的基礎上，證明了資本主義的私有產權體制，不但不會構成道德不公平，更是保障古典自由主義對道',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#username-contain {
  padding: 2.6em 2.5em 2.5em 0em;
}
#username-contain h2 {
  font-size: 3.5em;
}
#summary-contain {
  padding: 0em 0em 2em 4em;
  height: 170px;
  min-height: 170px;
}
#gravatar-contain {
  padding: 1.6em 0em 2em 4.87em;
}
#gravatar-contain img {
  width: 149.87px;
  border-radius: 50%;
  border-width: 8.7px;
  border-style: solid;
  border-color: green;
}
#title-contain {
  padding: 1em 0em 1.5em 4em;
  border-bottom-style: solid;
  border-bottom-width: 3px;
}
#subject-contain {
  padding-top: 2em;
  padding-left: 4em;
  min-height: 144px;
  height: 144px;
}
#subject-contain h1 {
  line-height: 1.3;
}
#logo {
  height: 45px;
  max-height: 45px;
}
.highlight {
  color: white;
  background-color: black;
}
#queue-contain {
  border-top-style: solid;
  border-top-width: 3px;
}
#userdata-contain {
  height: 211.59px;
  min-height: 211.59px;
}
</style>
