let mobileCurrentDataPoints = [];
let mobilePresets = [
    //single
    "R14F56D269 R0F56D72 K0F56D37 R10F56D42 R85F56D142 ",
    //double
    "R11F35D8 R24F35D17 R36F35D16 R44F35D14 R47F35D33 K47F35D43 R41F35D16 R28F35D21 R11F35D6 R13F35D22 R16F35D44 R12F35D47 R3F35D18 R47F35D19 R70F35D10 R75F35D7 R79F35D4 R83F35D15 R84F35D22 R83F35D54 R77F35D13 R73F35D2 R65F35D2 R42F35D13 R47F35D16 R48F35D28 R46F35D21 R41F35D25 R0F35D72 K0F35D375 ",
]
let currentMobileVibrationCode = mobilePresets[1];
let mobileRunning = false;

let mobileIntensityAccumulator = 1.0;
let mobileGapAccumulator = 1.0;
let mobileBoundScaler = 1.25;
let mobileAdjustmentScaleAccumulator = 1.0;
let mobileFrontAdjustmentAccumulator = 1.0;

function resetParametersValue() {
    mobileIntensityAccumulator = 1.0;
    mobileGapAccumulator = 1.0;
    mobileAdjustmentScaleAccumulator = 1.0;
    mobileFrontAdjustmentAccumulator = 1.0;
    document.getElementById("intensityRange").value = 1;
}

function mobileOnMouseUp() {
    console.log("On Mouse Up");
    mobileStartActuator();
}

function mobileChangeBPM(slider, textID) {
    let value_txt_div = document.getElementById(textID);
    let newBPM = slider.value;
    value_txt_div.innerHTML = newBPM;

    let newBPMValue = parseInt(newBPM);
    let endValue =  60.0/newBPMValue;

    mobileCurrentDataPoints[mobileCurrentDataPoints.length - 1][0] /= mobileAdjustmentScaleAccumulator;
    let currentEndValue = mobileCurrentDataPoints[mobileCurrentDataPoints.length - 1][0] / 1000;
    let adjustmentScale  =  endValue / currentEndValue;
    mobileCurrentDataPoints[mobileCurrentDataPoints.length-1][0] *= adjustmentScale;
    mobileAdjustmentScaleAccumulator = adjustmentScale;

    let frontAdjustmentScale = 1.0;
    if (adjustmentScale > 1.0) {
        frontAdjustmentScale = (adjustmentScale - 1.0) / 1.5 + 1.0
    }
    else {
        frontAdjustmentScale = 1.0 - (1.0 - adjustmentScale) * 1.5;
    }

    for (let i=0; i<mobileCurrentDataPoints.length-1 ; i++) {
        mobileCurrentDataPoints[i][0] /= mobileFrontAdjustmentAccumulator;
        mobileCurrentDataPoints[i][0] *= frontAdjustmentScale;
    }
    mobileFrontAdjustmentAccumulator = frontAdjustmentScale;

    mobileConvertDataToVibrationCode();
    // console.log(currentMobileVibrationCode);
}

function mobileShowIntensityChange(slider, textID) {
    let value_txt_div = document.getElementById(textID);
    let newIntensityValue = slider.value;
    value_txt_div.innerHTML = newIntensityValue;
    let currentCodeToProcess = currentMobileVibrationCode;
    let currentIntensityValue = parseFloat(newIntensityValue);
    mobileCurrentDataPoints.forEach((point) => {
        point[1] /= mobileIntensityAccumulator;
        point[1] *= currentIntensityValue;
    })
    mobileIntensityAccumulator = currentIntensityValue;
    mobileConvertDataToVibrationCode();
    // console.log(currentMobileVibrationCode);
}

function mobileConvertDataToVibrationCode() {
    let freqVal = 200;
    let prevTime = mobileCurrentDataPoints[0][0];
    let prevStrength = mobileCurrentDataPoints[0][1];
    let codeResult = "";
    for (let i = 1; i < mobileCurrentDataPoints.length; i++) {
        let currentResult = "";
        let currentTime = mobileCurrentDataPoints[i][0];
        let currentStrength = mobileCurrentDataPoints[i][1];
        // console.log(currentTime);
        // console.log(currentStrength);
        // console.log("-------");

        let duration = (currentTime - prevTime);
        duration = Math.trunc(duration);
        currentStrength = Math.trunc(currentStrength);
        if (prevStrength !== currentStrength) {
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
        if (currentResult !== "") {
            codeResult += currentResult
        }
        prevTime = currentTime;
        prevStrength = currentStrength;
    }
    currentMobileVibrationCode = codeResult.trim() + " ";
}

function mobileStartActuator() {
    let actuatorsSendString = "N "; //stop all actuators
    actuatorsSendString = actuatorsSendString + "L ";
    let vibratorCodeContent = currentMobileVibrationCode.trim();
    if (vibratorCodeContent.length > 0) {
        actuatorsSendString = actuatorsSendString + "V ";
        actuatorsSendString = actuatorsSendString + vibratorCodeContent + " ";
    }
    //end command
    actuatorsSendString = actuatorsSendString + "\n";
    console.log(actuatorsSendString);
    nusSendString(actuatorsSendString);
    mobileRunning = true;
}

function mobileParseVibrationCode() {
    let allCode = currentMobileVibrationCode.trim();
    let accuTime = 0.;
    let codes = allCode.split(" "); //return an array of code command e.g. ["K100F31D1000", "K0F31D1000"]
    let prevStrength = 0;
    let dataset = [];
    for (let i = 0; i < (codes.length); i++) {
        let oneCode = codes[i]; //loop through each value in the array
        if (oneCode.length === 0) return;
        if (oneCode[0] === "K" || oneCode[0] === "R") {
            let locationOfF = oneCode.indexOf("F");
            let locationOfD = oneCode.indexOf("D");
            let val_str = oneCode.substring(1, locationOfF); //get intensity value
            let dur_str = oneCode.substring(locationOfD + 1); //get duration value
            let strVal = parseInt(val_str) //convert intensity string to int
            let durVal = parseFloat(dur_str) //convert duration string to float
            // console.log(durVal);
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

    // formattedData.push([0, 0]);
    let formattedData = [];
    for (let i = 0; i < dataset.length; i++) {
        let point = [];
        let datasetPointX = dataset[i].x;
        let datasetPointY = dataset[i].y;
        point.push(datasetPointX, datasetPointY);
        formattedData.push(point);
    }
    formattedData = Array.from(new Set(formattedData.map(JSON.stringify)), JSON.parse);
    mobileCurrentDataPoints = formattedData;
}

function mobileStopActuator() {
    console.log("stopActuator");
    nusSendString('N \n');
    mobileRunning = false;
}

function changePreset(index) {
    resetParametersValue();
    if(index === 0) {
        document.getElementById("singleButton").style.background = "#000000";
        document.getElementById("singleButton").style.color = "#ffffff";
        document.getElementById("doubleButton").style.background = "#FFBE63";
        document.getElementById("doubleButton").style.color = "#000000";
    }
    else {
        document.getElementById("doubleButton").style.background = "#000000";
        document.getElementById("doubleButton").style.color = "#ffffff";
        document.getElementById("singleButton").style.background = "#FFBE63";
        document.getElementById("singleButton").style.color = "#000000";
    }
    currentMobileVibrationCode = mobilePresets[index];
    mobileParseVibrationCode();
    mobileStartActuator();
    let currentBPM = 60 / mobileCurrentDataPoints[mobileCurrentDataPoints.length - 1][0] * 1000;
    currentBPM = Math.floor(currentBPM);
    console.log(currentBPM);
    document.getElementById("speedRange").value = currentBPM;
}

document.addEventListener("DOMContentLoaded", function() {
    mobileParseVibrationCode();
    mobileStartActuator();

    let currentBPM = 60 / mobileCurrentDataPoints[mobileCurrentDataPoints.length - 1][0] * 1000;
    currentBPM = Math.floor(currentBPM);
    document.getElementById("speedRange").value = currentBPM;
});