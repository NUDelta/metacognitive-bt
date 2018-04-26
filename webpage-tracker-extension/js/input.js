//WHY IS THIS FILE HERE?
//had to make a new js file because of document bug
//when call document.something, couldn't specify which document it was referring to

console.log(document);

document.getElementById("check").addEventListener('click', save_options);

function save_options(){

  	console.log("check checkboxes");
  	console.log(start_idle, end_idle);
    try {
      var checkedValue = document.querySelector('.check:checked').value;
      console.log(Date(Date.now()), checkedValue)
      chrome.extension.getBackgroundPage().inactivelog.push([Date(Date.now()), checkedValue])
    }
    catch(e) {
        var inputValue = document.getElementById("other").value;
        console.log(Date(Date.now()), inputValue)
        chrome.extension.getBackgroundPage().inactivelog.push([Date(Date.now()), inputValue])
    }

  	chrome.extension.getBackgroundPage().input_tab_open = false;
    //chrome.extension.getBackgroundPage().inactivelog.append
  	window.close();

}
