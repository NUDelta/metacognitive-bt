var sessionData;
var checkbox;
var datatable;
var start_time;
var end_time;
var csvtable = [];
var urlMap = [];
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
        r.id = "row"+(i/4);
        r.setAttribute('data-toggle',"popover");


        // r.id= t.toString();
        // var date = sessionData[i+0]
        checkbox = '<input type="checkbox" name="checkdist" id="checkdist" value="no">';
        r.insertCell(-1).innerHTML = checkbox;

        var start = sessionData[i+1]
        r.insertCell(-1).textContent = start;

        var total = sessionData[i+2]
        r.insertCell(-1).textContent = total;

        var url = extractHostname(sessionData[i+3]);
        urlMap.push(sessionData[i+3]);
        r.setAttribute('title',sessionData[i+3]);

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

        // $("tr").hover(function(){
        //     console.log($(this));
        //        $(this).append("<div></div>");
        //        }, function(){
        //          var original = this.text;
        //        $(this).text(original);
        //      });

        for (var k = 0; k < urlMap.length; k++) {
          // document.getElementById("row"+k).onmouseover = function(){
            //console.log("fuckjquery");
            // var myDiv = document.createElement('div');

              //console.log(urlMap[p]);
              $('[data-toggle="popover"]').popover({
                 placement: 'right',
                 trigger: 'hover',
                 title: urlMap[5],
              });


          // };
          // document.getElementById("row"+k).onmouseout = function(){
          //   // console.log("pieceofcrap");
          // };



        }



        checkUpdates();
    }});
  chrome.storage.local.get( null, function(result) {
    if (!chrome.runtime.error) {
      start_time = result.sessionStart;
      end_time = result.sessionEnd;
      document.getElementById("start").innerHTML = "Start: " + start_time;
      document.getElementById("end").innerHTML = "End: " + end_time;
      var raw_start = start_time.toString().substring(0, 8).split(":");
      var start_to_seconds = (+raw_start[0]) * 60 * 60 + (+raw_start[1]) * 60 + (+raw_start[2])
      var raw_end = end_time.toString().substring(0, 8).split(":");
      var end_to_seconds = (+raw_end[0]) * 60 * 60 + (+raw_end[1]) * 60 + (+raw_end[2])

      var raw_total = end_to_seconds - start_to_seconds;

      var total_to_date = new Date(null);
      total_to_date.setSeconds(raw_total);
      //console.log(sec_to_date);
      var total_string = total_to_date.toString().substring(19, 24);

      console.log(total_string);
      document.getElementById("total").innerHTML = "Total Time: "+ total_string;

    }});
  // chrome.storage.local.get( 'sessionEnd', function(result) {
  //   if (!chrome.runtime.error) {
  //     end_time = result.sessionEnd;
  //     document.getElementById("end").innerHTML = "End: " + end_time;
  //   }});
  chrome.storage.local.get( 'sessionLocation', function(result) {
    if (!chrome.runtime.error) {
      // document.getElementById("location").innerHTML = "Session Location: " + result.sessionLocation;
  }});
  document.getElementById("distracted").innerHTML = "Distracted Time: 00:00";

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
  var isChecked =  $('input:checkbox').is(':checked');
   distracted_time = 0;
  if (!isChecked) {
    document.getElementById("distracted").innerHTML = "Distracted Time: 00:00";
  }
  for(var i = 0, box; box = boxes[i]; i++){
    if(box.checked){
      table.rows[i+1].style.color = "red";
      var raw_time = table.rows[i+1].cells[2].innerText.split(':');
      var time_to_seconds = (+raw_time[0]) * 60 + (+raw_time[1]);
      distracted_time += time_to_seconds;

      var sec_to_date = new Date(null);
      sec_to_date.setSeconds(distracted_time);
      //console.log(sec_to_date);
      var date_string = sec_to_date.toString().substring(19, 24);
      //console.log(table.rows[i+1].cells[2].innerText);
      //console.log(distracted_time);
      document.getElementById("distracted").innerHTML = "Distracted Time: " + date_string;

    }
    if(!box.checked){
      table.rows[i+1].style.color = "black";
    }
  }
}
