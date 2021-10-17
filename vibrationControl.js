//Created by Huiyi Chen and Deqing Sun, May 2021
//Updated by Rui An:

let actuatorsDictionary = {};
let endPlayTimeoutID = null;

let width = 0;
let height = 0;
let scaleAccumulator = 1.0;
let intensityAccumulator = 1.0;
let boundScaler = 1.25;

let margin = {
        top: 80,
        right: 20,
        bottom: 40,
        left: 40
    },
    presets = [
        //Basic
        "K0F31D1000 K50F31D1000 ",
        //doppel
        "K15F31D200 K0F31D100 K40F31D200 K0F31D550 ",
        //Irregular
        "R7F31D628 R40F31D1142 R24F31D552 R30F31D1028 R7F31D571 K7F31D590 R0F31D742 R26F31D666 R46F31D838 R30F31D1161 R8F31D685 R0F31D1161 ",
        //Echo
        "R11F31D414 R20F31D414 R54F31D628 R22F31D585 R39F31D485 R30F31D371 R17F31D557 R4F31D300 R20F31D428 R24F31D442 R16F31D842 R1F31D1342 ",
        //heartbeat 1
        "R20F31D1000 K20F31D1000 R0F31D1000 K0F31D1000 R40F31D1000 K40F31D1000 R0F31D1000 K0F31D415 ",
        //heartbeat 2
        "K30F58D200 K0F58D100 K65F58D200 K0F58D500 ",
        //heartbeat 3
        "R0F58D121 K0F58D71 R8F58D17 R5F58D32 R65F58D49 K65F58D51 R3F58D67 R8F58D67 R18F58D37 R19F58D32 R0F58D70 K0F58D374 ",
        //heartbeat 4
        "K0F50D3 R73F50D90 R72F50D89 R0F50D31 K0F50D113 R90F50D82 R91F50D117 R0F50D74 K0F50D389 ",
        //heartbeat 5
        "R57F48D167 R20F48D109 K20F48D143 R89F48D113 R0F48D94 K0F48D369 ",
        //heartbeat 6
        "R44F48D46 R55F48D23 R64F48D21 R70F48D30 R69F48D37 R58F48D34 R48F48D5 R38F48D3 R25F48D10 R18F48D5 R14F48D36 R13F48D36 R17F48D25 R22F48D38 R41F48D9 R51F48D10 R59F48D10 R68F48D12 R76F48D25 R81F48D28 R82F48D32 R81F48D34 R73F48D34 R63F48D19 R52F48D19 R37F48D14 R19F48D14 R14F48D16 R9F48D27 R7F48D32 R0F48D308 ",
        //heartbeat 7 BPM:30
        "R11F35D13 R36F35D27 R48F35D21 R56F35D25 R59F35D57 K59F35D72 R53F35D27 R40F35D35 R11F35D17 R13F35D37 R16F35D54 R13F35D48 R9F35D41 R1F35D35 R61F35D23 R77F35D16 R82F35D17 R87F35D50 R90F35D82 R88F35D76 R82F35D68 R75F35D40 R66F35D22 R56F35D16 R49F35D8 R38F35D18 R41F35D45 K41F35D37 R38F35D23 R34F35D10 R1F35D100 R0F35D819 ",
        //heartbeat 7 BPM:40
        "R11F35D11 R36F35D22 R48F35D17 R56F35D20 R59F35D46 K59F35D58 R53F35D22 R40F35D28 R11F35D14 R13F35D30 R16F35D44 R13F35D39 R9F35D33 R1F35D28 R61F35D19 R77F35D13 R82F35D14 R87F35D40 R90F35D66 R88F35D61 R82F35D55 R75F35D32 R66F35D18 R56F35D13 R49F35D7 R38F35D15 R41F35D36 K41F35D30 R38F35D19 R34F35D8 R1F35D80 R0F35D544 ",
        //heartbeat 7 BPM:50
        "R11F47D8 R36F47D16 R48F47D12 R56F47D15 R59F47D34 K59F47D44 R53F47D16 R40F47D21 R11F47D10 R13F47D22 R16F47D33 R13F47D29 R9F47D25 R1F47D21 R61F47D14 R77F47D9 R82F47D10 R87F47D30 R90F47D50 R88F47D46 R82F47D41 R75F47D24 R66F47D13 R56F47D9 R49F47D5 R38F47D11 R41F47D27 K41F47D47 R37F47D27 R31F47D15 R2F47D37 R0F47D460 ",
        //heartbeat 7 BPM:60
        "R11F35D8 R24F35D17 R36F35D16 R44F35D14 R47F35D33 K47F35D43 R41F35D16 R28F35D21 R11F35D6 R13F35D22 R16F35D44 R12F35D47 R3F35D18 R47F35D19 R70F35D10 R75F35D7 R79F35D4 R83F35D15 R84F35D22 R83F35D54 R77F35D13 R73F35D2 R65F35D2 R42F35D13 R47F35D16 R48F35D28 R46F35D21 R41F35D25 R0F35D72 K0F35D375 ",
        //heartbeat 7 BPM:70
        "R11F35D6 R24F35D13 R36F35D12 R44F35D10 R47F35D25 K47F35D33 R41F35D12 R28F35D16 R11F35D4 R13F35D17 R16F35D34 R12F35D36 R3F35D14 R48F35D29 R71F35D7 R76F35D5 R80F35D3 R84F35D11 R85F35D17 R84F35D42 R78F35D10 R74F35D1 R66F35D1 R56F35D6 R48F35D16 R49F35D18 K49F35D24 R48F35D21 R42F35D13 R0F35D68 R1F35D328  ",
        //heartbeat 7 BPM:80
        "R11F35D5 R24F35D11 R36F35D9 R44F35D8 R47F35D21 K47F35D28 R41F35D9 R28F35D13 R11F35D3 R13F35D14 R16F35D29 R12F35D30 R3F35D12 R48F35D25 R71F35D6 R76F35D4 R80F35D1 R84F35D9 R85F35D14 R84F35D34 R78F35D8 R56F35D5 R48F35D13 R49F35D15 K49F35D20 R48F35D18 R42F35D11 R0F35D46 K0F35D331  ",
        //heartbeat 7 BPM:90
        "R11F35D4 R24F35D9 R36F35D7 R44F35D6 R47F35D17 K47F35D23 R41F35D7 R28F35D10 R11F35D2 R13F35D11 R15F35D17 K15F35D14 R12F35D17 R47F35D21 R71F35D13 R76F35D3 R84F35D7 R85F35D11 R84F35D28 R78F35D6 R56F35D4 R48F35D10 R49F35D12 K49F35D16 R48F35D15 R42F35D9 R0F35D38 K0F35D325 ",
        //heartbeat 7 BPM:100
        "R11F31D3 R24F31D9 R36F31D8 R44F31D7 R47F31D18 K47F31D23 R41F31D8 R28F31D11 R11F31D3 R13F31D15 R16F31D12 R12F31D26 R22F31D15 R47F31D4 R70F31D5 R75F31D3 R79F31D1 R83F31D7 R84F31D11 R83F31D30 R77F31D6 R58F31D11 R49F31D12 R46F31D20 R41F31D13 R0F31D87 K0F31D224 ",
        //heartbeat 7 reversed
        "R53F49D23 R69F49D3 R81F49D16 R89F49D14 R92F49D33 K92F49D43 R86F49D16 R73F49D21 R53F49D19 R29F49D5 R19F49D38 R14F49D50 R5F49D18 R20F49D13 R36F49D5 R41F49D7 R45F49D4 R49F49D15 R50F49D22 R49F49D54 R43F49D13 R39F49D2 R31F49D2 R15F49D9 R16F49D22 R17F49D28 R15F49D21 R10F49D24 R0F49D12 K0F49D443 ",
        //Energizing mode 1
        "R14F56D269 R0F56D72 K0F56D37 R10F56D42 R85F56D142 ",
        //Energizing mode 2
        "R3F56D57 R5F56D54 R7F56D57 R8F56D54 R6F56D54 R0F56D39 R3F56D45 R10F56D8 R76F56D103 R80F56D30 R3F56D55 R5F56D54 R7F56D57 R8F56D54 R6F56D54 R0F56D39 R3F56D45 R10F56D8 R93F56D190 R96F56D37 "
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
    updateSVG(currentGraphSVG, points, actuatorName, 2000 * boundScaler);
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

    let endTime = dataPoints[dataPoints.length - 1][0] / 1000.0;
    let bpm = 60.0 / endTime;
    document.getElementById("BPM").innerHTML = Math.round(bpm);
    document.getElementById("bpm_input").value = Math.round(bpm);

    return codeResult;
    update();
}

//this function allows the graph to update with draggable events
function updateSVG(svg, dataPoints, actuatorName, domainMax) {
    // domainMax = dataPoints[dataPoints.length-1][0] * boundScaler;

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
    updateSVG(actuatorsDictionary[actuatorName + "Graph"].svg, currentDataPoints, actuatorName, newPoint[0] * boundScaler);
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
    currentMaxX = maxX;

    actuatorsDictionary[actuatorName + "Dataset"] = dataset;
    //let currentSVG = actuatorsDictionary[actuatorName + "Graph"].svg;
    updateSVG(actuatorsDictionary[actuatorName + "Graph"].svg, formattedData, actuatorName, maxX * boundScaler);

    let endTime = formattedData[formattedData.length - 1][0] / 1000.0;
    let bpm = 60.0 / endTime;
    document.getElementById("BPM").innerHTML = Math.round(bpm);
    document.getElementById("bpm_input").value = Math.round(bpm);

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


function showIntensityVal(slider, textID) {
    let value_txt_div = document.getElementById(textID);
    let currentCodeToProcess = document.getElementById("vibrator_code").value.trim();
    let newIntensityValue = slider.value;
    value_txt_div.innerHTML = newIntensityValue;
    let currentIntensityValue = parseFloat(newIntensityValue);
    currentDataPoints.forEach((point) => {
        point[1] /= intensityAccumulator;
        point[1] *= currentIntensityValue;
    })
    intensityAccumulator = currentIntensityValue;
    convertDataToVibrationCode(currentDataPoints);

    let dataMaxX = currentDataPoints[currentDataPoints.length - 1][0];
    if (dataMaxX > currentMaxX) {
        currentMaxX = dataMaxX * boundScaler;
    }

    updateSVG(currentSVG, currentDataPoints, currentactuatorName, currentMaxX);
}

function showFrequencyVal(slider, textID) {
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

function changeBPM(slider, textID) {
    let value_txt_div = document.getElementById(textID);
    let newBPM = slider.value;
    value_txt_div.innerHTML = newBPM;

    let newBPMValue = parseInt(newBPM);
    let endValue =  60.0/newBPMValue;
    let currentEndValue = currentDataPoints[currentDataPoints.length - 1][0] / 1000;
    let adjustmentScale  =  endValue / currentEndValue;
    let frontAdjustmentScale = 1.0;
    if (adjustmentScale > 1.0) {
        frontAdjustmentScale = (adjustmentScale - 1.0) / 1.5 + 1.0
    }
    else {
        frontAdjustmentScale = 1.0 - (1.0 - adjustmentScale) * 1.5;
    }

    for (let i=0; i<currentDataPoints.length-1 ; i++) {
        currentDataPoints[i][0] *= frontAdjustmentScale;
    }
    currentDataPoints[currentDataPoints.length-1][0] *= adjustmentScale;

    // currentDataPoints.forEach((point) => {
    //     point[0] *= adjustmentScale;
    // })
    // console.log(adjustmentScale);
    // console.log("0asdf");


    convertDataToVibrationCode(currentDataPoints);
    let dataMaxX = currentDataPoints[currentDataPoints.length - 1][0];
    if (dataMaxX > currentMaxX) {
        currentMaxX = dataMaxX * boundScaler;
    }
    updateSVG(currentSVG, currentDataPoints, currentactuatorName, currentMaxX);
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
        currentMaxX = dataMaxX * boundScaler;
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
