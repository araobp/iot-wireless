let applicationAlreadySelected = false;

// Initialize the devices list and load use case script
function initCanvas(application_name) {

  get('/applications/' + application_name, data => {
    let select = document.getElementById("devices");
    data.devices.forEach(it => {
      select.options[select.options.length] = new Option(it);
    });
    console.log(data.html5);

    // Loading use case script dynamically
    let scriptUseCase = document.createElement('script');
    scriptUseCase.setAttribute("id", "useCase");
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

    applicationAlreadySelected = true;
  });
}

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
      if (applicationAlreadySelected) {
        let date = new Date();
        date.setTime(date.getTime()+5*1000);
        document.cookie = "application_name=" + app.application_name + "; expires=" + date.toGMTString();
        location.reload();
      }
      console.log(app.application_name);

      initCanvas(app.application_name);
    }
  }
});

// Initialize the applications list
get('/applications', data => {
  let select = document.getElementById("applications");
  data.forEach(it => {
    select.options[select.options.length] = new Option(it);
  });

  // Check if the page is reloaded
  let cookie = document.cookie;
  console.log(cookie);
  cookie.split(';').forEach(it => {
    let kv = it.split('=');
    console.log(kv);
    if (kv[0] == "application_name") {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text == kv[1]) {
          select.selectedIndex = i;
          app.application_name = kv[1];
          initCanvas(kv[1]);
          break;
        }
      }
    }
  });
});
