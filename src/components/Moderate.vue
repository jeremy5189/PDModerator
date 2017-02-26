<template>
  <div class="row">
    <div class="col-8">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          尚未處理的講者申請
          <span class="badge badge-pill badge-primary">{{ unprocessed_attendee_count }}</span>
        </li>
      </ol>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
            <th>Summary</th>
            <th>Opr</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attendee in unprocessed_attendee">
            <td>
              <img v-bind:title="attendee.email" v-bind:src="attendee.gravatar | gravatarSize" alt="">
            </td>
            <td>{{ attendee.attendee_name }}</td>
            <td>{{ attendee.created_at }}</td>
            <td>{{ attendee.summary }}</td>
            <td>
              <b-button-group>
                <b-button v-on:click="recognizeSpeaker(attendee._id)">+</b-button>
                <b-button v-on:click="removeSpeaker(attendee._id)" variant="danger">-</b-button>
              </b-button-group>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="col-4">

      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          變更主題
        </li>
      </ol>

      <b-form>
        <span class="badge badge-primary">目前主題</span>
        <label>{{ current_subject }}</label>
        <b-form-input v-model="change_to_subject"></b-form-input>
        <div class="right-wrap">
          <b-button v-on:click="changeSubject" type="button" size="sm" class="pull-right" id="change-subject">變更主題</b-button>
        </div>
      </b-form>

      <!-- ========================================= -->
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          已排入 Queue
          <span class="badge badge-pill badge-primary">{{ queue_count }}</span>
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
          <tr v-for="attendee in queue_list">
            <td>
              <img v-bind:title="attendee.email" v-bind:src="attendee.gravatar | gravatarSize" alt="">
            </td>
            <td>{{ attendee.attendee_name }}</td>
            <td>
              <b-button variant="warning" v-on:click="putBack(attendee._id)">
                &lt;-
              </b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
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
      title: 'Moderate',
      unprocessed_attendee: [],
      unprocessed_attendee_count: 0,
      queue_list: [],
      queue_count: 0,
      current_subject: 'Loading...',
      change_to_subject: '',
    };
  },
  filters: {
    gravatarSize(url) {
      return `${url}?s=35`;
    },
  },
  sockets: {
    connect() {
      console.log('socket connected');
    },
    newAttendee(obj) {
      console.log('ws: newAttendee');
      this.unprocessed_attendee.push(obj);
    },
    spoken() {
      this.updateQueue();
    },
  },
  methods: {
    updateSubject() {
      this.$http.get(`${config.api_url}/api/subject`, {}).then((resp) => {
        this.current_subject = resp.body;
      });
    },
    changeSubject() {
      this.$http.post(`${config.api_url}/api/subject`, {
        subject: this.change_to_subject,
      }).then((resp) => {
        if (resp.body.status) {
          console.info('Change subject success');
          this.current_subject = this.change_to_subject;
        } else {
          console.info('Change subject fail');
        }
      }, () => {
        console.error('API error');
      });
    },
    recognizeSpeaker(_id) {
      this.$http.put(`${config.api_url}/api/attendee/${_id}`, {
        recognized: 'true',
      }).then((resp) => {
        if (resp.body.status) {
          // eslint-disable-next-line
          this.unprocessed_attendee = this.unprocessed_attendee.filter((obj) => {
            // eslint-disable-next-line
            return obj._id !== _id;
          });
          this.unprocessed_attendee_count = this.unprocessed_attendee.length;
          this.updateQueue();
        }
      });
    },
    removeSpeaker(_id) {
      this.$http.put(`${config.api_url}/api/attendee/${_id}`, {
        removed: 'true',
      }).then((resp) => {
        if (resp.body.status) {
          // eslint-disable-next-line
          this.unprocessed_attendee = this.unprocessed_attendee.filter((obj) => {
            // eslint-disable-next-line
            return obj._id !== _id;
          });
          this.unprocessed_attendee_count = this.unprocessed_attendee.length;
        }
      });
    },
    putBack(_id) {
      this.$http.put(`${config.api_url}/api/attendee/${_id}`, {
        recognized: 'false',
      }).then((resp) => {
        if (resp.body.status) {
          // eslint-disable-next-line
          this.queue_list = this.queue_list.filter((obj) => {
            // eslint-disable-next-line
            return obj._id !== _id;
          });
          this.queue_count = this.queue_list.length;
          this.updateUnprocessedAttendee();
        }
      });
    },
    updateQueue() {
      this.$http.get(`${config.api_url}/api/queue`).then((response) => {
        this.queue_list = response.body;
        this.queue_count = this.queue_list.length;
      });
    },
    updateUnprocessedAttendee() {
      this.$http.get(`${config.api_url}/api/attendee`).then((response) => {
        this.unprocessed_attendee = response.body;
        this.unprocessed_attendee_count = this.unprocessed_attendee.length;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.breadcrumb {
  margin-top: 1em;
}
#change-subject {
  margin-top: 1em;
}
.right-wrap {
  text-align: right;
}
</style>
