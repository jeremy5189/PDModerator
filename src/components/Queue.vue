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
              <b-badge :variant="system.status">目前主題</b-badge> {{ subject }}
            </h1>
          </div>
          <!-- Current user -->
          <div class="col-12" id="userdata-contain">
            <div class="row">
              <div class="col-4" id="gravatar-contain">
                <div v-bind:title="current_speaker.email" v-bind:style="{ backgroundImage: 'url(' + gravatarSize(current_speaker.gravatar) + ')' }" alt=""></div>
              </div>
              <div class="col-8" id="username-contain">
                <h2>{{ current_speaker.attendee_name }}</h2>
              </div>
            </div>
          </div>
          <div class="col-12" id="summary-contain">
            <h3>{{ current_speaker.summary }}</h3>
          </div>
        </div>
      </div>
      <!-- Timer -->
      <div class="col-3" id="timer-contain">

        <div class="counter">
          <div class="square" v-on:click="timer_click" v-on:contextmenu="timer_right_click">
            <h3 unselectable="on" class="unselectable square-count">
              {{ timer.countdown }}
            </h3>
          </div>
          <h4 v-on:click="timer_reconfig">剩餘秒數</h4>
        </div>

        <div class="counter">
          <div class="square">
            <h3 unselectable="on" class="unselectable square-count">
              {{ queue.count }}
            </h3>
          </div>
          <h4>等待講者</h4>
        </div>

        <b-button-group id="speaker-control">
          <b-button :variant="end_btn_class" v-on:click="end_speaker">結束</b-button>
          <b-button v-on:click="next_speaker" :disabled="next_disabled">下一位</b-button>
        </b-button-group>

      </div>
    </div>
    <div class="row">
      <div class="col-12" id="queue-contain">
        <div class="row">
          <div class="col-2 queue-user" v-for="obj in limitQueue">
            <div><div v-bind:title="obj.email" v-bind:style="{ backgroundImage: 'url(' + gravatarSize(obj.gravatar) + ')' }" alt=""></div></div>
            <p>{{ obj.attendee_name | shortName }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueSocketio from 'vue-socket.io';
import config from '../../common-config.json';

Vue.use(VueSocketio, config.ws_url);

export default {
  name: 'queue',
  data() {
    return {
      title: 'SITCON 論壇',
      subject: 'Loading...',
      timer: {
        setting: 90,
        countdown: 90,
        handle: null,
        running: false,
      },
      queue: {
        list: [],
        count: 0,
      },
      holder: {
        attendee_name: '主持人',
        gravatar: 'https://www.gravatar.com/avatar/000?s=131',
        summary: 'N/A',
      },
      system: {
        status: 'default', // While loading
      },
      current_speaker: {},
      end_btn_class: 'default', // Normal state
      next_disabled: false, // btn disabled attr
    };
  },
  created() {
    // Put holder on
    this.current_speaker = this.holder;
    // component created
    this.updateQueue();
    this.updateSubject();
    // Reg key event
    window.addEventListener('keydown', this.globalKeyPress);
    // Print manual
    // eslint-disable-next-line
    console.info('Timer Hotkey: \nStart/Pause: Space/Ctrl or LClick\nReset: Alt or RClick\nClick remaining text to set custom time');
  },
  methods: {
    gravatarSize(url) {
      return `${url}?s=131`;
    },
    updateSubject() {
      this.$http.get(`${config.api_url}/public/subject`, {}).then((resp) => {
        this.subject = resp.body;
      });
    },
    // Timer functions ------
    timer_click() {
      this.timer_toggle();
    },
    timer_toggle() {
      if (this.timer.countdown > 0 && !this.timer.running) {
        // Pausing, will resume
        this.timer.handle = setInterval(this.timer_countdown, 1000);
      } else if (this.timer.countdown > 0 && this.timer.running) {
        // Couting, will pause
        this.timer_pause();
      }
      this.timer.running = !this.timer.running;
    },
    timer_pause() {
      clearInterval(this.timer.handle);
    },
    timer_right_click(event) {
      event.preventDefault();
      this.timer_reset();
    },
    timer_countdown() {
      this.timer.countdown -= 1;
      if (this.timer.countdown <= 0) {
        this.timer.countdown = 0;
        this.timer.running = false;
        clearInterval(this.timer.handle);
      }
    },
    timer_reset() {
      this.timer_pause();
      this.timer.countdown = this.timer.setting;
    },
    timer_reconfig() {
      // eslint-disable-next-line
      let newTime = prompt('Enter countdown time in seconds');
      newTime = parseInt(newTime, 10);
      if (!isNaN(newTime)) {
        this.timer.setting = newTime;
        this.timer_reset();
      }
    },
    // End timer function ---------
    next_speaker() {
      // Move first speaker in list to current_speaker
      if (this.queue.list.length > 0 && this.next_disabled !== true) {
        this.current_speaker = this.queue.list[0];
        // Remove first one in queue list
        this.queue.list.shift();
        this.queue.count = this.queue.list.length;
        this.next_disabled = true;
      }
    },
    end_speaker() {
      // call API to end speaker
      if (this.current_speaker.attendee_name !== this.holder.attendee_name) {
        // Not holder is attendee
        // Pause timer at once
        this.timer_pause();
        // eslint-disable-next-line
        this.$http.put(`${config.api_url}/api/attendee/${this.current_speaker._id}`, {
          spoken: 'true',
        }).then((resp) => {
          if (resp.body.status === 1) {
            this.end_btn_class = 'success';
            this.next_disabled = null;
            // Put holder on
            this.current_speaker = this.holder;
            // Reset timer
            this.timer_reset();
          } else {
            this.end_btn_class = 'danger';
          }
        }, () => {
          // error callback
          this.end_btn_class = 'danger';
        });
        setTimeout(() => {
          this.end_btn_class = 'default';
        }, 3000);
      }
    },
    updateQueue() {
      this.$http.get(`${config.api_url}/public/queue`).then((response) => {
        this.queue.list = response.body;
        this.queue.count = this.queue.list.length;
      });
    },
    globalKeyPress(event) {
      if (event.which === 17 || event.which === 32) { // Ctrl or Space
        this.timer_toggle();
      } else if (event.which === 18) { // Alt
        this.timer_reset();
      }
    },
  },
  sockets: {
    // Default event
    connect() {
      this.system.status = 'success';
    },
    error() {
      this.system.status = 'danger';
    },
    disconnect() {
      this.system.status = 'danger';
    },
    connecting() {
      this.system.status = 'warning';
    },
    reconnecting() {
      this.system.status = 'warning';
    },
    // Custom event
    recognized() {
      this.updateQueue();
    },
    subjectChange(val) {
      // Listen event from another Moderate page
      this.subject = val;
    },
    newAttendee() {
      if (config.direct_to_queue) {
        this.updateQueue();
      }
    },
  },
  filters: {
    shortName(str) {
      let ret = str;
      if (str.length > 10) {
        ret = `${ret.substr(0, 10)}..`;
      }
      return ret;
    },
  },
  computed: {
    limitQueue() {
      return this.queue.list.slice(0, 6);
    },
  },
};
</script>

<!-- Add "scoped " attribute to limit CSS to this component only -->
<style scoped>
.btn {
  cursor: pointer;
}
/* Right hand site circle control */
.square {
  background-color: lightgray;
  height: 157px;
  width: 157px;
  border-radius: 50%;
  display: table;
  margin: 0 auto;
  cursor: pointer;
}
.square-count {
  display: table-cell;
  vertical-align: middle;
  font-size: 3.5em;
}
.counter {
  margin-top: 2.2em;
}
/* --------- */
#timer-contain {
  padding-top: 0em;
  text-align: center;
  border-left-style: dashed;
  border-left-width: 1px;
}
#timer-contain h4 {
  margin-top: 15px;
  font-size: 2.5em;
  cursor: pointer;
}
/* --------- */
.queue-user {
  width: 100%;
  border-left-style: dashed;
  border-left-width: 1px;
  text-align: center;
}
.queue-user:first-of-type {
  border-left-style: none;
}
.queue-user div {
  width: 100%;
  margin-top: 1.4em;
  padding-bottom: 0.5em;
}
.queue-user div div {
  width: 60px;
  height: 60px;
  text-align: justify;
  margin: 0 auto;
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  border-color: black;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.queue-user p {
  font-size: 1.5em;
  margin-top: 0.4em;
  line-height: 1;
}
/* --------- */
#username-contain {
  padding: 4em 2em 2.5em 0em;
}
#username-contain h2 {
  font-size: 2.8em;
}
/* --------- */
#summary-contain {
  padding: 0em 1em 2em 3.5em;
  height: 181px;
  min-height: 181px;
}
#summary-contain h3 {
  line-height: 1.4;
  font-size: 1.7em;
}
/* --------- */
#gravatar-contain {
  padding: 1.5em 0em 2em 5.3em;
}
#gravatar-contain div {
  width: 130.87px;
  height: 130.87px;
  border-radius: 50%;
  border-width: 3px;
  border-style: solid;
  border-color: black;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
/* --------- */
#title-contain {
  padding: 1em 0em 1.5em 3.5em;
  border-bottom-style: solid;
  border-bottom-width: 3px;
}
/* --------- */
#subject-contain {
  padding-top: 2em;
  padding-left: 3.5em;
  min-height: 144px;
  height: 144px;
}
#subject-contain h1 {
  line-height: 1.3;
}
/* --------- */
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
#speaker-control {
  margin-top: 1.5em;
}
*.unselectable {
   -moz-user-select: -moz-none;
   -khtml-user-select: none;
   -webkit-user-select: none;
   -ms-user-select: none;
   user-select: none;
}
</style>
