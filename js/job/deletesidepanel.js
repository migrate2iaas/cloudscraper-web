
// showing buildHistory panel if it is available


element = document.getElementById("buildHistory");
if (element) {
	element.style.visibility = "visible";
// changing side panel hide method to visibility hidden so it'll show up build hisotry but hiding the rest
	var panel = document.getElementById("side-panel");
	if (panel) {
		panel.style.visibility = "hidden";
		panel.style.display = "block";
	}
	var tasks = document.getElementById("tasks");
	if (tasks) {
		tasks.style.visibility = "hidden";
		tasks.style.display = "none";
	}
		
}

// delete "changes" reference when object is loaded
document.addEventListener('DOMContentLoaded', function() {

var ary = document.getElementsByTagName("a");
for (var j = 0; j < ary.length ; j++) {
   if (ary[j].href.lastIndexOf("changes") > 0) {
	if (ary[j].parentNode.parentNode) {
		ary[j].parentNode.parentNode.style.display="none";
	}
   }
}

}, false);
