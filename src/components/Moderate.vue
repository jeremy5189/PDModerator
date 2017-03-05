<template>
  <div class="row">
    <div class="col-8">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          尚未處理的講者申請
          <span class="badge badge-pill badge-primary">{{ unprocessedAttendee.length }}</span>
        </li>
      </ol>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
            <th id="summary-th">Summary</th>
            <th>Opr</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attendee in unprocessedAttendee">
            <td>
              <div v-bind:title="attendee.email" v-bind:style="{ backgroundImage: 'url(' + gravatarSize(attendee.gravatar) + ')' }" alt="" class="avatar">
            </td>
            <td>{{ attendee.attendee_name }}</td>
            <td v-bind:title="attendee.created_at | unix2human">{{ attendee.created_at | unix2time }}</td>
            <td>{{ attendee.summary }}</td>
            <td>
              <b-button-group>
                <b-button v-on:click="removeSpeaker(attendee._id)" variant="danger">✖</b-button>
                <b-button v-on:click="recognizeSpeaker(attendee._id)">➡</b-button>
              </b-button-group>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="col-4">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          系統訊息 <b-badge :variant="system.status">{{ system.message }}</b-badge>
        </li>
      </ol>
      <textarea id="system_message" class="form-control" readonly>{{ system.display_message }}</textarea>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          變更主題
        </li>
      </ol>
      <b-form v-on:submit="changeSubjectForm(this)">
        <span class="badge badge-primary">目前主題</span>
        <label>{{ current_subject }}</label>
        <b-form-input v-model="change_to_subject"></b-form-input>
        <div class="right-wrap">
          <b-button v-on:click="changeSubject" type="button" size="sm" class="pull-right" id="change-subject">變更主題</b-button>
        </div>
      </b-form>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          已排入 Queue
          <span class="badge badge-pill badge-primary">{{ queueAttendee.length }}</span>
        </li>
      </ol>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Put back</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attendee in queueAttendee" v-bind:title="attendee.summary">
            <td>
              <div v-bind:title="attendee.email" v-bind:style="{ backgroundImage: 'url(' + gravatarSize(attendee.gravatar) + ')' }" alt="" class="avatar">
            </td>
            <td>{{ attendee.attendee_name }}</td>
            <td>
              <b-button variant="warning" v-on:click="putBack(attendee._id)">
                ⇦
              </b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Moment from 'moment';
import config from '../../common-config.json';

export default {
  name: 'moderate',
  created() {
    this.updateUnprocessedAttendee();
    this.updateQueue();
    this.updateSubject();
  },
  data() {
    return {
      unprocessedAttendee: [],
      queueAttendee: [],
      current_subject: 'Loading...',
      change_to_subject: '',
      system: {
        status: 'default',
        message: 'WS loading...',
        display_message: '<PDModerator Output>',
      },
    };
  },
  sockets: {
    // Default event
    connect() {
      this.system.message = 'WS connect';
      this.system.status = 'success';
    },
    error() {
      this.system.message = 'WS error';
      this.system.status = 'danger';
    },
    disconnect() {
      this.system.message = 'WS disconnect';
      this.system.status = 'danger';
    },
    connecting() {
      this.system.message = 'WS connecting';
      this.system.status = 'warning';
    },
    reconnecting() {
      this.system.message = 'WS reconnecting';
      this.system.status = 'warning';
    },
    // User event
    newAttendee() {
      this.appendDispMsg('ws: newAttendee');
      if (config.direct_to_queue) {
        this.updateQueue();
      } else {
        this.updateUnprocessedAttendee();
      }
    },
    spoken() {
      // Listen event from Queue page
      this.appendDispMsg('ws: spoken (Queue)');
      this.updateQueue();
    },
    recognized() {
      // Listen event from another Moderate page
      this.appendDispMsg('ws: recognized (or put back)');
      this.updateUnprocessedAttendee();
      this.updateQueue();
    },
    removed() {
      // Listen event from another Moderate page
      this.appendDispMsg('ws: removed');
      this.updateUnprocessedAttendee();
    },
    subjectChange(val) {
      // Listen event from another Moderate page
      this.appendDispMsg('ws: subjectChange');
      this.current_subject = val;
    },
  },
  filters: {
    unix2time(unix) {
      return Moment.unix(unix).format('HH:mm:ss');
    },
    unix2human(unix) {
      return Moment.unix(unix).format('Y:MM:DD HH:mm:ss');
    },
  },
  methods: {
    appendDispMsg(msg) {
      const time = Moment().format('HH:mm:ss');
      this.system.display_message += `\n${time}: ${msg}`;
      const textarea = document.getElementById('system_message');
      textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
    },
    vueResErrorHandler(resp) {
      if (resp.statusText === '') {
        this.appendDispMsg(`AJAX: Error, ok: ${resp.ok}, status: ${resp.status}`);
      } else {
        this.appendDispMsg(resp.statusText);
      }
    },
    gravatarSize(url) {
      return `${url}?s=35`;
    },
    changeSubjectForm(event) {
      event.preventDefault();
    },
    updateSubject() {
      this.$http.get(`${config.api_url}/public/subject`, {}).then((resp) => {
        this.current_subject = resp.body;
      });
    },
    changeSubject() {
      this.$http.post(`${config.api_url}/api/subject`, {
        subject: this.change_to_subject,
      }).then((resp) => {
        if (resp.body.status) {
          this.current_subject = this.change_to_subject;
        } else {
          this.appendDispMsg('DB insert failed');
        }
      }, (resp) => {
        this.vueResErrorHandler(resp);
      });
    },
    recognizeSpeaker(_id) {
      this.$http.put(`${config.api_url}/api/attendee/${_id}`, {
        recognized: 'true',
      }).then((resp) => {
        if (resp.body.status) {
          // eslint-disable-next-line
          this.unprocessedAttendee = this.unprocessedAttendee.filter((obj) => {
            // eslint-disable-next-line
            return obj._id !== _id;
          });
          this.updateQueue();
        } else {
          this.appendDispMsg('DB insert failed');
        }
      }, (resp) => {
        this.vueResErrorHandler(resp);
      });
    },
    removeSpeaker(_id) {
      this.$http.put(`${config.api_url}/api/attendee/${_id}`, {
        removed: 'true',
      }).then((resp) => {
        if (resp.body.status) {
          // eslint-disable-next-line
          this.unprocessedAttendee = this.unprocessedAttendee.filter((obj) => {
            // eslint-disable-next-line
            return obj._id !== _id;
          });
        } else {
          this.appendDispMsg('DB insert failed');
        }
      }, (resp) => {
        this.vueResErrorHandler(resp);
      });
    },
    putBack(_id) {
      this.$http.put(`${config.api_url}/api/attendee/${_id}`, {
        recognized: 'false',
      }).then((resp) => {
        if (resp.body.status) {
          // eslint-disable-next-line
          this.queueAttendee = this.queueAttendee.filter((obj) => {
            // eslint-disable-next-line
            return obj._id !== _id;
          });
          this.updateUnprocessedAttendee();
        } else {
          this.appendDispMsg('DB insert failed');
        }
      }, (resp) => {
        this.vueResErrorHandler(resp);
      });
    },
    updateQueue() {
      this.$http.get(`${config.api_url}/public/queue`).then((response) => {
        this.queueAttendee = response.body;
      }, (resp) => {
        this.vueResErrorHandler(resp);
      });
    },
    updateUnprocessedAttendee() {
      this.$http.get(`${config.api_url}/api/attendee`).then((response) => {
        this.unprocessedAttendee = response.body;
      }, (resp) => {
        this.vueResErrorHandler(resp);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.avatar {
  width: 35px;
  height: 35px;
}
.breadcrumb {
  margin-top: 1em;
}
#change-subject {
  margin-top: 1em;
}
.right-wrap {
  text-align: right;
}
#system_message {
  background-color: white;
  font-size: 10px;
  height: 80px;
}
#summary-th {
  width: 326px;
  max-width: 326px;
}
.btn {
  cursor: pointer;
  font-weight: bold;
}
</style>
