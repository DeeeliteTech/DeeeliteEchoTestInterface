 //Created by Huiyi Chen and Deqing Sun, May 2021


var actuatorsDictionary = {};
var endPlayTimeoutID = null;
var margin = {
    top: 10,
    right: 30,
    bottom: 35,
    left: 40
  },
  width = 700 - margin.left - margin.right,
  height = 340 - margin.top - margin.bottom;

presets = [
  "K0F31D1000 K50F31D1000",
  "K15F31D200 K0F31D100 K40F31D200 K0F31D550", "K0F31D1000 K50F31D1000 R0F31D1000"
]


function selectPreset(){
  let addPointButton = document.getElementById("reset-button");

  addPointButton.addEventListener ('click', function(){
      document.getElementById("vibrator_code").value += " K0F31D100"
      parseVibratorCode("vibrator_code");
  })

  console.log("changing preset")
  let selectedValue = document.getElementById("presetsFromServer").value;
  let currentPresets = presets[selectedValue-1];
  document.getElementById("vibrator_code").value = currentPresets;
  parseVibratorCode("vibrator_code");
  // updateSVG(actuatorsDictionary[actuatorName + "Graph"].svg, currentPresets, actuatorName, maxX * 1.5);
}


function initGraph(actuatorName) {
  let currentGraphSVG = d3.select("#" + actuatorName + "_graph").append("svg");
  let points = [
    [0, 0],
    [1000, 0],
    [1000, 40],
    [2000, 40],
    [2000, 0]
  ];
  // let maxX = Math.max(...points);
  // // console.log(formattedData);
  updateSVG(currentGraphSVG, points, actuatorName, 4000);
  convertDataToVibrationCode(points);
  console.log("initiated graph at: " + points)
}

//this function converts the data point on the graph to string to send to actuator
function convertDataToVibrationCode(dataPoints) {
  let freqVal = document.getElementById('vibrator_freq_input').value;
  let codeResult = "";
  if (dataPoints.length < 2) {
    return codeResult;
  } else {
    let prevTime = dataPoints[0][0];
    let prevStrength = dataPoints[0][1];
    for (let i = 1; i < dataPoints.length; i++) {
      let currentResult = "";
      let currentTime = dataPoints[i][0];
      let currentStrength = dataPoints[i][1];
      let duration = currentTime - prevTime;
      duration = Math.trunc(duration);
      currentStrength = Math.trunc(currentStrength);
      if (prevStrength != currentStrength) {
        if (duration > 0) {
          currentResult += "R";
          let strengthString = currentStrength.toString();
          let durationString = duration.toString();
          currentResult += strengthString;
          currentResult += "F";
          currentResult += freqVal.toString();
          currentResult += "D";
          currentResult += durationString;
          currentResult += " ";
        }
      } else {
        currentResult += "K";
        let strengthString = currentStrength.toString();
        let durationString = duration.toString();
        currentResult += strengthString;
        currentResult += "F";
        currentResult += freqVal.toString();
        currentResult += "D";
        currentResult += durationString;
        currentResult += " ";
      }
      if (currentResult != "") {
        codeResult += currentResult;
      }
      prevTime = currentTime;
      prevStrength = currentStrength;
    }
  }
  //console.log(codeResult);

  //update the codeinput field to reflect changes
  let codeInput = document.getElementById("vibrator_code");
  codeInput.value = codeResult.trim();
  return codeResult;
}


//this function allows the graph to update with draggable events
function updateSVG(svg, dataPoints, actuatorName, domainMax) {
  svg.selectAll('*').remove();
  svg.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let x = d3.scaleLinear()
    .domain([0, domainMax]).rangeRound([0, width]);

  let y = d3.scaleLinear().domain([0, 100])
    .rangeRound([height, 0]);

  let xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);

  let xLabel = svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 30) + ")")
    .style("text-anchor", "middle")
    .style("font", "12px arial")
    .text("Time/Duration(millisecond)");

  let yLabel = svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", margin.left - 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font", "12px arial")
    .text("Intensity");

  let line = d3.line()
    .x(function(d) {
      return x(d[0]);
    })
    .y(function(d) {
      return y(d[1]);
    });

  let drag = d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);


  svg.append('rect')
    .attr('class', 'zoom')
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  let focus = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  let graphLine = focus.append("path")
    .datum(dataPoints)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  let circle = focus.selectAll('circle')
    .data(dataPoints)
    .enter()
    .append('circle')
    .attr('r', 5.0)
    .attr('cx', function(d) {
      return x(d[0]);
    })
    .attr('cy', function(d) {
      return y(d[1]);
    })
    .style('cursor', 'pointer')
    .style('fill', 'steelblue');

  focus.selectAll('circle')
    .on('mouseover', function(d, i) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr('r', 8.0)

    })
    .on('mouseout', function(d, i) {

      d3.select(this)
        .transition()
        .duration(100)
        .attr('r', 5.0)
        .attr('fill', 'steelblue')

    })

    .call(drag);

  d3.select('rect').
  on("dblclick", function(d) {
    console.log("node was double clicked")
    console.log(d3.event.x, d3.event.y)
  })

  focus.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  focus.append('g')
    .attr('class', 'axis axis--y')
    .call(yAxis);



  function dragstarted(d) {
    d3.select(this).raise().classed('active', true);
  }

  function dragged(d) {
    d[0] = x.invert(d3.event.x);
    d[1] = y.invert(d3.event.y);
    let currentX = this.getAttribute("cx");
    let currentY = this.getAttribute("cy");

    if (currentX == 0 && currentY == height) {
      console.log("draggin the initial point is not allowed");
    } else {
      d3.select(this)
        .attr('cx', x(d[0]))
        .attr('cy', y(d[1]))
      convertDataToVibrationCode(dataPoints);
      focus.select('path').attr('d', line);

    }
  }

  function dragended(d) {
    d3.select(this).classed('active', false);
  }


  let newGraphElement = {
    svg: svg,
    x: x,
    xAxis: xAxis,
    y: y,
    yAxis: yAxis,
    line: graphLine,
    circle: circle,
    dataset: dataPoints,
    focus: focus,
    drag: drag
  }

  actuatorsDictionary[actuatorName + "Graph"] = newGraphElement;
}

function setFreq(frequencyInputID,codeInputID){
  let codeElement = document.getElementById(codeInputID);
  let freqVal = document.getElementById(frequencyInputID).value;

}

//reset the graph
function resetGraph(actuatorName) {
  let resetButton = document.createElement('button');
  resetButton.id = "reset-button";
  resetButton.textContent = "Reset to Default";
  resetButton.addEventListener('click', function() {
    actuatorsDictionary[actuatorName + "Graph"].svg.selectAll('*').remove();
    initGraph("vibrator");
  });
  let presets = document.getElementById("presets");
  presets.appendChild(resetButton);
}


function addPoint(actuatorName) {
  // let dataArray= actuatorsDictionary[actuatorName].dataset;
  let addPointButton = document.getElementById("reset-button");

  addPointButton.addEventListener('click', function() {
    document.getElementById("vibrator_code").value += " K0F31D100"
    parseVibratorCode("vibrator_code");
  })

}

window.onload = function() {
  resetGraph("vibrator")
}



// initGraph("vibrator")
//-----------------old code below----------------------------------------


function vibratorAddControl(frequencyInputID, strengthInputID, durationInputID, command, codeInputID) {
  let freqVal = document.getElementById(frequencyInputID).value;
  console.log(freqVal)
  let strText = document.getElementById(strengthInputID).value;
  let strVal = parseInt(strText)
  if (isNaN(strVal)) return;
  let durText = document.getElementById(durationInputID).value;
  let durVal = parseInt(durText)
  if (isNaN(durVal)) return;
  //console.log(freqVal, strVal, durVal)
  let cmdStr = command + strVal.toString() + "F" + freqVal.toString() + "D" + durVal.toString();
  let codeElement = document.getElementById(codeInputID);
  codeElement.value = codeElement.value + cmdStr + " ";
  parseVibratorCode(codeInputID);
}

function parseVibratorCode(codeInputID) {
  let actuatorName = "vibrator"; //TODO: Add arguments for scalable deploy
  let dataset = [];
  let allCode = document.getElementById(codeInputID).value.trim();
  if (allCode.length == 0) {
    //default off
    dataset = [{
      x: 0,
      y: 0
    }, {
      x: 100,
      y: 0
    }];
  } else {
    let processedTime = 0;
    let accuTime = 0;
    let codes = allCode.split(" "); //return an array of code command e.g. ["K100F31D1000", "K0F31D1000"]
    let prevStrength = 0;
    for (let i = 0; i < (codes.length); i++) {
      let oneCode = codes[i]; //loop through each value in the array
      if (oneCode.length == 0) return;
      if (oneCode[0] == "K" || oneCode[0] == "R") {
        let locationOfF = oneCode.indexOf("F");
        let locationOfD = oneCode.indexOf("D");
        let val_str = oneCode.substring(1, locationOfF); //get intensity value
        let dur_str = oneCode.substring(locationOfD + 1); //get duration value
        let strVal = parseInt(val_str) //convert intensity string to int
        let durVal = parseInt(dur_str) //convert duration string to int
        if (isNaN(strVal) || isNaN(durVal) || (durVal < 1)) return;
        if (oneCode[0] == "K") {
          dataset.push({
            x: accuTime,
            y: strVal
          });
          accuTime += durVal;
          dataset.push({
            x: accuTime,
            y: strVal
          });
        } else if (oneCode[0] == "R") {
          if (dataset.length == 0) {
            dataset.push({
              x: 0,
              y: 0
            });
          }
          accuTime += durVal;
          dataset.push({
            x: accuTime,
            y: strVal
          });
          prevStrength = strVal;
        }
      } else {
        return;
      }

    }
  }
  let formattedData = [];
  formattedData.push([0, 0]);
  let xData = [];
  for (let i = 0; i < dataset.length; i++) {
    let point = [];
    let datasetPointX = dataset[i].x;
    let datasetPointY = dataset[i].y;
    xData.push(datasetPointX);
    point.push(datasetPointX, datasetPointY);
    formattedData.push(point);
  }
  let maxX = Math.max(...xData);
  console.log(formattedData);
  actuatorsDictionary[actuatorName + "Dataset"] = dataset;
  //let currentSVG = actuatorsDictionary[actuatorName + "Graph"].svg;
  updateSVG(actuatorsDictionary[actuatorName + "Graph"].svg, formattedData, actuatorName, maxX * 1.5);
  // updateGraph(actuatorName);
}

// function updateGraph(actuatorName) {
//   let channelGraph = actuatorsDictionary[actuatorName + "Graph"];
//   let dataset = actuatorsDictionary[actuatorName + "Dataset"];
//   console.log(dataset);
//
//
//   channelGraph.focus.selectAll("circle")
//           .data(dataset)
//           .enter()
//           .append('circle')
//           .attr('r', 5.0)
//           .attr('cx', function(d) { return channelGraph.x(d.x);  })
//           .attr('cy', function(d) { return channelGraph.y(d.y); })
//           .style('cursor', 'pointer')
//           .style('fill', 'steelblue')
//   channelGraph.focus.selectAll("circle").exit().remove();
//   channelGraph.focus.selectAll("circle").call(channelGraph.drag);
// }


function startActuator() {
  console.log("startActuator");
  var repeat_count = parseInt(document.getElementById("repeat_count").value);
  stopActuator();
  var maxLoopTime = 0;
  var actuatorsDictionaryKeys = Object.keys(actuatorsDictionary)
  for (i = 0; i < actuatorsDictionaryKeys.length; i++) {
    var keyStr = actuatorsDictionaryKeys[i];
    if (keyStr.endsWith("Dataset")) {
      var dataSet = actuatorsDictionary[keyStr];
      if (dataSet.length > 0) {
        var time_total = dataSet[dataSet.length - 1].x * repeat_count;
        if (time_total > maxLoopTime) maxLoopTime = time_total;
      }
    }
  }
  //send actuator control commands
  var actuatorsSendString = "N "; //stop all actuators
  if (document.getElementById("loopSet").checked) {
    actuatorsSendString = actuatorsSendString + "L ";
  }
  //send vibrator
  var vibratorCodeContent = document.getElementById("vibrator_code").value.trim();
  if (vibratorCodeContent.length > 0) {
    actuatorsSendString = actuatorsSendString + "V ";
    for (j = 0; j < repeat_count; j++) {
      actuatorsSendString = actuatorsSendString + vibratorCodeContent + " ";
    }
  }
  //end command
  actuatorsSendString = actuatorsSendString + "\n";
  console.log(actuatorsSendString);
  if (maxLoopTime > 0) {
    endPlayTimeoutID = setTimeout(endOfActuator, maxLoopTime);
  }
  nusSendString(actuatorsSendString);
}

function endOfActuator() {
  console.log("Play ends");
  if (document.getElementById("loopSet").checked) {
    startActuator();
  }
}

function stopActuator() {
  console.log("stopActuator");
  clearTimeout(endPlayTimeoutID);
  nusSendString('N \n');
}

function showVal(slider, textID) {
  var value_txt_div = document.getElementById(textID);
  value_txt_div.innerHTML = slider.value;
}
