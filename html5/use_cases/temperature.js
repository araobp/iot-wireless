app.title = "Temperature";

// Create Chart object
let ctx = document.getElementById('Log').getContext('2d');
let chart = new Chart(ctx, {
  type: 'line',

  data: {
    labels: [],
    datasets: [{
      borderColor: 'rgb(255, 99, 132)',
      data: [],
      fill: false,
      pointStyle: 'rect',
      steppedLine: 'after'
    }]
  },

  options: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Room temperature',
      fontSize: 20
    },
    scales: {
      yAxes: [{
				scaleLabel: {
					display: true,
					labelString: "Degrees Celsius"
				},
        ticks: {
          min: -5,
          max: 45,
          stepSize: 5
        }
      }]
    }
  }
});


function updateMessage(data) {
  app.message = data + " degrees Celsius";
}

function updateChart(date_time, data, sno) {

  let temp = parseInt(data);

  chart.data.datasets[0].data.push(temp);
  chart.data.labels.push(date_time.toLocaleTimeString());
  chart.update();

}

// Called when date and time is entered 
function drawChart(doc) {
  //console.log(doc);
  // Update chart
  let data = [];
  let labels = [];
  let localeTime;
  let cnt = 0;
  let buf = {};
  doc.forEach(it => {
    let temp = parseInt(it.data);
    data.push(temp);
    localeTime = parseFloat(it.timestamp) * 1000;
    localeTime = new Date(localeTime).toLocaleTimeString();
    labels.push(localeTime);
  });
  //console.log(data, labels);
  chart.data.datasets[0].data = data;
  chart.data.labels = labels;
  chart.update();
}
