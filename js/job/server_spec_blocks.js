//When changed server should run this function
//Blocks should be marked with additional class equal to the name of server in the list i.e. EC2
//Script hides and shows particular blocks on the basis of chosen server
 		
function onServerChange() {
//Here we hide/show server-specific blocks

  var cloud = clouds.getCloudByName(cloudList.value);

   for ( var i = 0, l = clouds.length; i < l; i++ ) {
    if(jQuery(".separatorMarker").hasClass(clouds[ i ].name)) 
         if(cloud.name != clouds[ i ].name)   { 
          //Should be hidden
           var t = ".separatorMarker."+clouds[ i ].name;
            jQuery(t).parents("tbody").hide();
            if(jQuery(t).hasClass("active")) {
              jQuery(t).removeClass("active");
              jQuery(t).parents("tbody")
                           .nextUntil(".separator")
                           .hide();   
             }

           } else { // should be shown
           var t = ".separatorMarker."+clouds[ i ].name;
           jQuery(t).parents("tbody").show();
           }
    }

}
