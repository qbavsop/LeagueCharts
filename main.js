//const url = 'http://www.fb-ninja.com/rotoleague/GetStandings?avg=true&LeagueKey=';
const url = 'https://cors-anywhere.herokuapp.com/http://www.fb-ninja.com/rotoleague/GetStandings?avg=true&LeagueKey=375.l.30545';

const colors = [
  { "color": "#FFC107" },
  { "color": "#FF9800" },
  { "color": "#212121" },
  { "color": "#757575" },
  { "color": "#FF5722" },
  { "color": "#8BC34A" },
  { "color": "#CDDC39" },
  { "color": "#00796B" },
  { "color": "#03A9F4" },
  { "color": "#3F51B5" },
  { "color": "#673AB7" },
  { "color": "#E040FB" },
  { "color": "#E91E63" },
  { "color": "#F8BBD0" },
  { "color": "#6aacbf" },
  { "color": "#000000" }
]
let states = [];

/* printChart */

function printChart(dat) {

  const number_of_weeks = [];
  for (let i = 1; i <= dat.charts[1].data.roto.length; i++) {
    number_of_weeks.push("Week " + i);
  }

  // generate Dataset
  function generateDataSet(dataRange = "roto") {
    const number_of_teams = Object.keys(dat.charts).length;
    var dataSet = []
    for (let j = 0; j < number_of_teams; j++) {
      dataSet.push({
        label: dat.charts[j].name,
        data: dat.charts[j].data[dataRange],
        borderColor: colors[j].color,
        fillStyle: colors[j].color,
        backgroundColor: colors[j].color,
        fill: false,
        borderWidth: dat.charts[j].owned ? 2 : 0.75,
        //borderDash: dat.charts[j].owned ? [0,0] : [5,5],
        hidden: states[j]
      })
    };
    return dataSet;
  }

  // generate buttons from data categories fetched from json
  function generateButtons() {
    for (let i = 0; i < Object.keys(dat.charts[0].data).length; i++) {
      let button = document.createElement("button");
      button.setAttribute("id", "c-button_"+i);
      button.classList.add("chart-button", "btn-sm", "btn-selector");
      button.innerHTML = Object.keys(dat.charts[0].data)[i];
      // setting up first button as active
      if (i === 0) {
        button.classList.add("active");
      }
      // setting up button actions
      button.addEventListener("click", function() {
        analyzeState(); // checking current visible state
        myChart.data.datasets = generateDataSet(Object.keys(dat.charts[0].data)[i]); // generate datasets
        myChart.update(); // update chart
        clearState(); // clear buttons states
        this.classList.add("active"); // set active to current
      })
      document.getElementById("myChartNav").appendChild(button);
    }
  }
  generateButtons();

  // saving datasets visible state
  function analyzeState() {
    for (let i = 0; i < Object.keys(dat.charts).length; i++) {
       if (myChart.data.datasets[i]._meta[0].hidden === false) {
        states[i] = null
      } else if (myChart.data.datasets[i]._meta[0].hidden || myChart.data.datasets[i].hidden) {
        states[i] = true
      }
    }
    return states;
  }

  // clear active state from buttons
  function clearState() {
    let buttons = Array.from(document.getElementsByClassName('chart-button'))
    for (const i in buttons) {
      buttons[i].classList.remove("active");
    };
  }

  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: number_of_weeks,
      datasets: generateDataSet(),
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false,
          },
          gridLines: {
            drawOnChartArea: true,
            color: 'rgba(0,0,0,0.03)'
          }
        }],
        xAxes: [{
          gridLines: {
            drawOnChartArea: true,
            color: 'rgba(0,0,0,0.03)'
          }
        }]
      },
      tooltips: {
        mode: 'point',
        titleFontSize: 14,
        titleMarginBottom: 10,
        bodyFontColor: '#ccc',
        bodySpacing: 5,
        yPadding: 10,
        xPadding: 10,
        cornerRadius: 0,
        displayColors: false
      },
      legend: {
        display: true,
        labels: {
          boxWidth: 20,
          lineWidth: 0,
          fontSize: 13,
          padding: 20,
          fontFamily: 'Roboto'
        }
      }
    }
  });
}

window.addEventListener('load', function(){
  var req = new XMLHttpRequest();
  req.overrideMimeType("application/json");
  req.open('GET', url, true);
  req.onload  = function() {
     var dat = JSON.parse(req.responseText);
     printChart(dat);
  };
  req.send(null);
})
