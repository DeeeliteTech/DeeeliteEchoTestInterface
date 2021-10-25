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
    document.getElementById("mobileBPMValue").innerHTML = newBPMValue.toString();

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
    document.getElementById("mobileIntensityValue").innerHTML = newIntensityValue.toString();
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

    document.getElementById("buttonOn").style.background = "#ffffff";
    document.getElementById("buttonOff").style.background = "#ffffff";
    document.getElementById("buttonOn").style.color = "#000000";
    document.getElementById("buttonOff").style.color = "#000000";

    document.getElementById("buttonOn").style.background = "#000000";
    document.getElementById("buttonOn").style.color = "#ffffff";
}

function mobileActuatorToggle() {
    if (mobileRunning) {
        mobileStopActuator();
    } else {
        mobileStartActuator();
    }
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

    document.getElementById("buttonOn").style.background = "#ffffff";
    document.getElementById("buttonOff").style.background = "#ffffff";
    document.getElementById("buttonOn").style.color = "#000000";
    document.getElementById("buttonOff").style.color = "#000000";

    document.getElementById("buttonOff").style.background = "#000000";
    document.getElementById("buttonOff").style.color = "#ffffff";
}

function changePreset(index) {
    resetParametersValue();
    if(index === 0) {
        document.getElementById("singleButton").style.background = "#ffffff";
        document.getElementById("singleButton").style.color = "#000000";

        document.getElementById("doubleButton").style.background = "#000000";
        document.getElementById("doubleButton").style.color = "#ffffff";
    }
    else {
        document.getElementById("doubleButton").style.background = "#ffffff";
        document.getElementById("doubleButton").style.color = "#000000";

        document.getElementById("singleButton").style.background = "#000000";
        document.getElementById("singleButton").style.color = "#ffffff";
    }
    currentMobileVibrationCode = mobilePresets[index];
    mobileParseVibrationCode();
    mobileStartActuator();
    let currentBPM = 60 / mobileCurrentDataPoints[mobileCurrentDataPoints.length - 1][0] * 1000;
    currentBPM = Math.floor(currentBPM);
    document.getElementById("mobileBPMValue").innerHTML = currentBPM.toString();

    console.log(currentBPM);
    document.getElementById("speedRange").value = currentBPM;
}

document.addEventListener("DOMContentLoaded", function() {
    window.mobileOnMouseUp = mobileOnMouseUp;
    window.mobileChangeBPM = mobileChangeBPM;
    window.mobileShowIntensityChange = mobileShowIntensityChange;
    window.mobileActuatorToggle = mobileActuatorToggle;
    window.changePreset = changePreset;

    mobileParseVibrationCode();
    let currentBPM = 60 / mobileCurrentDataPoints[mobileCurrentDataPoints.length - 1][0] * 1000;
    currentBPM = Math.floor(currentBPM);
    document.getElementById("speedRange").value = currentBPM;
    document.getElementById("mobileBPMValue").innerHTML = currentBPM.toString();
    // mobileStartActuator();
    init();
    //animation();
});

// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.120.1/build/three.module.js';
// import Stats from 'https://cdn.jsdelivr.net/npm/three@0.120.1/examples/jsm/libs/stats.module.min.js';
// import Firefly from "./Firefly.js";

//THREEJS
let camera, scene, renderer;
let geometry, material, mesh;
let fireflies = [];
let bloomComposer;

import { EffectComposer } from "https://threejs.org/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://threejs.org/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass} from "https://threejs.org/examples/jsm/postprocessing/UnrealBloomPass.js"  ;

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    let firefly = document.getElementById('firefly');
    let fireflyDimension = firefly.getBoundingClientRect();
    let ratio = fireflyDimension.width / fireflyDimension.height ;
    camera.aspect = ratio;
    camera.updateProjectionMatrix();
    renderer.setSize( fireflyDimension.width, fireflyDimension.height );
}

function init() {

    let BLOOM_SCENE = 1
    const bloomLayer = new THREE.Layers();
    bloomLayer.set( BLOOM_SCENE );

    let fireflyContainer = document.getElementById('firefly');
    let fireflyDimension = fireflyContainer.getBoundingClientRect();
    let ratio = fireflyDimension.width / fireflyDimension.height ;

    camera = new THREE.PerspectiveCamera( 70, ratio, 0.01, 10 );

    camera.position.z = 1;
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xFFBE63);
    scene.background = new THREE.Color(0x000000);


    let number = 50;
    for (let i=0; i<number; i++) {
        let firefly = new Firefly(fireflyDimension.width, fireflyDimension.height, scene);
        firefly.plane.layers.enable(BLOOM_SCENE);
        fireflies.push(firefly);
    }

    // geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    // material = new THREE.MeshNormalMaterial();
    // mesh = new THREE.Mesh( geometry, material );
    // scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( fireflyDimension.width, fireflyDimension.height );
    renderer.setAnimationLoop( animation );
    // renderer.toneMapping = THREE.ReinhardToneMapping;
    // renderer.setClearColor(new THREE.Color(0xFFBE63));

    const params = {
        exposure: 1,
        bloomStrength: 3.5,
        bloomThreshold: 0.0,
        bloomRadius: 1.2
    };

    const renderScene = new RenderPass( scene, camera );
    renderScene.clearAlpha = 1;
    // const clearPass = new ClearPass(scene.background, 1);
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( fireflyDimension.width, fireflyDimension.height ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    //
    bloomComposer = new EffectComposer( renderer );
    // // composer.addPass(clearPass);
    bloomComposer.addPass( renderScene );
    bloomComposer.addPass( bloomPass );
    //
    fireflyContainer.appendChild( renderer.domElement );

}

function animation( time ) {
    // console.log(time/1000);
    // mesh.rotation.x = time / 2000;
    // mesh.rotation.y = time / 1000;
    let currentBPM = parseInt(document.getElementById("speedRange").value);
    fireflies.forEach((firefly) => {
        firefly.started = mobileRunning;
        firefly.bpm = currentBPM;
        firefly.update(time/1000);
        // console.log(firefly.plane.position);
    });
    bloomComposer.render();
    // finalComposer.render();
    // renderer.render( scene, camera );
}


