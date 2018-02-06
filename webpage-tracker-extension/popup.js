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

 TimeMe.initialize({
 		currentPageName: "my-home-page", // current page
 		idleTimeoutInSeconds: 30 // seconds
 	});

var csvtable = [];
var tabId_re = /tabId=([0-9]+)/;
var match = tabId_re.exec(window.location.hash);

var hist = chrome.extension.getBackgroundPage().History;

var keyList = Object.keys(hist);

var datatable = document.createElement("table");
for (var j = 0; j < keyList.length; j++) {
  currTab = keyList[j];

  for (var i=0; i < hist[currTab].length; i++) {
    var r = datatable.insertRow(-1);

    var date = "";
    //if (i == hist[currTab].length - 1 ||
      //  (hist[currTab][i][0].toLocaleDateString() != hist[currTab][i+1][0].toLocaleDateString())) {
      date = hist[currTab][i][0].toLocaleDateString();
    //}
    r.insertCell(-1).textContent = date;
    csvtable.push(date.toString() + "\n");

    r.insertCell(-1).textContent = hist[currTab][i][0].toLocaleTimeString('en-GB');
    csvtable.push((hist[currTab][i][0].toLocaleTimeString('en-GB')).toString() + "\n");

    var end_time;
    if (i == 0) {
      end_time = new Date();
    } else {
      end_time = hist[currTab][i-1][0];
    }
    r.insertCell(-1).textContent = FormatDuration(end_time - hist[currTab][i][0]);
    // var duration = FormatDuration(end_time - hist[currTab][i][0]);
    var timeS = TimeMe.getTimeOnCurrentPageInSeconds();
    // console.log(timeS);
    // console.log(duration);
    csvtable.push(timeS + "\n");

    var tab = document.createElement("p");
    var node = document.createTextNode(currTab.toString());
    r.insertCell(0).appendChild(node);
    csvtable.push(currTab.toString() + "\n");

    var a = document.createElement("a");
    a.textContent = hist[currTab][i][1];
    a.setAttribute("href", hist[currTab][i][1]);
    a.setAttribute("target", "_blank");
    r.insertCell(-1).appendChild(a);
    csvtable.push(a.toString() + "\n");

}
}


//download csv file
csvData1 = csvtable.join(", ");
csvToString = csvtable.toString();
csvData = new Blob(['\ufeff' + ',' + csvToString], { type: 'text/csv;charset=utf-8' });
var csvUrl = URL.createObjectURL(csvData);
var encodedUri = encodeURI(csvUrl);

var butn = document.createElement("BUTTON");
var btn_text=document.createTextNode("download csv data!");
butn.id = 'link';
butn.appendChild(btn_text);
document.body.appendChild(butn);

function download( url, filename ) {
	var link = document.createElement('a');
	link.setAttribute('href',url);
	link.setAttribute('download',filename);
	var event = document.createEvent('MouseEvents');
	event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
	link.dispatchEvent(event);
}

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('link');
    // onClick's logic below:
    link.addEventListener('click', function() {
        download(encodedUri, "data.csv");;
    });
});

document.body.appendChild(datatable);
document.body.appendChild(link);
