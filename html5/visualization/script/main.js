// Initialize the applications list
get('/applications', applications => {
  let select = document.getElementById("applications");
  applications.forEach(it => {
    select.options[select.options.length] = new Option(it);
  });
});

// Vue component
let app = new Vue({
  el: '#app',
  data: {
    title: '',
    application_name: '',
    device_name: '',
    timestamp: '',
    message: '',
    sno: 0  // Serial number
  },
  methods: {
    onApplicationSelected(event) {
      console.log(app.application_name);
      // Initialize the devices list
      get('/applications/' + app.application_name, data => {
        let select = document.getElementById("devices");
        data.devices.forEach(it => {
          select.options[select.options.length] = new Option(it);
        });
        console.log(data.html5);

        // Loading use case script dynamically
        let scriptUseCase = document.createElement('script');
        scriptUseCase.onload = function () {
          console.log('use case script loaded');
        };
        scriptUseCase.src = "./" + data.html5;
        document.body.appendChild(scriptUseCase);

        // Loading rendering script dynamically
        let scriptRendering = document.createElement('script');
        scriptRendering.onload = function () {
          console.log('rendering script loaded');
        };
        scriptRendering.src = "./script/rendering.js";
        document.body.appendChild(scriptRendering);
      });
    }
  }
});

app.title = "Sensor data visualization";
