<template>
  <div class="container-fluid" id="app">

    <nav class="navbar navbar-toggleable-md navbar-light bg-faded">

      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <a class="navbar-brand" href="#">PDModerator</a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="/#/">
              Attendee
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/#/Moderate">
              Moderate
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/#/Queue">
              Queue
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: [

  ],
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding-right: 0;
  padding-left: 0; 
}
</style>
