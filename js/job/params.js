// The script changes the parms on the page to 
// 1. fit a cloud 
// 2. make some parms more readable


clouds.getCloudNamesList = function(){
								var cloudNames = [];
								for (var i = 0; i < this.length; i++){
									cloudNames[i] = this[i].name;
								}
								return cloudNames;
							};
							
clouds.getCloudByName = function(cloudName){
	for (var i = 0; i < this.length; i++){
	  if (cloudName == this[i].name){
		 return this[i];
	   };
	}
};

function findProperty(doc, propertyName){
	var rows = document.getElementById('main-panel').getElementsByTagName('tbody');
	for (var i = 0; i < rows.length; i++){
		var parms = rows[i].getElementsByTagName('input');
		if (parms.length > 0){
		   var hiddenElement = parms[0];
			if (hiddenElement.getAttribute('value') == propertyName){
				var inputElement = hiddenElement.nextSibling;
				return inputElement;
			}	
		}
	}
}

function setPropertyTitle(doc, propertyName, newTitle){
	var inputElement = findProperty(doc, propertyName);
	if (inputElement) {
		var titleElement = inputElement.parentNode.parentNode.previousSibling;
		titleElement.innerHTML = newTitle;
	}
}

function setPropertyDescription(doc, propertyName, newDescription){
	var inputElement = findProperty(doc, propertyName);
	if (inputElement) {
		var rows = inputElement.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('setting-description');
		var descriptionElement = rows[0];
		descriptionElement.innerHTML = newDescription;
	}
}

function setChoiceListValues(doc, propertyName, valueList){
	var inputElement = findProperty (doc, propertyName);
	if (inputElement) {
		var str = '';
		for(var j = 0; j < valueList.length; j++){
			str += '<option value="' + valueList[j] + '">' + valueList[j] + '</option>';
		}
		inputElement.innerHTML = str;
	}
} 

function setPropertyValue(doc, propertyName, value){
	var inputElement = findProperty (doc, propertyName);
	if (inputElement) {
		inputElement.value = value;
	}
} 

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


var cloudList = findProperty(document, 'Cloud');
setChoiceListValues(document, 'Cloud', clouds.getCloudNamesList());
var cloud = clouds.getCloudByName(cloudList.value);
setChoiceListValues(document, 'Region', cloud.regions);
setPropertyTitle(document, 'Key', cloud.keyName);
setPropertyDescription(document, 'Key', cloud.keyDesc);
setPropertyTitle(document, 'SecretKey', cloud.secKeyName);
setPropertyDescription(document, 'SecretKey', cloud.secKeyDesc);


// filter parms due to cloud
cloudList.onchange =  function() {
		var cloud = clouds.getCloudByName(cloudList.value);
		setChoiceListValues(document, 'Region', cloud.regions);
		setPropertyTitle(document, 'Key', cloud.keyName);
                setPropertyDescription(document, 'Key', cloud.keyDesc);
		setPropertyTitle(document, 'SecretKey', cloud.secKeyName);
		setPropertyDescription(document, 'SecretKey', cloud.secKeyDesc);
	onServerChange();
};

// set more readable parm names
setPropertyTitle(document, 'Re_Upload', "Resume Previous Upload");
setPropertyTitle(document, 'ImageDirectory', "Folder to Store Images");
setPropertyTitle(document, 'NetworkShareUsername', "Network Share Username");
setPropertyTitle(document, 'NetworkSharePassword', "Network Share Password");
setPropertyTitle(document , 'RestorationPointList' , 'Choose Recovery Point   ');
// discard passwords
setPropertyValue(document , 'SecretKey' , '');
setPropertyValue(document , 'NetworkSharePassword' , '');
// AWS props
setPropertyTitle(document, 'AWS_Firewall', "Security Group");
setPropertyTitle(document, 'AWS_Availability_Zone', "Availability Zone");
setPropertyTitle(document, 'AWS_VPC', "VPC");
setPropertyTitle(document , 'AWS_VPC_Subnet' , 'VPC Subnet');
// onApp props:
setPropertyTitle(document , 'onApp_Disk_Zone' , 'Disk Zone');
// first run
onServerChange();
