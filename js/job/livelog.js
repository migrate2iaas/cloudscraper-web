// The script schedules async updates of log data and puts log data into project description

// The script should have id tag equal to node name
// The script puts log data after the element by id out-${node}

 var scroller = new AutoScroller(document.body);
    

function checkOnline(e, href) {

var headers = {};
        if (e.consoleAnnotator!=undefined)
          headers["X-ConsoleAnnotator"] = e.consoleAnnotator;
 // check slave node online
           new Ajax.Request(href,{
	          method: "get",
	          parameters: {"start":e.fetchedBytes},
            requestHeaders: headers,
	          onComplete: function(rsp,_) {
        var text = rsp.responseText;
               var offlinemarker="Connect slave to Jenkins";
               var offline =   text.lastIndexOf(offlinemarker);
              var   htmloutput ="";
               if (offline!=-1 || rsp.status != 200) { htmloutput ="Agent is offline. Please restore connectivity, or reinstall the agent.";}
               else {  htmloutput ="Agent online."}
                      
                var p = document.createElement("DIV");
                e.appendChild(p); // Needs to be first for IE
              
                
                if (p.outerHTML) {    
                  p.outerHTML = htmloutput;
                  p = e.lastChild;
                }
                   else p.innerHTML = htmloutput;
                Behaviour.applySubtree(p);
               
               
               
            }

});
}


// checks whether it runs
function  checkRunning (e, href , statuselement) {
var headers = {};
        if (e.consoleAnnotator!=undefined)
          headers["X-ConsoleAnnotator"] = e.consoleAnnotator;
 // check slave node online
           new Ajax.Request(href,{
	          method: "get",
	          parameters: {"start":e.fetchedBytes},
            requestHeaders: headers,
	          onComplete: function(rsp,_) {
        var text = rsp.responseText;
               var workmarker="Build has been executing";
               var work =   text.lastIndexOf(workmarker);
              var   htmloutput ="";
              var buttonhtml = '<a id="'+statuselement+'" onclick="document.getElementById(\''+statuselement+'\').style.display=\'none\';new Ajax.Request(this.href); return false;" class="stop-button-link" href="'+href+'/stop"><img height="16" alt="[cancel]" width="16" class="stop-button-icon" src="/jenkins/static/f2b53f20/images/16x16/stop.png">Cancel Task</a>';
               if (work!=-1) { htmloutput = "&emsp;&emsp;"+buttonhtml;} 
	else { htmloutput= "&emsp;Idle.&emsp;"; }
                      
                var p = document.createElement("DIV");
                e.appendChild(p); // Needs to be first for IE
              
                
                if (p.outerHTML) {    
                  p.outerHTML = htmloutput;
                  p = e.lastChild;
                }
                   else p.innerHTML = htmloutput;
                Behaviour.applySubtree(p);
               
               
               
            }

});
 
}



function fetchNext(e,href,spinnername,jobname) {
        var headers = {};
        if (e.consoleAnnotator!=undefined)
          headers["X-ConsoleAnnotator"] = e.consoleAnnotator;

	      new Ajax.Request(href,{
	          method: "post",
	          parameters: {"start":e.fetchedBytes},
            requestHeaders: headers,
	          onComplete: function(rsp,_) {
              
              var stickToBottom = scroller.isSticking();

              var text = rsp.responseText;
              var failedSymbol= text.lastIndexOf("Transfer process ended unsuccessfully");
              var firstSymbolErr =   text.lastIndexOf("!!!");
              var firstSymbolProgress =   text.lastIndexOf("\n%");
              var firstSymbolMsg = text.lastIndexOf(">>>");
              var firstSymbol = Math.max(firstSymbolErr , firstSymbolProgress , firstSymbolMsg);
              
              if(failedSymbol!=-1){ 
                   firstSymbol = firstSymbolErr;
              }

              text = text.substring(firstSymbol + 1);
              var lastSymbol = text.indexOf("\n");

              if(firstSymbol!=-1) {
                var p = document.createElement("DIV");
                e.appendChild(p); // Needs to be first for IE

                // Use "outerHTML" for IE; workaround for:
                // http://www.quirksmode.org/bugreports/archives/2004/11/innerhtml_and_t.html
                if (p.outerHTML) {
                  if (lastSymbol < 0) {
                         lastSymbol = 100;
                  }
                  var htmloutput = '<br><pre>'+text.substring(0,  lastSymbol)  + '</pre>'  ;
                  if (firstSymbolErr==firstSymbol) {
                                      p.outerHTML =  htmloutput  + 
'<br><form method="post" action="/jenkins/job/+Request%20Support/buildWithParameters?Topic=Task%20'+jobname+'%20failed&Request=Migration%20task%20failed%20see%20https://panel1.migrate2iaas.com/jenkins/job/' + jobname + '/lastBuild/logText/progressiveText%0a' + text.substring(0,  lastSymbol)+'" class="inline"><input type="hidden" name="extra_submit_param" value="extra_submit_value"><button type="submit" name="submit_param" value="submit_value" class="yui-button yui-submit-button submit-button">Report Error</button></form>'
                               //                        p.outerHTML =  htmloutput  + 
                               //                              '<b><font size="3" color="red"><a href="/jenkins/job/+Request%20Support/buildWithParameters?Topic=Task%20'+jobname+'%20failed&Request=Migration%20task%20failed%20see%20http://54.164.23.220:8080/jenkins/job/' + jobname + '/lastBuild/logText/progressiveText%0a' + text.substring(0,  lastSymbol) + '">Report Error</a></font>  </b>' ;
                  }
                  p.outerHTML = htmloutput;
                  p = e.lastChild;
                }
                else p.innerHTML = text;
                Behaviour.applySubtree(p);
                if(stickToBottom) scroller.scrollToBottom();
              }

              e.fetchedBytes     = rsp.getResponseHeader("X-Text-Size");
              e.consoleAnnotator = rsp.getResponseHeader("X-ConsoleAnnotator");
	           if(rsp.getResponseHeader("X-More-Data")=="true")
	              setTimeout(function(){fetchNext(e,href,spinnername,jobname);},1000);
	          else
	              $(spinnername).style.display = "none";
	          }
	      });
	    }


	  
         function showLiveLog(element, node) {
	  element.fetchedBytes = 0;
                  checkOnline(element,"/jenkins/computer/"+node+"/");
	  checkRunning(element,"/jenkins/job/"+node+"-migrate/lastBuild" , "running-status"+node);
	  fetchNext(element,"/jenkins/job/"+node+"-migrate/lastBuild/logText/progressiveText", "spinner-"+node, node+"-migrate");

        }
        showLiveLog($("out-"+document.currentScript.id) , document.currentScript.id); // doesn't work in IE

