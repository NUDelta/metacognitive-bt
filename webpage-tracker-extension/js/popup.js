
console.log("popup reloaded at ", Date.now());

var csvtable = [];
var tabId_re = /tabId=([0-9]+)/;
var match = tabId_re.exec(window.location.hash);

var hist = chrome.extension.getBackgroundPage().History;
var idleAction = chrome.extension.getBackgroundPage().inactivelog;

var keyList = Object.keys(hist);
var SortedActivity =[];
var AllActivity = [];

//Interleaving web stuff with the idle stuff
for (var x = 0; x < keyList.length; x++) {
  currTab = keyList[x];
  for(var y = 0; y < hist[currTab].length; y++) {
    AllActivity.push(hist[currTab][y])
  }
}

for (var j = 0; j < idleAction.length; j++) {
  AllActivity.push(idleAction[j])
}

SortedActivity = AllActivity.sort()

//START AND STOP SESSION STUFF
var session_started = chrome.extension.getBackgroundPage().sessionStarted;

var start_stop_btn = document.createElement("BUTTON");
var btn_txt = "";
start_stop_btn.id = 'start_stop';

//initialize button
if(session_started == false){
    btn_txt =document.createTextNode("Start Session");
    start_stop_btn.appendChild(btn_txt);
    document.body.appendChild(start_stop_btn);
}
else{
    btn_txt = document.createTextNode("End Session");
    start_stop_btn.appendChild(btn_txt);
    document.body.appendChild(start_stop_btn);
}

//ON CLICK START/STOP
start_stop_btn.addEventListener('click', function() {
    chrome.extension.getBackgroundPage().sessionStarted = !session_started;
    session_started = chrome.extension.getBackgroundPage().sessionStarted;

    if(session_started == true){
        var start_time = new Date()
        chrome.extension.getBackgroundPage().start_session_time = start_time.toLocaleTimeString();
        chrome.extension.getBackgroundPage().History = {};

        //reload tab to begin tracking
        //get old window ID
        chrome.windows.create(); //generate new session
        // chrome.windows.remove(old_window.id);//close old window

        //update button text
        start_stop_btn.removeChild(btn_txt);
        btn_txt = document.createTextNode("End Session");
        start_stop_btn.appendChild(btn_txt);
    }
    else{
        //update button text
        start_stop_btn.removeChild(btn_txt);
        btn_txt = document.createTextNode("Session Ended");
        start_stop_btn.appendChild(btn_txt);

         //save data
        chrome.storage.local.set({'sessionData': csvtable}, function() {});
        console.log(SortedActivity);
        chrome.extension.getBackgroundPage().HandleSessionEnd();

        //disable button and update popup
        chrome.tabs.reload();
        start_stop_btn.disabled = true;
        start_stop_btn.style.background = "#8b6f94";
    }

});


//display data table in extension popup
var datatable = document.createElement("table");
datatable.id = "table";

//add headers to table
var headerRow = datatable.insertRow();
headerRow.insertCell().textContent = "Date";
headerRow.insertCell().textContent = "Start";
headerRow.insertCell().textContent = "Total ";
headerRow.insertCell().textContent = "Url";
headerRow.id = "tableHeader";

if(session_started == true){
    for (var i = 0; i < SortedActivity.length; i++) {
        var r = datatable.insertRow(-1);

        var date = "";
        var date_obj = "";
        try {
          date = SortedActivity[i][0].toLocaleDateString();
        }
        catch(e) {
          date_obj = new Date(SortedActivity[i][0])
          date = date_obj.toLocaleDateString();
        }

        r.insertCell(-1).textContent = date;
        csvtable.push(date.toString());

        var start_time = "";
        try {
          start_time = (SortedActivity[i][0].toLocaleTimeString('en-GB').substring(0,5)).toString();
        }
        catch(e) {
          start_time = (date_obj.toLocaleTimeString('en-GB').substring(0,5)).toString();
        }
        r.insertCell(-1).textContent = start_time;
        csvtable.push(start_time.toString());

        var end_time;
        var duration;
        if (i == 0) {
          end_time = new Date();
        } else {
          end_time = SortedActivity[i-1][0];
        }
        duration = FormatDuration(Math.abs(end_time - SortedActivity[i][0]));
        //r.insertCell(-1).textContent = duration;
        // TimeMe.initialize({
        //    currentPageName: "my-home-page", // current page
        //    // idleTimeoutInSeconds: 1000 // seconds
        //  });
        // var timeS = TimeMe.getTimeOnAllPagesInSeconds()[0]["timeOnPage"];
        // console.log( TimeMe.getTimeOnAllPagesInSeconds()[0]["timeOnPage"]);
        r.insertCell(-1).textContent = duration.toString();
        // console.log(timeS);
        console.log(duration);
        csvtable.push(duration);

        //var tab = document.createElement("p");
        // var node = document.createTextNode(currTab.toString());
        // r.insertCell(0).appendChild(node);
        // csvtable.push(currTab.toString());

        var a = document.createElement("a");
        a.textContent = SortedActivity[i][1];
        a.setAttribute("href", SortedActivity[i][1]);
        a.setAttribute("target", "_blank");
        r.insertCell(-1).appendChild(a);
        csvtable.push(a.toString() + "\n");

        }
}


//download csv file - DO WE NEED THIS ANYMORE?
csvData1 = csvtable.join(", ");
csvToString = csvtable.toString();
csvData = new Blob(['\ufeff' + ',' + csvToString], { type: 'text/csv;charset=utf-8' });
var csvUrl = URL.createObjectURL(csvData);
var encodedUri = encodeURI(csvUrl);

//comment out button
// var butn = document.createElement("BUTTON");
// var btn_text=document.createTextNode("download csv data!");
// butn.id = 'link';
// butn.appendChild(btn_text);
// document.body.appendChild(butn);

// function download( url, filename ) {
// 	var link = document.createElement('a');
// 	link.setAttribute('href',url);
// 	link.setAttribute('download',filename);
// 	var event = document.createEvent('MouseEvents');
// 	event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
// 	link.dispatchEvent(event);
// }
//
// document.addEventListener('DOMContentLoaded', function() {
//     var link = document.getElementById('link');
//     // onClick's logic below:
//     link.addEventListener('click', function() {
//         download(encodedUri, "data.csv");
//
//     });
// });

document.body.appendChild(datatable);
//document.body.appendChild(link);
