<template>
  <div class="row">
    <div class="col-12">
      <table class="table">
        <thead>
          <tr>
            <th>gravatar</th>
            <th>attendee_name</th>
            <th>email</th>
            <th>created_at</th>
            <th>summary</th>
            <th>-</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attendee in unprocessed_attendee">
            <td>
              <img v-bind:src="attendee.gravatar | gravatarSize" alt="">
            </td>
            <td>{{ attendee.attendee_name }}</td>
            <td>{{ attendee.email }}</td>
            <td>{{ attendee.created_at }}</td>
            <td>{{ attendee.summary }}</td>
            <td>-</td>
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
    });
  },
  data() {
    return {
      title: 'Moderate',
      unprocessed_attendee: [],
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

</style>
