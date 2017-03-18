<template>
  <div class="no-use">
    <div class="row">
      <div class="col-10">
        <!-- Data -->
        <div class="row">
          <!-- Forum Name -->
          <div class="col-12" id="title-contain">
            <img class="logo" src="../assets/sitcon.svg" alt="">
            <img class="logo" style="padding-top: 10px;" src="../assets/itri.png" alt="">
          </div>
          <!-- Subject -->
          <div class="col-12" id="subject-contain">
            <h1>
              <b-badge :variant="system.status">目前主題</b-badge> <span class="subject">{{ subject }}</span>
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
            <h3 v-bind:class="{ summary_lg_fontsize: summary_lg_fontsize }">{{ current_speaker.summary }}</h3>
          </div>
        </div>
      </div>
      <!-- Timer -->
      <div class="col-2" id="timer-contain">

        <div class="counter">
          <div class="square" v-bind:class="{ timer_red: timer.red }" v-on:click="timer_click" v-on:contextmenu="timer_right_click">
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
            <p>{{ obj.attendee_name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wcWidth from 'wcwidth'; // Chinese length = 2
import config from '../../common-config.json';

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
        red: false,
      },
      queue: {
        list: [],
        count: 0,
      },
      holder: {
        attendee_name: '主持人',
        gravatar: 'https://www.gravatar.com/avatar/000?s=131',
        summary: '', // Empty for holder
      },
      system: {
        status: 'default', // While loading
      },
      current_speaker: {},
      end_btn_class: 'default', // Normal state
      next_disabled: false, // btn disabled attr
      summary_lg_fontsize: false,
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
    joinSocketRoom() {
      this.$http.get(`${config.api_url}/api/auth`, {}).then((resp) => {
        const roomId = resp.body.room;
        this.$socket.emit('join_room', roomId);
      });
    },
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
        // this.timer.red = false;
      } else if (this.timer.countdown <= 5 && this.timer.countdown > 0) {
        this.timer.red = true;
      }
    },
    timer_reset() {
      this.timer_pause();
      this.timer.red = false;
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
        if (wcWidth(this.current_speaker.summary) <= 58) {
          this.summary_lg_fontsize = true;
        } else {
          this.summary_lg_fontsize = false;
        }
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
      this.joinSocketRoom();
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
  computed: {
    limitQueue() {
      return this.queue.list.slice(0, 6);
    },
  },
};
</script>

<!-- Add "scoped " attribute to limit CSS to this component only -->
<style scoped>
body {
  overflow: hidden;
}
.btn {
  cursor: pointer;
}
/* Right hand site circle control */
.square {
  background-color: lightgray;
  height: 20vh;
  width: 20vh;
  border-radius: 50%;
  display: table;
  margin: 0 auto;
  cursor: pointer;
}
.square-count {
  display: table-cell;
  vertical-align: middle;
  font-size: 5em;
}
.counter {
  margin-top: 2.8em;
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
  font-size: 3.2em;
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
  margin-top: 3vh;
  padding-bottom: 0.5em;
}
.queue-user div div {
  width: 8.7vh;
  height: 8.7vh;
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
  font-size: 3em;
  margin: 0.4em 2vh 0 2vh;
  line-height: 1;
  word-wrap: break-word;
}
/* --------- */
#username-contain {
  padding: 4em 2em 2.5em 0em;
}
#username-contain h2 {
  font-size: 5em;
}
/* --------- */
#summary-contain {
  padding: 0 1em 1em 3.5em;
  min-height: 30vh;
}
#summary-contain h3 {
  font-size: 3em;
  line-height: 1.4;
  word-wrap: break-word;
}
/* --------- */
#gravatar-contain {
  padding: 1.5em 0em 2em 5.3em;
}
#gravatar-contain div {
  width: 15vh;
  height: 15vh;
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
  padding-left: 3em;
  min-height: 12vh;
}
#subject-contain .subject {
  margin-top: 0.1em;
  margin-left: 0.3em;
  font-size: 1em;
}
#subject-contain h1 {
  line-height: 1.2;
  font-size: 3em;
}
/* --------- */
.logo {
  height: 7vh;
  margin-right: 65px;
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
  min-height: 20vh;
  margin-top: 1.5vh;
}
#speaker-control {
  margin-top: 2.5em;
}
*.unselectable {
   -moz-user-select: -moz-none;
   -khtml-user-select: none;
   -webkit-user-select: none;
   -ms-user-select: none;
   user-select: none;
}
/* The animation code */
@keyframes color_change {
    from {
      background-color: rgba(245, 49, 44, 0.9);
    }
    to {
      background-color: lightgray;
    }
}
.timer_red {
  background-color: rgba(245, 49, 44, 0.8);
  color: white;
  /*animation-name: color_change;
	animation-duration: 1s;
	animation-iteration-count: infinite;
	animation-direction: normal;*/
}

.summary_lg_fontsize {
  font-size: 4.87em !important;
}
</style>
