
var data;
var sessionData;
var data2;
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

      //add headers to table
      var headerRow = datatable.insertRow();
      headerRow.insertCell().textContent = "Date";
      headerRow.insertCell().textContent = "Start";
      headerRow.insertCell().textContent = "Total ";
      headerRow.insertCell().textContent = "Url";
      headerRow.id = "tableHeader";

      for (var i = 0; i < sessionData.length; i=i+4) {
        var r = datatable.insertRow(-1);
        var date = sessionData[i+0]
        r.insertCell(-1).textContent = date;
        var start = sessionData[i+1]
        r.insertCell(-1).textContent = start;
        var total = sessionData[i+2]
        r.insertCell(-1).textContent = total;
        
        var url = sessionData[i+3];
        var firstFound;

        if (i+7 < sessionData.length) {
           var nextUrl = sessionData[i+7];
           console.log(nextUrl.includes(url));
          if(!nextUrl.includes(url)) {
            url = extractHostname(url);
          }
        }
       
        
        r.insertCell(-1).textContent = url;
      }
        document.body.appendChild(datatable);
        document.body.appendChild(link);
    }});
  chrome.storage.local.get( 'sessionStart', function(result) {
    if (!chrome.runtime.error) {
      console.log("session start:", result.sessionStart);

    }});
  chrome.storage.local.get( 'sessionEnd', function(result) {
    if (!chrome.runtime.error) {
      console.log("session end: ", result.sessionEnd);
    }});

};

function extractHostname(url) {
   var hostname;
   //find & remove protocol (http, ftp, etc.) and get hostname

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
