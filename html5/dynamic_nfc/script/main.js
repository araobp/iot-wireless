// Vue component
let app = new Vue({
  el: '#app',
  data: {
    devices: '',
    url: '',
    urlRead: ''
  },
  methods: {
    onDeviceSelected(event) {
      mqtt.unsubscribe("#");
      mqtt.subscribe(app.devices + "/tx");
      console.log(app.devices + "/tx");
    }
  }

});
