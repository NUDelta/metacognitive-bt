//WHY IS THIS FILE HERE?
//had to make a new js file because of document bug
//when call document.something, couldn't specify which document it was referring to

console.log(document);

document.getElementById("check").addEventListener('click', save_options);

function save_options(){

  	console.log("check checkboxes");
  	console.log(start_idle, end_idle);
  	chrome.extension.getBackgroundPage().input_tab_open = false;
  	window.close();

}