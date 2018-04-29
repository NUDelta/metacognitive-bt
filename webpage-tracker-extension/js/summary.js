var sessionData;
var checkbox;
var datatable;
var csvtable = [];
var tabId_re = /tabId=([0-9]+)/;
var match = tabId_re.exec(window.location.hash);


document.body.onload = function() {
  chrome.storage.local.get( 'sessionData', function(result) {
    if (!chrome.runtime.error) {
      sessionData = result.sessionData;
      console.log(result.sessionData);

      datatable = document.createElement("table");
      datatable.id = "table";
      document.getElementById("date").innerHTML = "Date: " + sessionData[0];
      //add headers to table
      var headerRow = datatable.insertRow();
      headerRow.insertCell().textContent = "Dist?";
      headerRow.insertCell().textContent = "Start";
      headerRow.insertCell().textContent = "Total ";
      headerRow.insertCell().textContent = "Url";
      headerRow.id = "tableHeader";

      for (var i = 0; i < sessionData.length; i=i+4) {
        var r = datatable.insertRow(-1);
        // r.id= t.toString();
        // var date = sessionData[i+0]
        checkbox = '<input type="checkbox" name="checkdist" id="checkdist" value="no">';
        r.insertCell(-1).innerHTML = checkbox;

        var start = sessionData[i+1]
        r.insertCell(-1).textContent = start;
        var total = sessionData[i+2]
        r.insertCell(-1).textContent = total;
        
        var url = extractHostname(sessionData[i+3]);
        var firstFound;

        //ATTEMPT AT KEEPING DATA AFTER HOSTNAME
        // if (i+7 < sessionData.length) {
        //   var nextUrl = sessionData[i+7];
        //   console.log(nextUrl.includes(url));
        //   if(extractHostname(url) == extractHostname(nextUrl)) {
        //     console.log("got emmm");
        //   }
        //   else{
        //     url = extractHostname(url); 
        //   }
        // }
        // else{
        //  url = extractHostname(url); 
        // }
        
        r.insertCell(-1).textContent = url;
      }
        // var check = document.querySelector("input[name=checkdist]");
        // check.addEventListener('change', check_distraction);
        // document.getElementById("checkdist").addEventListener('click', check_distraction);
        document.body.appendChild(datatable);
        checkUpdates();
    }});
  chrome.storage.local.get( 'sessionStart', function(result) {
    if (!chrome.runtime.error) {
      document.getElementById("start").innerHTML = "Start: " + result.sessionStart;

    }});
  chrome.storage.local.get( 'sessionEnd', function(result) {
    if (!chrome.runtime.error) {
      document.getElementById("end").innerHTML = "End: " + result.sessionEnd;
    }});
  chrome.storage.local.get( 'sessionLocation', function(result) {
    if (!chrome.runtime.error) {
      // document.getElementById("location").innerHTML = "Session Location: " + result.sessionLocation;
  }});

};

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  // if 0-15
  if(url.substring(0,16) == "chrome-extension"){
    return url.substring(52)
  }

  if (url.indexOf('://') > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove “?”
  hostname = hostname.split('?')[0];

  return hostname;
}

function checkUpdates(){
  var boxes = document.getElementsByName("checkdist");
  for(var i = 0, box; box = boxes[i]; i++){
    box.addEventListener('click', check_distraction);
  }
}


function check_distraction(){  
  var boxes = document.getElementsByName("checkdist");
  var table = document.getElementById("table");
  for(var i = 0, box; box = boxes[i]; i++){
    if(box.checked){
      table.rows[i+1].style.color = "red";
    }
    if(!box.checked){
      table.rows[i+1].style.color = "black";
    }
  }
}