app.title = "My home";

const classLabels = {
  0: "chatting",
  1: "reading a book",
  2: "watching TV",
  3: "cocking",
  4: "hamster grinding teeth",
  5: "silence",
  6: "vacuum cleaner",
  7: "showering",
  8: "washing machine",
  9: "doing the dishes",
  10: "walking the room",
  11: "playing the piano",
  12: "going up or down the stairs",
  13: "eating snack"
}

// Class labels
const numClasses = Object.keys(classLabels).length
const classLabelsName = Object.values(classLabels).reverse();

// Chirt
const NUM_RECORDS = 20;
const INTERVAL = 10;

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
      text: 'Acoustic Scene Classification',
      fontSize: 20
    },
    scales: {
      yAxes: [{
        ticks: {
          callback: function(value, index, values) {
            return classLabelsName[index] + '(' + value + ')';
          },
          min: 0,
          max: numClasses - 1,
          stepSize: 1
        }
      }]
    }
  }
});

// Find the most frequent class
function mostFrequent(buf) {
  let win = -1;
  // Frequency of appearance
  Object.keys(buf).forEach(key => {
    if (win == -1) {
      win = key;
    } else if (buf[key] > buf[win]) {
      win = key;
    }
  });
  //console.log(buf);
  return win;
}

// FIFO buffer for logging
let reached = false;

// Buffer for taking an frequency of appearance
let buf = {};

function updateMessage(data) {
  let classLabelInt = parseInt(data);
  let name = classLabels[classLabelInt];
  app.message = name + "(" + data + ")";
}

function updateChart(date_time, data, sno) {

  let classLabelInt = parseInt(data);

  // Buffering
  if (classLabelInt in buf) {
    buf[classLabelInt]++;
  } else {
    buf[classLabelInt] = 1;
  }
  if ((sno % INTERVAL) == 0) {
    let win = mostFrequent(buf);
    buf = {};

    // Put in FIFO buffer and update Chart
    chart.data.datasets[0].data.push(win);
    chart.data.labels.push(date_time.toLocaleTimeString());
    if (!reached && chart.data.datasets[0].data.length > NUM_RECORDS) {
      reached = true;
    }
    else if (reached) {
      chart.data.datasets[0].data.shift();
      chart.data.labels.shift();
    }
    chart.update();
  }

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
    let classLabelInt = parseInt(it.data);
    if (classLabelInt in buf) {
      buf[classLabelInt]++;
    } else {
      buf[classLabelInt] = 1;
    }
    if ((++cnt % INTERVAL) == 0) {
      let win = mostFrequent(buf);
      data.push(win);
      localeTime = parseFloat(it.timestamp) * 1000;
      localeTime = new Date(localeTime).toLocaleTimeString();
      labels.push(localeTime);
      buf = {};
    }
  })
  //console.log(data, labels);
  chart.data.datasets[0].data = data;
  chart.data.labels = labels;
  chart.update();
}
