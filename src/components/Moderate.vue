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
                <b-button>+</b-button>
                <b-button variant="default">-</b-button>
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
        <b-form-input></b-form-input>
        <div class="right-wrap">
          <b-button size="sm" class="pull-right" id="change-subject">變更主題</b-button>
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
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attendee in queue_list">
            <td>
              <img v-bind:title="attendee.email" v-bind:src="attendee.gravatar | gravatarSize" alt="">
            </td>
            <td>{{ attendee.attendee_name }}</td>
            <td>
              <b-button variant="danger">
                -
              </b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'moderate',
  created() {
    this.$http.get('http://localhost:3000/api/attendee').then((response) => {
      this.unprocessed_attendee = response.body;
      this.unprocessed_attendee_count = this.unprocessed_attendee.length;
    });
    this.$http.get('http://localhost:3000/api/queue').then((response) => {
      this.queue_list = response.body;
      this.queue_count = this.queue_list.length;
    });
  },
  data() {
    return {
      title: 'Moderate',
      unprocessed_attendee: [],
      unprocessed_attendee_count: 0,
      queue_list: [],
      queue_count: 0,
      current_subject: 'Loading...',
    };
  },
  filters: {
    gravatarSize(url) {
      return url.replace('s=150', 's=35');
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
