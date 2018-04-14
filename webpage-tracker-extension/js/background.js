/*
 * Copyright 2013 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var History = {}; //dictionary of web history
var inactivelog = [];
var was_idle = false;
var input_tab_open = false;
var sessionStarted = false;
var sessionEnded = false;
// var input_tab_open = false;

var start_idle, end_idle;
var start_session_time, end_session_time;

// var activeStatus = true;
// var IdleAction = {};

// Extension icon timer
chrome.browserAction.setBadgeText({ 'text': '?'});
chrome.browserAction.setBadgeBackgroundColor({ 'color': "#777" });

// var opt = {
//   type: "basic",
//   title: "Inactivity Triggered",
//   message: "What were you doing?",
//   iconUrl: "../images/thinking_face.png",
//   buttons: [{title: "Input Here",
//             }],
//   eventTime: Date.now(),
//   isClickable: true,
//   requireInteraction: true
// }

//DETECT INACTIVITY CHANGE AND SAVE RESPONSE
chrome.idle.setDetectionInterval(15);
chrome.idle.onStateChanged.addListener(function(state) {

  if(sessionStarted == true){
    // need to push notification AFTER idle session (re-active state)
    if (state == "idle"){
      was_idle = true;
      start_idle = Date.now();
    }
    if (was_idle && state == "active"){
      was_idle = false;
      end_idle = Date.now();
      if (input_tab_open == false){
        window.open("../inactivity-input.html");
        input_tab_open = true;
        console.log(start_idle, end_idle);
      }
    }
  }
});


// OLD NOTIFICATION STUFF IN CASE WE WANNA SEND A NOTIFICATION
// chrome.notifications.create(opt, function(notificationID){
//   console.log("hi");
//   var inactiveStart = Date.now()
//   var responseWhenAway;
//   responseWhenAway = window.prompt("whatcha doing?","enter your response here.");
//   window.alert(responseWhenAway)
//   IdleAction[responseWhenAway] = Date.now()-inactiveStart;
// });



function Update(t, tabId, url) {
  if (!url) {
    return;
  }
  if (tabId in History) {
    if (url == History[tabId][0][1]) {
      return;
    }
  } else {
    History[tabId] = [];
  }

  //add time and url to front
  History[tabId].unshift([t, url]);

  var history_limit = parseInt(localStorage["history_size"]);
  if (! history_limit) {
    history_limit = 23;
  }
  while (History[tabId].length > history_limit) {
    History[tabId].pop();
  }

  //update extension icon timer
  chrome.browserAction.setBadgeText({ 'tabId': tabId, 'text': '0:00'});
  chrome.browserAction.setPopup({ 'tabId': tabId, 'popup': "popup.html#tabId=" + tabId});
}

function HandleUpdate(tabId, changeInfo, tab) {
  if(sessionEnded){
    chrome.browserAction.setBadgeText({ 'tabId': tabId, 'text': 'Done'});
    chrome.browserAction.setPopup({ 'tabId': tabId, 'popup': "done.html"});
    return;
  }
  Update(new Date(), tabId, changeInfo.url);
}

function HandleRemove(tabId, removeInfo) {
  delete History[tabId];
}

function HandleReplace(addedTabId, removedTabId) {
  var t = new Date();
  delete History[removedTabId];
  chrome.tabs.get(addedTabId, function(tab) {
    Update(t, addedTabId, tab.url);
  });
}


function UpdateBadges() {
  if(sessionStarted == true){
    var now = new Date();
    for (tabId in History) {
      var description = FormatDuration(now - History[tabId][0][0]);
      chrome.browserAction.setBadgeText({ 'tabId': parseInt(tabId), 'text': description});
    }
  }
}

setInterval(UpdateBadges, 1000);

chrome.tabs.onUpdated.addListener(HandleUpdate);
// chrome.tabs.onRemoved.addListener(HandleRemove);
chrome.tabs.onReplaced.addListener(HandleReplace);


// //TRYING THIS
// function FormatDuration(d) {
//   if (d < 0) {
//     return "?";
//   }
//   var divisor = d < 3600000 ? [60000, 1000] : [3600000, 60000];
//   function pad(x) {
//     return x < 10 ? "0" + x : x;
//   }
//   return Math.floor(d / divisor[0]) + ":" + pad(Math.floor((d % divisor[0]) / divisor[1]));
// }
