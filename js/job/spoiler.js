// this file implements spoiler logic for parameters screen
// (jquery required)

		jQuery(document).ready(function(){                
                  
                 // by this you can set specific id, or selector to specify an appropriate filter for nextUntil
                  jQuery(".separatorMarker").parents("tbody").addClass("separator");
                 // hide setting name field for better styling
               
                });

		jQuery(document).ready(function(){                
                  
                 // Here we collapse all inactive at startup
                  jQuery(".separatorMarker").parents("tbody")
                           .nextUntil(".separator")
                           .slideUp(300);              
                });

		jQuery(document).ready(function(){        
                 // Here we open active at startup
                   jQuery(".separatorMarker.active")
                          .parents("tbody")
                           .nextUntil(".separator")
                           .slideDown(300);      
                             
                });

   		jQuery(document).ready(function(){
			jQuery("p").click(function(){ // Here we change Active/Inactive by click
	
                        if(jQuery(this).hasClass("active")) {
                          jQuery(this).removeClass("active");
                          jQuery(this).parents("tbody")
                           .nextUntil(".separator")
                           .slideUp(300);
                        }else{
                          jQuery(this).addClass("active");
                          jQuery(this).parents("tbody")
                           .nextUntil(".separator")
                           .slideDown(300);

                        }
                   });
                });
