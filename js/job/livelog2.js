// The script schedules async updates of log data and puts log data into project description

// The script should have id tag equal to node name
// The script puts log data after the element by id out-${node}


// Constants
var DASHBOARD_LINES = 3;
var JOB_LINES = 25;
// job additional messages doesn't work as expected - when hidden items are still take some spaces which is undesirable
var JOB_LINES_ADDITIONAL = 0;

var htmlEnDeCode = (function () {
	var charToEntityRegex,
	entityToCharRegex,
	charToEntity,
	entityToChar;

	function resetCharacterEntities() {
		charToEntity = {};
		entityToChar = {};
		// add the default set
		addCharacterEntities({
			'&amp;' : '&',
			'&gt;' : '>',
			'&lt;' : '<',
			'&quot;' : '"',
			'&#39;' : "'"
		});
	}

	function addCharacterEntities(newEntities) {
		var charKeys = [],
		entityKeys = [],
		key,
		echar;
		for (key in newEntities) {
			echar = newEntities[key];
			entityToChar[key] = echar;
			charToEntity[echar] = key;
			charKeys.push(echar);
			entityKeys.push(key);
		}
		charToEntityRegex = new RegExp('(' + charKeys.join('|') + ')', 'g');
		entityToCharRegex = new RegExp('(' + entityKeys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
	}

	function htmlEncode(value) {
		var htmlEncodeReplaceFn = function (match, capture) {
			return charToEntity[capture];
		};

		return (!value) ? value : String(value).replace(charToEntityRegex, htmlEncodeReplaceFn);
	}

	function htmlDecode(value) {
		var htmlDecodeReplaceFn = function (match, capture) {
			return (capture in entityToChar) ? entityToChar[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
		};

		return (!value) ? value : String(value).replace(entityToCharRegex, htmlDecodeReplaceFn);
	}

	resetCharacterEntities();

	return {
		htmlEncode : htmlEncode,
		htmlDecode : htmlDecode
	};
})();

// not used for now
function toggle() {

	document.body.scrollTop = document.documentElement.scrollTop = 0;

	var ele = document.getElementById("toggleText1");
	var text = document.getElementById("displayText");
	if (ele.style.display == "block") {
		for (var t = 1; t < JOB_LINES_ADDITIONAL; t++) {
			var elem = document.getElementById('toggleText' + t);
			elem.style.display = "none";
		}
		text.innerHTML = "show";
	} else {

		for (var t = 1; t < JOB_LINES_ADDITIONAL; t++) {
			var elem = document.getElementById('toggleText' + t);
			elem.style.display = "block";
		}

		text.innerHTML = "hide";
	}
}

var scroller = new AutoScroller(document.body);

function checkOnline2(e, href, node) {

	var headers = {};
	if (e.consoleAnnotator != undefined)
		headers["X-ConsoleAnnotator"] = e.consoleAnnotator;
	// check slave node online
	new Ajax.Request(href, {
		method : "get",
		parameters : {
			"start" : e.fetchedBytes
		},
		requestHeaders : headers,
		onComplete : function (rsp, _) {
			var text = rsp.responseText;
			var offlinemarker = "Connect slave to Jenkins";
			var offline = text.lastIndexOf(offlinemarker);
			var htmloutput = "";
			var brief = "";
			if (offline != -1 || rsp.status != 200) {
				brief = "Offline";
				htmloutput = "!!! Offline. Restore connectivity, or reinstall the agent.";
			} else {
				brief = "Offline";
				//htmloutput = "Agent online." // write nothing if the agent is offline
			}

			/*
			var p = document.createElement("DIV");
			e.appendChild(p); // Needs to be first for IE

			if (p.outerHTML) {
			p.outerHTML = htmloutput;
			p = e.lastChild;
			}
			else p.innerHTML = htmloutput;
			Behaviour.applySubtree(p);
			 */
			//---------------------------------------------------------------------ADD for table view
			var idName = 'st1-' + node;
			document.getElementById(idName).innerHTML = htmloutput;
		}

	});
}

// checks whether it runs
function checkRunning2(e, jobhref, statuselement, node , spinnername) {
	var href = jobhref;
	var projhref = "/job/" + node + "-migrate";
	var headers = {};
	if (e.consoleAnnotator != undefined)
		headers["X-ConsoleAnnotator"] = e.consoleAnnotator;
	// check slave node online
	new Ajax.Request(href, {
		method : "get",
		parameters : {
			"start" : e.fetchedBytes
		},
		requestHeaders : headers,
		onComplete : function (rsp, _) {
			var text = rsp.responseText;
			var workmarker = "Build has been executing";
			var work = text.lastIndexOf(workmarker);
			var htmloutput = "";
			var spinnerhtml = '<div id="' +spinnername + '" class="taskspinner"><img alt="" src="/static/fee8cb74/images/spinner.gif" /></div>'
			var buttonhtml = '<a id="' + statuselement + '" onclick="document.getElementById(\'' + statuselement + '\').style.display=\'none\';new Ajax.Request(this.href); return false;" class="stop-button-link" href="' + href + '/stop"><img src="/static/d1eb91ba/images/16x16/stop.png" style="width: 16px; height: 16px; " class="icon-stop icon-sm">cancel</a>';
			var setuptaskhtml = '<div class="setup_task"><a id="' + statuselement + '" href="'+projhref+'/build" class="setuptask_link">Setup Task &raquo;</a></div>';
			if (work != -1) {
				htmloutput = '<div class="running_task">Running ... </div>' + spinnerhtml + '&emsp;&emsp;&emsp;&emsp;' + buttonhtml;
			} else {
				htmloutput = setuptaskhtml;
			}

			//---------------------------------------------------------------------ADD for table view
			var idName = 'st2-' + node;
			document.getElementById(idName).innerHTML = htmloutput;

		}

	});

}

function parseText(textOriginal, lenOut , node) {

	console.log("parseText(textOriginal,lenOut)");
	//	console.log(textOriginal);
	//	console.log(lenOut);

	textOriginal = textOriginal.split("\n</").join("</");
	//	console.log(textOriginal);

	if (textOriginal == "")
		return "";

	var textDestination = "";
	var partsArray = textOriginal.split("\n");
	var i = partsArray.length;
	var lastProgressIndex = 0;
	// find the last occurance of progress message
	while (i--) {
	    var value = partsArray[i];
	    if (value.substring(0, 1) == "%" || value.lastIndexOf('<div class="progress">') != -1) {
		lastProgressIndex = i;
		break;
	    }
	}


	var destArray = partsArray.map(function (st, index, array) {

			var st3 = st.substring(0, 3);
			var st2 = st.replace("\n", "");
			if (lastProgressIndex != index && st.lastIndexOf('<div class="progress">') != -1)
				return "";
			if (st3 == "<di")
				return st;
			if (st3 == "<a ")
				return st;

			if (st3 == ">>>") {
				substr = st2.replace(/>+[^>]/ , "");
				return '<div class="info">' + substr + '</div>'; // note: some of this classes are standard to jenkins and fit pretty well to the dashboard
			}
			if (st3 == "!!!")
				return '<div class="error">' + st2.substring(3) + '</div>';
			if (st3.substring(0, 1) == "%" && lastProgressIndex == index)
				return '<div class="progress">' + st2.substring(1) + '</div>';
			if (st3.substring(0, 1) == "!")
				return '<div class="warning">' + st2.substring(1) + '</div>';
			if (st3.substring(0, 2) == "++")
				return '<div class="result">' + st2.substring(2) + '</div>';
			if (st2.substring(0, 10) == "Aborted by") 
				return '<div class="error">' + st2 + '</div>'

			return "";

		});

	//	 console.log("---destArray----");
	//	 console.log(destArray);

	

	//		 console.log("---destArray----");
	//	 console.log(destArray);

	var resArray = new Array();

	resArray = destArray.filter(function (st) {
			if (st != "")
				return st;
		});

    	console.log("---resArray----");
	 console.log(resArray);

	var numArray = new Array();
	
	if (resArray.length > 1)
	numArray=resArray.filter(function(item, i, arr){
		if (i >= (resArray.length - lenOut)) return item;
	});
	
	var addArray = new Array(); 
		
	if (resArray.length > 1)
	addArray=resArray.filter(function(item, i, arr){
		if ( (i >= (resArray.length - lenOut - JOB_LINES_ADDITIONAL)) && (i < (resArray.length - lenOut))) return item;
	});
	
	console.log("---numArray----");
	console.log(numArray);
	
	console.log("---addArray----");
	console.log(addArray);
	
	// in overall view the short output is clickable while it's not in detailed job view
	var numText = "\n";
	if (lenOut == DASHBOARD_LINES) {
		var link_text = '<a class="link_to_job_dashboard" href=/job/' + node + '-migrate/>';
		if (textOriginal.lastIndexOf(link_text) == -1)
			numText = link_text;
	}
		
	numArray.forEach(function (item, i, arr) {
		numText = numText + item + "\n";
	});

	var addText = "\n";
	if (addArray.length > 0) addArray.forEach(function (item, i, arr) {
		addText = addText + '<div id="toggleText' + i + '" style="display: none"' + item.substring(4) + "\n";
	});

	if (lenOut == DASHBOARD_LINES) {
		numText = numText + "</a>"
	} 
	
	return numText;

}

function fetchNext2(e, href, spinnername, jobname, node, linesInLog) {

	checkOnline2(e, "/computer/" + node + "/", node);
	checkRunning2(e, "/job/" + node + "-migrate/lastBuild", "running-status" + node, node, spinnername);

	var idName = 'log-' + node;
	var headers = {};
	if (e.consoleAnnotator != undefined)
		headers["X-ConsoleAnnotator"] = e.consoleAnnotator;

	new Ajax.Request(href, {
		method : "post",
		parameters : {
			"start" : e.fetchedBytes
		},
		requestHeaders : headers,
		onComplete : function (rsp, _) {
			console.log("Start point fetchNext_function(rsp)");
			var stickToBottom = scroller.isSticking();

			var text = rsp.responseText;

			if (text === undefined)
				text = "";

			var textBeforeCoded = document.getElementById(idName).innerHTML;
			var textBefore = htmlEnDeCode.htmlDecode(textBeforeCoded);

			var textPlus = textBefore + text;

			var numText = parseText(textPlus, linesInLog , node);

			document.getElementById(idName).innerHTML = numText;
			
			var failedSymbol = text.lastIndexOf("Transfer process ended unsuccessfully");
			var firstSymbolErr = text.lastIndexOf("!!!");
			var firstSymbolProgress = text.lastIndexOf("\n%");
			var firstSymbolMsg = text.lastIndexOf(">>>");
			var firstSymbol = Math.max(firstSymbolErr, firstSymbolProgress, firstSymbolMsg);

			if (failedSymbol != -1) {
				firstSymbol = firstSymbolErr;
			}

			text = text.substring(firstSymbol + 1);
			var lastSymbol = text.indexOf("\n");

			/*
			
			p.outerHTML =  htmloutput  +
			'<br><form method="post" action="/jenkins/job/+Request%20Support/buildWithParameters?Topic=Task%20'+jobname+'%20failed&Request=Migration%20task%20failed%20see%20https://panel1.migrate2iaas.com/jenkins/job/' + jobname + '/lastBuild/logText/progressiveText%0a' + text.substring(0,  lastSymbol)+'" class="inline"><input type="hidden" name="extra_submit_param" value="extra_submit_value"><button type="submit" name="submit_param" value="submit_value" class="yui-button yui-submit-button submit-button">Report Error</button></form>'
			//                        p.outerHTML =  htmloutput  +
			//                              '<b><font size="3" color="red"><a href="/jenkins/job/+Request%20Support/buildWithParameters?Topic=Task%20'+jobname+'%20failed&Request=Migration%20task%20failed%20see%20http://54.164.23.220:8080/jenkins/job/' + jobname + '/lastBuild/logText/progressiveText%0a' + text.substring(0,  lastSymbol) + '">Report Error</a></font>  </b>' ;

			*/


			e.fetchedBytes = rsp.getResponseHeader("X-Text-Size");
			e.consoleAnnotator = rsp.getResponseHeader("X-ConsoleAnnotator");
			if (rsp.getResponseHeader("X-More-Data") == "true")
				setTimeout(function () {
					fetchNext2(e, href, spinnername, jobname, node, linesInLog);
				}, 6000); // refresh more often while working
			else
				$(spinnername).style.display = "none";
				// update running status if there is no more data left in console 
				checkOnline2(e, "/computer/" + node + "/", node);
				checkRunning2(e, "/job/" + node + "-migrate/lastBuild", "running-status" + node, node, spinnername);
		}

	});
}

function autorefresh(sec , element , node , linesInLog) {
	setTimeout(function () {
					// TODO: invalidate jenkins status (progress bar)
					fetchNext2(element, "/job/" + node + "-migrate/lastBuild/logText/progressiveText", "spinner-" + node, node + "-migrate", node, linesInLog);
					autorefresh(sec, element , node , linesInLog);
				}, sec*1000); 
}


function showLiveLog(element, node) {

	var dashRef = document.getElementsByClassName("dashboard");

	var linesInLog = JOB_LINES;
	var refresh = 60; // refresh once per 60 sec in console to ensure old data is cleaned up from the view

	if (dashRef.length > 0) {
		console.log("Dashboard view");
		linesInLog = DASHBOARD_LINES;
		refresh = 120; // refresh once per 2 mins in dashboard
	}

	var p = document.createElement("DIV");

	var htmloutput = '<table class="joboutput_table"><tr><td colspan="2" class="joboutput_log" id="log-' + node + '"></div></td></tr><tr><td class="joboutput_td_col1" id="st2-' + node + '">Loading...</td><td class="joboutput_td_col2" id="st1-' + node + '"></td></tr></table>';
	p.innerHTML = htmloutput;

	element.appendChild(p);

	element.fetchedBytes = 0;
	var oldURL = document.referrer; 
	var load_timeout = 0;
	if (oldURL.lastIndexOf("build") > 0) { 
		// it means we are here from the build screen meaning we should wait a bit and only then do refresh
		load_timeout = 15;
	}
	setTimeout(function () {
		fetchNext2(element, "/job/" + node + "-migrate/lastBuild/logText/progressiveText", "spinner-" + node, node + "-migrate", node, linesInLog);
		} , load_timeout * 1000 )
	// commented out autorefresh
	autorefresh(refresh , element , node , linesInLog);
}
showLiveLog($("out-" + document.currentScript.id), document.currentScript.id); // doesn't work in IE
