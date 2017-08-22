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
  // then remove all clouds \regions that doesn't apply to the mask
  for (var i = clouds.length - 1 ; i >= 0 ; i--){
     // iterate thru regions and test against mask
      for (var j =  clouds[i].regions.length -1 ; j >= 0 ; j--) {
            if (clouds[i].regions[j].indexOf(cloudmask) == -1) {
                 clouds[i].regions.splice(j, 1);
            }
      }
    // remove the cloud if no regions left
    if (clouds[i].regions.length == 0) {
          clouds.splice(i, 1);
    }
  }
}