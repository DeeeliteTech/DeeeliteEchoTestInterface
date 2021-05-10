//new code
var actuatorsDictionary = {};
var endPlayTimeoutID = null;

function initGraph(actuatorName) {
    // set the dimensions and margins of the graph
    var margin = {
            top: 10
            , right: 30
            , bottom: 30
            , left: 60
        }
        , width = 600 - margin.left - margin.right
        , height = 200 - margin.top - margin.bottom;
    var svg = d3.select("#" + actuatorName + "_graph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Add X axis --> it is a date format
    var x = d3.scaleLinear().domain([0, 1000]).range([0, width]);
    var xAxis = svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    var yAxis = svg.append("g").call(d3.axisLeft(y));
    // Add the line
    var initDataset = [
        {
            x: 0
            , y: 0
                }
                , {
            x: 100
            , y: 0
                }];
    var line = svg.append("path");
    newGraphElement = {
        svg: svg
        , x: x
        , xAxis: xAxis
        , y: y
        , yAxis: yAxis
        , line: line
        , dataset: initDataset
    }
    actuatorsDictionary[actuatorName + "Graph"] = newGraphElement;
    //updateGrpah(ch_id)
}
//protocol:C
//keep strength: K?F?D?
//ramp strength: R?F?D?
function vibratorAddControl(frequencyInputID, strengthInputID, durationInputID, command, codeInputID) {
    freqVal = document.getElementById(frequencyInputID).value;
    strText = document.getElementById(strengthInputID).value;
    strVal = parseInt(strText)
    if (isNaN(strVal)) return;
    durText = document.getElementById(durationInputID).value;
    durVal = parseInt(durText)
    if (isNaN(durVal)) return;
    //console.log(freqVal, strVal, durVal)
    cmdStr = command + strVal.toString() + "F" + freqVal.toString() + "D" + durVal.toString();
    codeElement = document.getElementById(codeInputID);
    codeElement.value = codeElement.value + cmdStr + " ";
    parseVibratorCode(codeInputID);
}

function parseVibratorCode(codeInputID) {
    var actuatorName = "vibrator";
    dataset = [];
    allCode = document.getElementById(codeInputID).value.trim();
    if (allCode.length == 0) {
        //default off
        dataset = [{
            x: 0
            , y: 0
                }, {
            x: 100
            , y: 0
                }];
    }
    else {
        processedTime = 0;
        accuTime = 0;
        codes = allCode.split(" ");
        prevStrength = 0;
        for (i = 0; i < (codes.length); i++) {
            oneCode = codes[i];
            //console.log(oneCode);
            if (oneCode.length == 0) return;
            if (oneCode[0] == "K" || oneCode[0] == "R") {
                locationOfF = oneCode.indexOf("F");
                locationOfD = oneCode.indexOf("D");
                val_str = oneCode.substring(1, locationOfF);
                dur_str = oneCode.substring(locationOfD + 1);
                strVal = parseInt(val_str)
                durVal = parseInt(dur_str)
                if (isNaN(strVal) || isNaN(durVal) || (durVal < 1)) return;
                if (oneCode[0] == "K") {
                    dataset.push({
                        x: accuTime + 0.1
                        , y: strVal
                    });
                    accuTime += durVal;
                    dataset.push({
                        x: accuTime
                        , y: strVal
                    });
                }
                else if (oneCode[0] == "R") {
                    if (dataset.length == 0) {
                        dataset.push({
                            x: 0
                            , y: 0
                        });
                    }
                    accuTime += durVal;
                    dataset.push({
                        x: accuTime
                        , y: strVal
                    });
                    prevStrength = strVal;
                }
            }
            else {
                return;
            }
            //console.log(oneCode, oneCode[0]);
        }
    }
    actuatorsDictionary[actuatorName + "Dataset"] = dataset;
    updateGrpah(actuatorName);
}

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
    //send vibrator
    var vibratorCodeContent = document.getElementById("vibrator_code").value.trim();
    if (vibratorCodeContent.length > 0) {
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
    nusSendString('N\n');
}

function showVal(slider, textID) {
    var value_txt_div = document.getElementById(textID);
    value_txt_div.innerHTML = slider.value;
}

function updateGrpah(actuatorName) {
    var channelGraph = actuatorsDictionary[actuatorName + "Graph"];
    var dataset = actuatorsDictionary[actuatorName + "Dataset"];
    channelGraph.x.domain([0, d3.max(dataset, function (d) {
        return d.x
    })])
    channelGraph.xAxis.call(d3.axisBottom(channelGraph.x))
    channelGraph.line.datum(dataset).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 1.5).attr("d", d3.line().x(function (d) {
        return channelGraph.x(d.x)
    }).y(function (d) {
        return channelGraph.y(d.y)
    }))
}
//init in the end of this file
