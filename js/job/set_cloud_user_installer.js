// filter clouds based on mask specified in the user name

// getting the user name
xmlhttp=new XMLHttpRequest();
xmlhttp.open("GET","/jenkins/me",false);
xmlhttp.send();
userpage= xmlhttp.responseText;
userid=userpage;
userid_mark="User ID: ";
userid_sym = userpage.lastIndexOf(userid_mark);
if (userid_sym != -1 ) {
           userid_sym = userid_sym + userid_mark.length;
           userid = userpage.substring(userid_sym);
           lastsym = userid.indexOf("</div>");
           userid = userid.substring(0,lastsym);
}

// checking if user name has cloud binding ( user~cloud )
cloudbind = userid.indexOf("~");
if (cloudbind != -1) {
  cloudbind=cloudbind + 1;
  cloudmask = userid.substring(cloudbind);
  // then change installer to the one that matches the cloud
  var href = "https://migrate2iaas.blob.core.windows.net/agent/cloudscraper-agent~"+cloudmask+".exe";
  var linkElement = document.getElementById('windowsAgentLink');
  linkElement.setAttribute('href', href);
}