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
var was_idle = false;

// Extension icon timer
chrome.browserAction.setBadgeText({ 'text': '?'});
chrome.browserAction.setBadgeBackgroundColor({ 'color': "#777" });

var opt = {
  type: "basic",
  title: "Welcome back!",
  message: "What were you doing?",
  iconUrl: "../images/thinking_face.png",
  buttons: [{title: "Input Here"}],
  eventTime: Date.now(),
  isClickable: true,
  requireInteraction: true
}

//detect inactivity
chrome.idle.setDetectionInterval(15);
chrome.idle.onStateChanged.addListener(function(state) {
  console.log("state changed: ", state);

  // need to push notification AFTER idle session (re-active state)

  if (state == "idle"){
    was_idle = true;
    console.log("state changed: ", state);
  }
  if (was_idle && state == "active"){
    was_idle = false;
    chrome.notifications.create(opt, function(notificationID){
      console.log("hi");
    });
  }
});

// chrome.notifications.onButtonClicked.addListener(inputActivity);


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
  var now = new Date();
  for (tabId in History) {
    var description = FormatDuration(now - History[tabId][0][0]);
    chrome.browserAction.setBadgeText({ 'tabId': parseInt(tabId), 'text': description});
  }
}

setInterval(UpdateBadges, 1000);

chrome.tabs.onUpdated.addListener(HandleUpdate);
// chrome.tabs.onRemoved.addListener(HandleRemove);
chrome.tabs.onReplaced.addListener(HandleReplace);
