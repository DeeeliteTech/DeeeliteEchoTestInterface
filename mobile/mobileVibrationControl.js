let mobileCurrentDataPoints = [];
let mobilePresets = [
    //single
    "R14F56D269 R0F56D72 K0F56D37 R10F56D42 R85F56D142 ",
    //double
    "R11F35D8 R24F35D17 R36F35D16 R44F35D14 R47F35D33 K47F35D43 R41F35D16 R28F35D21 R11F35D6 R13F35D22 R16F35D44 R12F35D47 R3F35D18 R47F35D19 R70F35D10 R75F35D7 R79F35D4 R83F35D15 R84F35D22 R83F35D54 R77F35D13 R73F35D2 R65F35D2 R42F35D13 R47F35D16 R48F35D28 R46F35D21 R41F35D25 R0F35D72 K0F35D375 ",
    //Busy Bee
    "R3F31D52 R5F31D49 R7F31D52 R8F31D49 R6F31D49 R0F31D35 R3F31D41 R10F31D7 R76F31D94 R80F31D27 R3F31D50 R5F31D49 R7F31D52 R8F31D49 R6F31D49 R0F31D35 R3F31D41 R10F31D7 R93F31D174 R96F31D63 ",
    //Deep Dive
    "R11F47D8 R36F47D16 R48F47D12 R56F47D15 R59F47D34 K59F47D44 R53F47D16 R40F47D21 R11F47D10 R13F47D22 R16F47D33 R13F47D29 R9F47D25 R1F47D21 R61F47D14 R77F47D9 R82F47D10 R87F47D30 R90F47D50 R88F47D46 R82F47D41 R75F47D24 R66F47D13 R56F47D9 R49F47D5 R38F47D11 R41F47D27 K41F47D47 R37F47D27 R31F47D15 R2F47D37 R0F47D460 ",
    //New Bloom
    "K0F84D2001 R39F84D143 R4F84D106 R45F84D122 R2F84D162 R73F84D81 R63F84D136 R26F84D71 R6F84D389 R2F84D131 ",
    //Sunset Rollercoaster
    "R7F31D628 R40F31D1142 R24F31D552 R30F31D1028 R7F31D571 K7F31D590 R0F31D742 R26F31D666 R46F31D838 R30F31D1161 R8F31D685 R0F31D1161 ", "K0F84D2001 R39F84D143 R4F84D106 R45F84D122 R2F84D162 R73F84D81 R63F84D136 R26F84D71 R6F84D389 R2F84D131 ",
    //Deep Water Snore
    "R16F77D390 R32F77D890 R58F77D1045 R11F77D500 R0F77D1463 K0F77D1118 ",
    //Morning Jog
    "R11F35D6 R24F35D13 R36F35D12 R44F35D10 R47F35D25 K47F35D33 R41F35D12 R28F35D16 R11F35D4 R13F35D17 R16F35D34 R12F35D36 R3F35D14 R48F35D29 R71F35D7 R76F35D5 R80F35D3 R84F35D11 R85F35D17 R84F35D42 R78F35D10 R74F35D1 R66F35D1 R56F35D6 R48F35D16 R49F35D18 K49F35D24 R48F35D21 R42F35D13 R0F35D68 R1F35D328  ",
    //Wake Up 5 am
    "R11F35D13 R36F35D27 R48F35D21 R56F35D25 R59F35D57 K59F35D72 R53F35D27 R40F35D35 R11F35D17 R13F35D37 R16F35D54 R13F35D48 R9F35D41 R1F35D35 R61F35D23 R77F35D16 R82F35D17 R87F35D50 R90F35D82 R88F35D76 R82F35D68 R75F35D40 R66F35D22 R56F35D16 R49F35D8 R38F35D18 R41F35D45 K41F35D37 R38F35D23 R34F35D10 R1F35D100 R0F35D819 ",
    //Party Alone
    "R70F86D251 R3F86D226 K3F86D254 R71F86D157 R1F86D193 K1F86D257 R49F86D150 R7F86D112 K7F86D143 R53F86D76 R8F86D109 R9F86D104 R80F86D52 R72F86D98 R32F86D46 R1F86D163 K1F86D144 ",
    //Cosmic Drift
    "R6F45D692 R9F45D92 R12F45D96 R11F45D69 R10F45D76 R9F45D86 R6F45D86 R2F45D86 R0F45D69 ",
    //My Beat
    "R11F47D8 R36F47D16 R48F47D12 R56F47D15 R59F47D34 K59F47D44 R53F47D16 R40F47D21 R11F47D10 R13F47D22 R16F47D33 R13F47D29 R9F47D25 R1F47D21 R61F47D14 R77F47D9 R82F47D10 R87F47D30 R90F47D50 R88F47D46 R82F47D41 R75F47D24 R66F47D13 R56F47D9 R49F47D5 R38F47D11 R41F47D27 K41F47D47 R37F47D27 R31F47D15 R2F47D37 R0F47D460 "
    ];
let currentMobileVibrationCode = mobilePresets[0];
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

function mobileSelectPreset() {
    console.log("changing mobile preset")
    let selectedValue = document.getElementById("mobile-presets-menu").value;
    let presetIndex = parseInt(selectedValue);
    let currentPreset = mobilePresets[presetIndex];
    currentMobileVibrationCode = currentPreset;
    updateVibration();
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
    console.log("change the data and start");
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

function updateVibration() {
    // Turn the string into data
    // start the actuator
    // update all the related data corresponding to the current vibration pattern
    mobileParseVibrationCode();
    mobileStartActuator();
    let currentBPM = 60 / mobileCurrentDataPoints[mobileCurrentDataPoints.length - 1][0] * 1000;
    currentBPM = Math.floor(currentBPM);
    document.getElementById("mobileBPMValue").innerHTML = currentBPM.toString();

    console.log(currentBPM);
    document.getElementById("speedRange").value = currentBPM;
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
    updateVibration();
}

document.addEventListener("DOMContentLoaded", function() {
    window.mobileOnMouseUp = mobileOnMouseUp;
    window.mobileChangeBPM = mobileChangeBPM;
    window.mobileShowIntensityChange = mobileShowIntensityChange;
    window.mobileActuatorToggle = mobileActuatorToggle;
    window.changePreset = changePreset;
    window.mobileSelectPreset = mobileSelectPreset;

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
let bloomPass;
let bloomBase = 3.5;

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
        bloomStrength: bloomBase,
        bloomThreshold: 0.0,
        bloomRadius: 1.2
    };

    const renderScene = new RenderPass( scene, camera );
    renderScene.clearAlpha = 1;
    // const clearPass = new ClearPass(scene.background, 1);
    bloomPass = new UnrealBloomPass( new THREE.Vector2( fireflyDimension.width, fireflyDimension.height ), 1.5, 0.4, 0.85 );
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
    let currentBloomStrength = parseInt(document.getElementById("intensityRange").value) * bloomBase;

    fireflies.forEach((firefly) => {
        firefly.started = mobileRunning;
        firefly.bpm = currentBPM;
        firefly.update(time/1000);
        // console.log(firefly.plane.position);
    });
    bloomPass.strength = currentBloomStrength;
    bloomComposer.render();
    // finalComposer.render();
    // renderer.render( scene, camera );
}


