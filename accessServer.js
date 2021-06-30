// // init and server access code:
// //Created by Deqing Sun, May 2021
// var presetsDataFromServer = {};
// function onFetchUserDataSuccess(response) {
//   var div = document.getElementById('emailID');
//   div.innerHTML = response["emailID"];
//   //console.log(response["emailID"]);
// }
//
// function onFetchPresetsSuccess(response) {
//   presetsDataFromServer = response;
//   var presetSelect = document.getElementById("presetsFromServer");
//   var selectedValue = presetSelect.value;
//   //remove additional
//   var presetSelectLength = presetSelect.options.length;
//   for (var i = 0; i < presetSelectLength; i++) {
//     presetSelect.remove(1);
//   }
//   if (document.getElementById("savePresetName").value.length == 0) {
//     loadOnePreset(); //prefill save name
//   }
//   //console.log(response);
//   if (response.length > 0) {
//     for (var i = 0; i < response.length; i++) {
//       var onePreset = response[i];
//       var option = document.createElement("option");
//       option.text = onePreset.preset;
//       option.value = option.text;
//       presetSelect.add(option);
//       if (selectedValue == option.text) {
//         presetSelect.selectedIndex = presetSelect.options.length - 1;
//       }
//     }
//   }
// }
//
// function loadOnePreset() {
//   var presetMenuValue = document.getElementById("presetsFromServer").value;
//   if (presetMenuValue != "New Preset") {
//     for (var i = 0; i < presetsDataFromServer.length; i++) {
//       var onePreset = presetsDataFromServer[i];
//       if (onePreset.preset == presetMenuValue) {
//         document.getElementById("vibrator_code").value = onePreset.vibratorSetting;
//         parseActuatorCode('vibrator_code', 'vibrator')
//         // document.getElementById("heater_code").value = onePreset.heaterSetting;
//         // parseActuatorCode('heater_code', 'heater');
//       }
//       document.getElementById("savePresetName").value = presetMenuValue;
//     }
//     //console.log(presetMenuValue);
//   } else {
//     var presetCounter = 1;
//     var newPresetName = "Preset " + presetCounter;
//     for (presetCounter = 1; presetCounter < 100; presetCounter++) {
//       var sameNameExist = false;
//       newPresetName = "Preset " + presetCounter;
//       for (var i = 0; i < presetsDataFromServer.length; i++) {
//         var onePreset = presetsDataFromServer[i];
//         if (onePreset.preset == newPresetName) {
//           sameNameExist = true;
//         }
//       }
//       if (!sameNameExist) break;
//     }
//     document.getElementById("savePresetName").value = newPresetName;
//   }
// }
//
// function savePreset() {
//   var presetName = document.getElementById("savePresetName").value;
//   var vibratorSetting = document.getElementById("vibrator_code").value;
//   // var heaterSetting = document.getElementById("heater_code").value;
//   var shrotIDName = document.getElementById("shortIDText").value;
//   var name = document.getElementById("name").value;
//   if (typeof google !== 'undefined') { //the page is running on google app script server
//     google.script.run.withSuccessHandler(onFetchPresetsSuccess).savePresetsOfCurrentUser(presetName, vibratorSetting, shrotIDName, name);
//   } else {
//     var presets = presetsDataFromServer;
//     var alreadyInPresets = false;
//     for (var i = 0; i < presets.length; i++) {
//       var onePreset = presetsDataFromServer[i];
//       if (onePreset.preset == presetName) {
//         // onePreset.heaterSetting = heaterSetting;
//         onePreset.vibratorSetting = vibratorSetting;
//         alreadyInPresets = true;
//         break;
//       }
//     }
//     if (!alreadyInPresets) {
//       presets.push({
//         "preset": presetName,
//         "vibratorSetting": vibratorSetting,
//         // "heaterSetting": heaterSetting
//       });
//     }
//     onFetchPresetsSuccess(presets);
//   }
// }

document.addEventListener("DOMContentLoaded", function() {
  initGraph("vibrator");
  // // initGrpah("heater");
  // if (typeof google !== 'undefined') { //the page is running on google app script server
  //   google.script.run.withSuccessHandler(onFetchUserDataSuccess).fetchUserData();
  //   google.script.run.withSuccessHandler(onFetchPresetsSuccess).getPresetsOfCurrentUser();
  // } else { //the page is running on local test server, pretent we load something
  //   onFetchUserDataSuccess({
  //     "emailID": "tesetuser"
  //   });
  //   onFetchPresetsSuccess([{
  //     "preset": "test 1",
  //     "vibratorSetting": "K10F31D1000 K0F31D1000 "
  //   }, {
  //     "preset": "test 2",
  //     "vibratorSetting": "K10F31D100 K0F31D1000 "
  //   }]);
  // }
});
