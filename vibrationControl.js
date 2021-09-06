//Created by Huiyi Chen and Deqing Sun, May 2021
//Updated by Rui An:

let actuatorsDictionary = {};
let endPlayTimeoutID = null;

let width = 0;
let height = 0;
let scaleAccumulator = 1.0;

let margin = {
        top: 80,
        right: 20,
        bottom: 40,
        left: 40
    },
    presets = [
        "K0F31D1000 K50F31D1000 ",
        "K15F31D200 K0F31D100 K40F31D200 K0F31D550 ",
        "R7F31D628 R40F31D1142 R24F31D552 R30F31D1028 R7F31D571 K7F31D590 R0F31D742 R26F31D666 R46F31D838 R30F31D1161 R8F31D685 R0F31D1161 ",
        "R11F31D414 R20F31D414 R54F31D628 R22F31D585 R39F31D485 R30F31D371 R17F31D557 R4F31D300 R20F31D428 R24F31D442 R16F31D842 R1F31D1342 ",
        "R20F31D1000 K20F31D1000 R0F31D1000 K0F31D1000 R40F31D1000 K40F31D1000 R0F31D1000 K0F31D415 ",
        "K30F58D200 K0F58D100 K65F58D200 K0F58D500 ",
        "R0F58D121 K0F58D71 R8F58D17 R5F58D32 R65F58D49 K65F58D51 R3F58D67 R8F58D67 R18F58D37 R19F58D32 R0F58D70 K0F58D374 ",
        "K0F50D3 R73F50D90 R72F50D89 R0F50D31 K0F50D113 R90F50D82 R91F50D117 R0F50D74 K0F50D389 ",
        "R57F48D167 R20F48D109 K20F48D143 R89F48D113 R0F48D94 K0F48D369 ",
        "R44F48D46 R55F48D23 R64F48D21 R70F48D30 R69F48D37 R58F48D34 R48F48D5 R38F48D3 R25F48D10 R18F48D5 R14F48D36 R13F48D36 R17F48D25 R22F48D38 R41F48D9 R51F48D10 R59F48D10 R68F48D12 R76F48D25 R81F48D28 R82F48D32 R81F48D34 R73F48D34 R63F48D19 R52F48D19 R37F48D14 R19F48D14 R14F48D16 R9F48D27 R7F48D32 R0F48D308 ",
        "R1F58D351 R34F58D11 R46F58D7 R54F58D18 R57F58D40 R55F58D40 R50F58D24 R36F58D16 R29F58D44 R35F58D29 R38F58D52 R32F58D50 R4F58D27 R48F58D22 R70F58D24 R75F58D9 R79F58D7 R83F58D19 R84F58D26 R83F58D19 R77F58D16 R73F58D4 R65F58D4 R56F58D6 R27F58D9 R22F58D32 R15F58D56 R0F58D42 ",
        "R11F50D9 R41F50D26 R53F50D5 R61F50D16 R64F50D37 K64F50D47 R58F50D18 R45F50D23 R11F50D15 R13F50D25 R16F50D49 R12F50D52 R3F50D20 R47F50D21 R69F50D22 R74F50D8 R78F50D5 R82F50D17 R83F50D24 R82F50D59 R76F50D15 R72F50D3 R64F50D3 R55F50D5 R0F50D11 R34F50D163 R0F50D5 K0F50D286 ",
        "R11F60D11 R37F60D30 R49F60D7 R57F60D20 R60F60D45 K60F60D57 R54F60D22 R41F60D28 R11F60D18 R13F60D30 R16F60D59 R12F60D62 R3F60D24 R47F60D25 R69F60D27 R74F60D10 R78F60D7 R82F60D21 R83F60D29 R81F60D75 R75F60D18 R71F60D4 R63F60D4 R54F60D6 R0F60D9 R34F60D195 R0F60D7 K0F60D341 ",
        "R11F60D11 R37F60D30 R49F60D7 R57F60D20 R60F60D45 K60F60D57 R54F60D22 R41F60D28 R11F60D18 R13F60D30 R16F60D59 R12F60D62 R3F60D24 R47F60D25 R69F60D27 R74F60D10 R78F60D7 R82F60D21 R85F60D35 R81F60D92 R75F60D18 R71F60D4 R63F60D4 R54F60D6 R0F60D9 R34F60D170 R0F60D7 K0F60D523 ",
        "R11F60D11 R37F60D30 R49F60D7 R57F60D20 R60F60D45 K60F60D57 R54F60D22 R41F60D28 R11F60D18 R13F60D30 R16F60D59 R12F60D62 R3F60D24 R47F60D25 R69F60D27 R74F60D10 R78F60D7 R82F60D21 R86F60D59 R82F60D77 R75F60D44 R71F60D4 R63F60D4 R54F60D6 R0F60D9 R34F60D140 R0F60D7 K0F60D652 "
    ]
width = 700 - margin.left - margin.right;
height = 400 - margin.top - margin.bottom;
// console.log(width);
// console.log(height);

let selectedPoint = null;
let selectedPointData = null;

let selectedPoints = [];
let currentSVG = null;
let running = false;
let currentDataPoints = [];
let currentactuatorName =  "vibrator";

let currentMaxX = 2500;


function selectPreset() {
    // let addPointButton = document.getElementById("reset-button");
    // addPointButton.addEventListener('click', function() {
    //   document.getElementById("vibrator_code").value += " K0F31D100"
    //   parseVibratorCode("vibrator_code");
    // })

    console.log("changing preset")
    let selectedValue = document.getElementById("presets-menu").value;
    let currentPresets = presets[selectedValue - 1];
    document.getElementById("vibrator_code").value = currentPresets;
    parseVibratorCode("vibrator_code");
    startActuator();
    // updateSVG(actuatorsDictionary[actuatorName + "Graph"].svg, currentPresets, actuatorName, maxX * 1.5);
}

function initGraph(actuatorName) {
    let currentGraphSVG = d3.select("#" + actuatorName + "_graph").append("svg");
    let points = [
        [0, 0],
        [1000, 0],
        [1000, 50],
        [2000, 50],
        [2000, 0]
    ];
    let maxX = Math.max(...points);
    // console.log(formattedData);
    updateSVG(currentGraphSVG, points, actuatorName, 2500);
    convertDataToVibrationCode(points);

}

//this function converts the data point on the graph to string to send to actuator
function convertDataToVibrationCode(dataPoints) {
    let freqVal = document.getElementById('vibrator_freq_val').innerHTML;
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
            // console.log(currentTime);
            // console.log(currentStrength);
            // console.log("-------");

            let duration = (currentTime - prevTime);
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
                codeResult += currentResult
            }
            prevTime = currentTime;
            prevStrength = currentStrength;
        }

    }


    //update the codeinput field to reflect changes
    let codeInput = document.getElementById("vibrator_code");
    codeInput.value = codeResult.trim() + " ";

    return codeResult;
    update();
}

//this function allows the graph to update with draggable events
function updateSVG(svg, dataPoints, actuatorName, domainMax) {

    currentDataPoints = dataPoints;
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
        yAxis = d3.axisLeft(y).ticks(5);


    let xLabel = svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .style("font", "12px roboto,sans-serif")
        .style("fill", "#D4D4D4")
        .text("Duration");

    let yLabel = svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left - 25)
        .attr("x", 0 - (height / 2) - margin.top)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font", "12px roboto,sans-serif")
        .style("fill", "#D4D4D4")
        .text("Intensity");

    let line = d3.line()
        .x(function (d) {
            return x(d[0]);
        })
        .y(function (d) {
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
        .on("dblclick", function () {
            let coords = d3.mouse(this);
            // Normally we go from data to pixels, but here we're doing pixels to data
            // console.log(coords);
            // console.log(x.invert(coords[0]));
            // console.log(y.invert(coords[1]));
            let newData = {
                x: Math.round(x.invert(coords[0])),  // Takes the pixel number to convert to number
                y: Math.round(y.invert(coords[1]))
            };
            newData = [newData.x, newData.y];
            currentDataPoints.push(newData);   // Push data to our array
            currentDataPoints.sort((a, b) => {
                return a[0] - b[0];
            })
            //UPdate domaim max
            updateSVG(svg, currentDataPoints, actuatorName, domainMax);
            convertDataToVibrationCode(currentDataPoints);
            startActuator();
        })
        .on("mousedown", function () {
            // Clear the previous selections
            let circleElements = circle.nodes();
            circleElements.forEach(
                (circleElement) => {
                    d3.select(circleElement)
                        .attr('r', 5.0)
                        .style('fill', '#ff9500')
                        .style('stroke-width', '0')
                        .style('stroke', "#fff");
                }
            );

            let subject = d3.select(window), parent = this.parentNode,
                start = d3.mouse(parent);
            startSelection(start);
            let startCoords = d3.mouse(this);
            let newData = {
                x: Math.round(x.invert(startCoords[0])),  // Takes the pixel number to convert to number
                y: Math.round(y.invert(startCoords[1]))
            };
            startCoords = [newData.x, newData.y];
            let currentRect = this;

            subject
                .on("mousemove.selection", function () {
                    moveSelection(start, d3.mouse(parent), startCoords, d3.mouse(currentRect));
                }).on("mouseup.selection", function () {
                endSelection(start, d3.mouse(parent));
                subject.on("mousemove.selection", null).on("mouseup.selection", null);
            });

        })
        .on("touchstart", function () {
            let subject = d3.select(this), parent = this.parentNode,
                id = d3.event.changedTouches[0].identifier,
                start = d3.touch(parent, id), pos;
            startSelection(start);
            subject
                .on("touchmove." + id, function () {
                    if (pos = d3.touch(parent, id)) {
                        moveSelection(start, pos);
                    }
                }).on("touchend." + id, function () {
                if (pos = d3.touch(parent, id)) {
                    endSelection(start, pos);
                    subject.on("touchmove." + id, null).on("touchend." + id, null);
                }
            });
        });


    let focus = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //datapoints
    let graphLine = focus.append("path")
        .datum(currentDataPoints)
        .attr("fill", "none")
        .attr("stroke", "#ff9500")

        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2.5)
        .attr("d", line);


    //datapoints
    let circle = focus.selectAll('circle')
        .data(currentDataPoints)
        .enter()
        .append('circle')
        .attr('r', 5.0)
        .attr('cx', function (d) {
            return x(d[0]);
        })
        .attr('cy', function (d) {
            return y(d[1]);
        })
        .style('cursor', 'pointer')

        //.attr("fill", d => d === selectedPoint ? "lightblue" : "#000000")
        .style('fill', '#ff9500');

    focus.selectAll('circle')
        .on('mouseover', function (d, i) {
            d3.select(this)
                .transition()
                .duration(100)
                .attr('r', 8.0)

        })
        .on('mouseout', function (d, i) {

            d3.select(this)
                .transition()
                .duration(100)
                .attr('r', 5.0)
                .attr('fill', '#ffbf1c')

        })
        .on("keydown", keydown)
        .call(drag);

    function updateChart() {
        console.log("drag");
    }


    focus.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis.ticks(5))
        .call(xAxis.tickFormat(function (d) {
            return d / 1000 + 's'
        }));

    let tickLabels = ['0', '', '', '', '', 'max'];
    // xAxisGenerator.tickFormat((d,i) => tickLabels[i]);
    focus.append('g')
        .attr('class', 'axis axis--y')
        .call(yAxis.tickFormat((d, i) => tickLabels[i]));


    function dragstarted(d) {
        if (this !== selectedPoint) {
            d3.select(selectedPoint).style('fill', '#ff9500')
                .style('stroke-width', '0')
        }
        selectedPoint = this;
        selectedPointData = d;


        d3.select(this)
            .attr('r', 8.0)
            .style('stroke-width', '3')
            .style('stroke', "#fff");

        d3.select(this).raise().classed('active', true);

    }

    d3.select('body').on("keydown", keydown);

    function keydown() {
        console.log("keydown")
        let tagName = d3.select(d3.event.target).node().tagName;
        console.log(tagName);
        if (!selectedPointData) return;
        switch (d3.event.keyCode) {
            case 68: {
                event.preventDefault();
                const i = dataPoints.indexOf(selectedPointData);
                dataPoints.splice(i, 1);
                currentDataPoints = dataPoints;
                updateSVG(svg, currentDataPoints, actuatorName, domainMax);
                convertDataToVibrationCode(currentDataPoints);
                break;
            }
        }
    }

    function insideRect(point) {
        let x = point[0];
        let y = point[1];
        if (x <= domainMax && x >= 0 && y <= 100 && y >= 0) {
            return true;
        }
        return false;
    }

    function dragged(d) {
        let dataDelta = [x.invert(d3.event.x) - d[0], y.invert(d3.event.y) - d[1]];
        let circleElements = circle.nodes();
        let newX = x.invert(d3.event.x);
        let newY = y.invert(d3.event.y);
        if (!insideRect([newX, newY])) {
            return;
        }
        d[0] = x.invert(d3.event.x);
        d[1] = y.invert(d3.event.y);
        let currentX = parseInt(this.getAttribute("cx"));
        let currentY = parseInt(this.getAttribute("cy"));
        if (currentX === 0 && currentY === height) {
            console.log("draggin the initial point is not allowed");
        } else {
            if (selectedPoints.includes(this)) {
                let originPointData = [currentX, currentY];
                // console.log(originPointData);
                let delta = [x(d[0]) - originPointData[0], y(d[1]) - originPointData[1]];
                selectedPoints.forEach(
                    (point) => {
                        if (point !== this) {
                            d3.select(point).raise().classed('active', true);
                            let currentIndex = circleElements.indexOf(point);
                            let pointX = currentDataPoints[currentIndex][0] + dataDelta[0];
                            let pointY = currentDataPoints[currentIndex][1] + dataDelta[1];
                            if (!insideRect([pointX, pointY])) {
                                return;
                            }
                            currentDataPoints[currentIndex][0] += dataDelta[0];
                            currentDataPoints[currentIndex][1] += dataDelta[1];
                            d3.select(point)
                                .attr('cx', x(currentDataPoints[currentIndex][0]))
                                .attr('cy', y(currentDataPoints[currentIndex][1]));
                        }
                    }
                );
            }
            else {
                selectedPoints.forEach(
                    (point) => {
                        d3.select(point)
                            .attr('r', 5.0)
                            .style('fill', '#ff9500')
                            .style('stroke-width', '0')
                            .style('stroke', "#fff");
                    }
                );
            }
            d3.select(this)
                .attr('cx', x(d[0]))
                .attr('cy', y(d[1]));
            // currentDataPoints = dataPoints;
            // currentDataPoints.sort((a, b) => {
            //     return a[0] - b[0];
            // })
            convertDataToVibrationCode(currentDataPoints);
            focus.select('path').attr('d', line);
        }
    }

    function dragended(d) {
        selectedPoints.forEach(
            (point) => {
                d3.select(point)
                    .attr('r', 5.0)
                    .style('fill', '#ff9500')
                    .style('stroke-width', '0')
                    .style('stroke', "#fff");
            }
        );
        selectedPoints.length = 0;
        d3.select(this).classed('active', false);
        d3.select(this)
            .attr('r', 5.0)
            .style('fill', '#ff9500')
            .style('stroke-width', '0')
            .style('stroke', "#fff");
        console.log("drag ended")
        currentDataPoints.sort((a, b) => {
            return a[0] - b[0];
        })
        convertDataToVibrationCode(currentDataPoints);
        updateSVG(svg, currentDataPoints, actuatorName, domainMax);
        startActuator();
    }

    function rect(x, y, w, h) {
        return "M" + [x, y] + " l" + [w, 0] + " l" + [0, h] + " l" + [-w, 0] + "z";
    }


    let selection = svg.append("path")
        .attr("class", "selection")
        .attr("visibility", "hidden");

    let startSelection = function (start) {
        selection.attr("d", rect(start[0], start[0], 0, 0))
            .attr("visibility", "visible")
            .attr("fill", "none")
            .attr("stroke", "#ff9500");
    };

    let moveSelection = function (start, moved, rectStart, rectCurrent) {
        let xDiff = moved[0] - start[0];
        let yDiff = moved[1] - start[1];
        selection.attr("d", rect(start[0], start[1], moved[0] - start[0], moved[1] - start[1]));


        let rectEnd = {
            x: Math.round(x.invert(rectCurrent[0])),  // Takes the pixel number to convert to number
            y: Math.round(y.invert(rectCurrent[1]))
        };
        rectEnd = [rectEnd.x, rectEnd.y];
        let circleElements = circle.nodes();

        // for (let i=0; i<circleElements.length; i++) {
        //     let coord = circleElements[i].__data__;
        // }

        selectedPoints.length = 0;
        let xBoundaryRight = Math.max(rectEnd[0], rectStart[0]);
        let xBoundaryLeft = Math.min(rectEnd[0], rectStart[0]);
        let yBoundaryTop = Math.max(rectEnd[1], rectStart[1]);
        let yBoundaryBottom = Math.min(rectEnd[1], rectStart[1]);
        for (let i = 0; i < currentDataPoints.length; i++) {
            let currentX = currentDataPoints[i][0];
            let currentY = currentDataPoints[i][1];
            if (currentX <= xBoundaryRight && currentX >= xBoundaryLeft) {
                if (currentY <= yBoundaryTop && currentY >= yBoundaryBottom) {
                    d3.select(circleElements[i])
                        .attr('r', 8.0)
                        .style('stroke-width', '3')
                        .style('stroke', "#fff");
                    selectedPoints.push(circleElements[i]);
                }
            }
        }


        // console.log(Math.round( x.invert(start[0])));
        // console.log(Math.round( y.invert(start[1])));
        // console.log(Math.round( x.invert(moved[0])));
        // console.log(Math.round( y.invert(moved[1])));
        // console.log("-------------------------------------");
        // console.log(start[0]);
        // console.log(start[1]);
        // console.log(moved[0]);
        // console.log(moved[1]);
        // console.log("-------------------------------------");
    };

    let endSelection = function (start, end) {
        selection.attr("visibility", "hidden");
    };

    let newGraphElement = {
        svg: svg,
        x: x,
        xAxis: xAxis,
        y: y,
        yAxis: yAxis,
        line: graphLine,
        circle: circle,
        dataset: currentDataPoints,
        focus: focus,
        drag: drag
    }

    actuatorsDictionary[actuatorName + "Graph"] = newGraphElement;
    currentSVG = svg;
}

function setFreq(frequencyInputID, codeInputID) {
    let codeElement = document.getElementById(codeInputID);
    let freqVal = document.getElementById(frequencyInputID).value;
    console.log(freqVal);
}

//reset the graph
function resetGraph(actuatorName) {
    let resetButton = document.createElement('button');
    resetButton.id = "reset-btn";
    resetButton.textContent = "Reset";
    resetButton.addEventListener('click', function () {
        actuatorsDictionary[actuatorName + "Graph"].svg.selectAll('*').remove();
        initGraph("vibrator");
    });
    let presets = document.getElementById("user-ctl-bttns");
    presets.appendChild(resetButton);
}

function addPoint(actuatorName) {
    // let dataArray= actuatorsDictionary[actuatorName].dataset;
    // document.getElementById(actuatorName + "_code").value += "K0F31D100 "
    // parseVibratorCode("vibrator_code");
    // startActuator();

    let length = currentDataPoints.length;
    let lastPoint = currentDataPoints[length - 1];
    let newPoint = [lastPoint[0] + 200, 0]; // make the last point's y 0 so we can have a closed loop
    currentDataPoints.push(newPoint);
    updateSVG(actuatorsDictionary[actuatorName + "Graph"].svg, currentDataPoints, actuatorName, newPoint[0] * 1.5);
    convertDataToVibrationCode(currentDataPoints);

}

function printSettings() {
    let currentSetting = document.getElementById("vibrator_code").value;
    let currentdate = new Date();
    let datetime = "Last Sync: " + currentdate.getDate() + "/" +
        (currentdate.getMonth() + 1) + "/" +
        currentdate.getFullYear() + " @ " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" +
        currentdate.getSeconds();
    // let timestamp = newDate.getTime();
    // newDate.setTime(timestamp * 1000);
    // dateString = newDate.toUTCString();
    //  document.getElementById("timpestamps").innerHTML += currentSetting + "," +  datetime;
    // let _br = document.createElement('hr');
    //  document.getElementById("timpestamps").appendChild(_br)
}

window.onload = function () {
    resetGraph("vibrator");
}

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
        let accuTime = 0.;
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
                let durVal = parseFloat(dur_str) //convert duration string to float
                console.log(durVal);
                if (isNaN(strVal) || isNaN(durVal) || (durVal < 0.01)) return;
                if (oneCode[0] === "K") {
                    // if (accuTime === 0) {
                    dataset.push({
                        x: accuTime,
                        y: strVal
                    });
                    // }
                    accuTime += durVal;
                    dataset.push({
                        x: accuTime,
                        y: strVal
                    });
                    // console.log(dataset);
                } else if (oneCode[0] === "R") {
                    if (dataset.length === 0) {
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
    // formattedData.push([0, 0]);
    let xData = [];
    for (let i = 0; i < dataset.length; i++) {
        let point = [];
        let datasetPointX = dataset[i].x;
        let datasetPointY = dataset[i].y;
        xData.push(datasetPointX);
        point.push(datasetPointX, datasetPointY);
        formattedData.push(point);
    }

    formattedData = Array.from(new Set(formattedData.map(JSON.stringify)), JSON.parse);
    let maxX = Math.max(...xData);

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
    document.getElementById('actuator-toggle').src = "public/running.svg";
    let statusLable = document.getElementById('actuator-state-label');
    statusLable.innerHTML = "Actuator Running";
    statusLable.style.color = "#44CD5A";
    // let repeat_count = parseInt(document.getElementById("repeat_count").value);
    // stopActuator();
    let maxLoopTime = 0;
    let actuatorsDictionaryKeys = Object.keys(actuatorsDictionary)
    for (i = 0; i < actuatorsDictionaryKeys.length; i++) {
                    let keyStr = actuatorsDictionaryKeys[i];
                    if (keyStr.endsWith("Dataset")) {
                        let dataSet = actuatorsDictionary[keyStr];
                        if (dataSet.length > 0) {
                            let time_total = dataSet[dataSet.length - 1].x * 2;
                            if (time_total > maxLoopTime) maxLoopTime = time_total;
            }
        }
    }

    //send actuator control commands
    let actuatorsSendString = "N "; //stop all actuators
    if (document.getElementById("loopSet").checked) {
        actuatorsSendString = actuatorsSendString + "L ";
    }
    //send vibrator
    let vibratorCodeContent = document.getElementById("vibrator_code").value.trim();
    console.log(vibratorCodeContent);
    if (vibratorCodeContent.length > 0) {
        actuatorsSendString = actuatorsSendString + "V ";
        actuatorsSendString = actuatorsSendString + vibratorCodeContent + " ";
        // for (j = 0; j < 2; j++) {
        //     actuatorsSendString = actuatorsSendString + vibratorCodeContent + " ";
        // }
    }
    //end command
    actuatorsSendString = actuatorsSendString + "\n";
    console.log(actuatorsSendString);
    // if (maxLoopTime > 0) {
    //   endPlayTimeoutID = setTimeout(endOfActuator, maxLoopTime);
    // }
    nusSendString(actuatorsSendString);
    running = true;
}

function actuatorToggle() {
    console.log("clicked you")
    if (running) {
        stopActuator();
        console.log("stop Actuator");
    } else {
        startActuator();
        console.log("start Actuator");
    }
}

function stopActuator() {
    console.log("stopActuator");
    document.getElementById('actuator-toggle').src = "public/paused.svg";
    document.getElementById('actuator-state-label').innerHTML = "Actuator Paused";
    document.getElementById('actuator-state-label').style.color = "#FF0000";
    clearTimeout(endPlayTimeoutID);
    nusSendString('N \n');
    running = false;
}

function replaceCommandValue(currentValue, currentCommand) {
    let fIndex = currentCommand.indexOf("F");
    let dIndex = currentCommand.indexOf("D");
    let freqFirstPart = currentCommand.slice(0, fIndex + 1); //This includes f
    let dSecondPart = currentCommand.slice(dIndex);
    let newString = freqFirstPart + currentValue.toString() + dSecondPart;
    return newString;
}

function showVal(slider, textID) {
    let value_txt_div = document.getElementById(textID);
    let currentCodeToProcess = document.getElementById("vibrator_code").value.trim();
    let newFreqValue = slider.value;
    value_txt_div.innerHTML = newFreqValue;
    let individualCodeArray = currentCodeToProcess.split(" ");
    let result = "";
    for (let i = 0; i < individualCodeArray.length; i++) {
        let newCommand = replaceCommandValue(newFreqValue, individualCodeArray[i]);
        result += newCommand;
        result += " ";
    }
    let codeInput = document.getElementById("vibrator_code");
    codeInput.value = result.trim() + " ";
}

function changeGap(slider, textID) {
    let value_txt_div = document.getElementById(textID);
    let newGapScaleValue = slider.value;
    value_txt_div.innerHTML = newGapScaleValue;
    newGapScaleValue = parseFloat(newGapScaleValue);
    currentDataPoints.forEach((point) => {
        point[0] /= scaleAccumulator;
        point[0] *= newGapScaleValue;
    })
    scaleAccumulator = newGapScaleValue;
    convertDataToVibrationCode(currentDataPoints);
    let dataMaxX = currentDataPoints[currentDataPoints.length - 1][0];
    if (dataMaxX > currentMaxX) {
        currentMaxX = dataMaxX * 2;
    }
    updateSVG(currentSVG, currentDataPoints, currentactuatorName, currentMaxX);
}

function onMouseUpSlide(slider, textID) {
    // let value_txt_div = document.getElementById(textID);
    // let newGapScaleValue = slider.value;
    // newGapScaleValue = parseFloat(newGapScaleValue);
    // currentDataPoints.forEach((point) => {
    //     point[0] *= newGapScaleValue;
    // })
    // let domainMax = currentDataPoints[currentDataPoints.length - 1][0];
    // updateSVG(currentSVG, currentDataPoints, currentactuatorName, 2000);

    console.log('onmouseup')
    startActuator();
}

function onMouseUp() {
    console.log('onmouseup')
    startActuator();
}


function update() {
    startActuator();
    printSettings();
}
