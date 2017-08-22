
// handle admin mode 
login_element = document.getElementById("login-field");
if (!login_element) {
	loginelements = document.getElementsByClassName("login");
	if (loginelements.length > 0) {
		login_element = loginelements[0];
	}
}
if (login_element) {
	if (login_element.innerHTML.lastIndexOf("Admin Mode") != -1) {
		login_element.innerHTML= login_element.innerHTML.replace("Admin Mode" , " Admin Mode - JS TURNED ON");
		sidepanel = document.getElementById("side-panel");
		mainpanel = document.getElementById("main-panel");
		if (sidepanel) { sidepanel.className += "original"; }
		if (mainpanel) {mainpanel.className += "original";}	
                }
}
