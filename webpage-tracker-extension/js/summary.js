
var data;
var csvtable = [];
var tabId_re = /tabId=([0-9]+)/;
var match = tabId_re.exec(window.location.hash);

var hist = chrome.extension.getBackgroundPage().History;
var idleAction = chrome.extension.getBackgroundPage().inactivelog;

var keyList = Object.keys(hist);
var SortedActivity =[];
var AllActivity = [];
var timeS;

//var popup = chrome.extension.getViews('popup.html');

 document.body.onload = function() {
  chrome.storage.sync.get(function(result) {
    if (!chrome.runtime.error) {
      console.log(result);
      data = JSON.stringify(result);

      document.getElementById("data").innerHTML = data;
    }
  });

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


  //display data table in extension popup
  var datatable = document.createElement("table");
  datatable.id = "table";

  //add headers to table
  // var header = datatable.createTHead();
  var headerRow = datatable.insertRow();
  // headerRow.insertCell().textContent = "Tab";
  headerRow.insertCell().textContent = "Date";
  headerRow.insertCell().textContent = "Start";
  headerRow.insertCell().textContent = "Total ";
  headerRow.insertCell().textContent = "Url";
  headerRow.id = "tableHeader";

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
            start_time = SortedActivity[i][0].toLocaleTimeString('en-GB').substring(0,5);
          }
          catch(e) {
            start_time = date_obj.toLocaleTimeString('en-GB').substring(0,5);
          }
          r.insertCell(-1).textContent = start_time;
          csvtable.push(start_time.toString());

          // var end_time;
          // if (i == 0) {
          //   end_time = new Date();
          // } else {
          //   end_time = SortedActivity[i-1][0];
          // }
          //r.insertCell(-1).textContent = FormatDuration(end_time - SortedActivity[i][0]);
          // var duration = FormatDuration(end_time - hist[currTab][i][0]);
          timeS = TimeMe.getTimeOnCurrentPageInSeconds();
          r.insertCell(-1).textContent = timeS;
          // console.log(timeS);
          // console.log(duration);
          csvtable.push(timeS);

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
          download(encodedUri, "data.csv");

      });
  });

  document.body.appendChild(datatable);
  document.body.appendChild(link);
}
