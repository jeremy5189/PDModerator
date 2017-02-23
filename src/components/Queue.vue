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
            <h3>{{ summary }}</h3>
          </div>
        </div>
      </div>
      <!-- Timer -->
      <div class="col-3" id="timer-contain">

        <div class="counter">
          <div class="square">
            <h3 class="square-count">87</h3>
          </div>
          <h4>剩餘秒數</h4>
        </div>

        <div class="counter">
          <div class="square">
            <h3 class="square-count">6</h3>
          </div>
          <h4>等待講者</h4>
        </div>

      </div>
    </div>
    <div class="row">
      <div class="col-12" id="queue-contain">
        <div class="row">
          <div class="col-2 queue-user">
            <img v-bind:src="attendee_gravatar" alt="">
            <br>
            <p>Arbeiter</p>
          </div>
          <div class="col-2 queue-user">
            <img v-bind:src="attendee_gravatar" alt="">
            <br>
            <p>Arbeiter</p>
          </div>
          <div class="col-2 queue-user">
            <img v-bind:src="attendee_gravatar" alt="">
            <br>
            <p>Arbeiter</p>
          </div>
          <div class="col-2 queue-user">
            <img v-bind:src="attendee_gravatar" alt="">
            <br>
            <p>Arbeiter</p>
          </div>
          <div class="col-2 queue-user">
            <img v-bind:src="attendee_gravatar" alt="">
            <br>
            <p>Arbeiter</p>
          </div>
          <div class="col-2 queue-user">
            <img v-bind:src="attendee_gravatar" alt="">
            <br>
            <p>Arbeiter</p>
          </div>
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
      subject: '早安我的社會主義朋友，平安喜樂，認同請分享，另外我是湊字數啦',
      attendee_gravatar: 'https://www.gravatar.com/avatar/ab28213a16494a32a1f1c896276037eb?s=150',
      attendee_name: '我是社會主義工人蒸蚌',
      summary: '洛克的政治哲學對「分配正義」這個議題有多麼重大的意義：它在「自然律」的基礎上，證明了資本主義的私有產權體制，不但不會構成道德不公平，更是保障古典自由主義對道德平等標準的一件事。又，在這樣的脈落下毀滅了',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.square {
  background-color: lightgray;
  height: 157px;
  width: 157px;
  border-radius: 50%;
  display: table;
  margin: 0 auto;
}
.square-count {
  display: table-cell;
  vertical-align: middle;
  font-size: 3.5em;
}
.counter {
  margin-top: 2.7em;
}
#timer-contain {
  padding-top: 1em;
  text-align: center;
  border-left-style: dashed;
  border-left-width: 1px;
}
#timer-contain h4 {
  margin-top: 15px;
  font-size: 2.5em;
}
.queue-user {
  border-left-style: dashed;
  border-left-width: 1px;
  text-align: center;
}
.queue-user:first-of-type {
  border-left-style: none;
}
.queue-user img {
  border-radius: 50%;
  width: 60px;
  margin-top: 1.4em;
}
.queue-user p {
  font-size: 1.7em;
  margin-top: 0.5em;
}

#username-contain {
  padding: 4em 2em 2.5em 0em;
}
#username-contain h2 {
  font-size: 2.8em;
}

#summary-contain {
  padding: 0em 1em 2em 3.5em;
  height: 181px;
  min-height: 181px;
}
#summary-contain h3 {
  line-height: 1.4;
  font-size: 1.7em;
}

#gravatar-contain {
  padding: 1.5em 0em 2em 5.3em;
}
#gravatar-contain img {
  width: 130.87px;
  border-radius: 50%;
  border-width: 8.7px;
  border-style: solid;
  border-color: green;
}

#title-contain {
  padding: 1em 0em 1.5em 3.5em;
  border-bottom-style: solid;
  border-bottom-width: 3px;
}

#subject-contain {
  padding-top: 2em;
  padding-left: 3.5em;
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
  height: 200px;
  min-height: 200px;
}
</style>
