// theme js for all pages in Web Panel

if (document.title.lastIndexOf("Jenkins") != -1) {
	document.title = document.title.replace("Jenkins" , "");
	document.title = document.title.replace("[]" , " - Ready");
}
