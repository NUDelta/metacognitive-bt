
var data;

 document.body.onload = function() {
  chrome.storage.sync.get(function(result) {
    if (!chrome.runtime.error) {
      console.log(result);
      data = JSON.stringify(result);

      document.getElementById("data").innerHTML = data;
    }
  });
}