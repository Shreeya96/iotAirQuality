$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    humidityData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'CO2',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 0, 0, 1)",
        pointBoarderColor: "rgba(255, 0, 0, 1)",
        backgroundColor: "rgba(255, 0, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 0, 0, 1)",
        pointHoverBorderColor: "rgba(255, 0, 0, 1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'VOC',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: humidityData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Air Quality Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'CO2',
          display: true
        },
        position: 'left',
      }, {
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'VOC',
            display: true
          },
          position: 'right'
        }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive messages ...' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.temperature) {
        return;
      }
      timeData.push(obj.time);
      temperatureData.push(obj.temperature);
      console.log('tempy data' + obj.temperature);
      // only keep no more than 50 points in the line chart
     //document.getElementById("tempy").innerHTML=;
     if(obj.temperature>=700){
         console.log('baadd');
         //document.getElementById("indicator1").style.display = "block";
         //document.getElementById("indicator1").innerHTML="bad air quality " + obj.temperature + " ppm";
         //document.getElementById("indicator2").style.display = "none";
            document.getElementById("indicator1").className = "alert alert-danger";
            document.getElementById("indicator1").innerHTML="PATIENTS ENVIRONMENT UNSAFE (" + obj.temperature+ " PPM)";
}else {
        console.log('gooodd');
		//document.getElementById("indicator1").style.display = "none";
       //document.getElementById("indicator1").innerHTML="good air quality " + obj.temperature + " ppm";
		//document.getElementById("indicator2").style.display = "block";
        document.getElementById("indicator1").className = "alert alert-success";
	document.getElementById("indicator1").innerHTML="PATIENTS ENVIRONMENT SAFE (" + obj.temperature+ " PPM)";
        }
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
  