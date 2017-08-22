// The script schedules async updates of log data and puts log data into project description

// The script should have id tag equal to node name
// The script puts log data after the element by id out-${node}

 var scroller = new AutoScroller(document.body);
    
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
              var firstSymbolMsg = -1;//text.lastIndexOf(">>>"); turn of for now
              var firstSymbol = Math.max(firstSymbolErr , firstSymbolProgress , firstSymbolMsg);
              
              if(failedSymbol!=-1){ 
                   firstSymbol = firstSymbolErr;
              }

              text = text.substring(firstSymbol + 1);
              var lastSymbol = text.indexOf("\n");

                var p = document.createElement("DIV");
                e.appendChild(p); // Needs to be first for IE

                // Use "outerHTML" for IE; workaround for:
                // http://www.quirksmode.org/bugreports/archives/2004/11/innerhtml_and_t.html
                if (p.outerHTML) {
                  var htmloutput = '.'  ;
                  if (firstSymbol > 0) {
		htmloutput = '<br><pre>'+text.substring(0,  lastSymbol)  + '</pre>'  ;
		 if (firstSymbolErr==firstSymbol) {
                                      htmloutput =  htmloutput  + 
		'<br><form method="post" action="/jenkins/job/+Request%20Support/buildWithParameters?Topic=Task%20'+jobname+'%20failed&Request=Migration%20task%20failed%20see%20https://panel1.migrate2iaas.com/jenkins/job/' + jobname + '/lastBuild/logText/progressiveText%0a' + text.substring(0,  lastSymbol)+'" class="inline"><input type="hidden" name="extra_submit_param" value="extra_submit_value"><button type="submit" name="submit_param" value="submit_value" class="yui-button yui-submit-button submit-button">Report Error</button></form>'
                               //                        p.outerHTML =  htmloutput  + 
                               //                              '<b><font size="3" color="red"><a href="/jenkins/job/+Request%20Support/buildWithParameters?Topic=Task%20'+jobname+'%20failed&Request=Migration%20task%20failed%20see%20http://54.164.23.220:8080/jenkins/job/' + jobname + '/lastBuild/logText/progressiveText%0a' + text.substring(0,  lastSymbol) + '">Report Error</a></font>  </b>' ;
	                  }

                  }
                                   
                // FIND "+" symbols
                 var strings = text.split("\n");
                 var arrayLength = strings.length;
	for (var i = 0; i < arrayLength; i++) {
		   if (strings[i].startsWith("++")) {
		      htmloutput = htmloutput + "<br>" + strings[i];
		  }
	}

                  p.outerHTML = htmloutput;
                  p = e.lastChild;
                }
                else p.innerHTML = text;
                Behaviour.applySubtree(p);
                if(stickToBottom) scroller.scrollToBottom();
              

              e.fetchedBytes  = rsp.getResponseHeader("X-Text-Size");
              e.consoleAnnotator = rsp.getResponseHeader("X-ConsoleAnnotator");
	           if(rsp.getResponseHeader("X-More-Data")!="true" || )
	              $(spinnername).style.display = "none";
	          else
	              setTimeout(function(){fetchNext(e,href,spinnername,jobname);},5000);
	          }
	      });
	    }


	  
         function showLiveLog(element, node) {
	  element.fetchedBytes = 0;
	  fetchNext(element,"/jenkins/job/"+node+"/lastBuild/logText/progressiveText", "spinner-"+node, node);

        }
        showLiveLog($("out-"+document.currentScript.id) , document.currentScript.id); // doesn't work in IE

