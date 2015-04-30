/*
 *	Architeture 
 * 	Helder Yesid Castrillón
 * 	Hisp Colombia 2014
 * 
 * Core Module for using WebApi of dhis2
 * It is the persistence in the FrontEnd
 * 
 * */
var Dhis2Api = angular.module("Dhis2Api", ['ngResource']);

//Create all common variables of the apps 
Dhis2Api.factory("commonvariable", function () {
	var dtformated="";
	var today = function() {
	    var datetoday = new Date();
	    dtformated=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate()); 
	};
	 today();
	var Vari={
			url:"http://localhost:8080/dhis/api/",
			urlbase:"http://localhost:8080/dhis/",
			urldownload:"http://localhost:8080/externalfiledhis/",
			urlupload:"../../../upload/uploadFile",
			folder:"Contratos",
			OrganisationUnit:"z37AIsY28kM",
			TypeEntity:"WkBTuQkUtRM",
			Program:"kmwWsj13wN0",
			programStage:"rQFeRuU0y2T",
			supervisionStage:"bvCkspOICM2",
			StartDate:'2015-01-01',
			EndDate:dtformated,
			DataElement:{"nContrato":"iIpswT0zho9","fContrato":"QkcfD67ZZhZ","rContrato":"B1UpXqZ48iX","rSupervision":"DUPFn7tCJJn","rEjecucion":"dJLaFwIe1bM"},
			DataelementSupervision:[{"supervisor1":"bdyUU11MQBn","vinculacion1":"mDYk4QpOLSq","fechainicio":"YC9IbrQlix8","fechafinal":"DQOjb8hiCLX","concepto1":"jzaNqIfFFpV"},
					{"supervisor2":"cz3VzXDTVEi","vinculacion2":"MhUG9XS39zU","concepto2":"UjMXtHCXK3u"},
					{"supervisor3":"koO1JoJAFez","vinculacion3":"YS6yVekNFLX","concepto3":"ALst2OpIGyz"},
					{"supervisor4":"wZQnL1ovhli","vinculacion4":"a2KuRUDCd4w","concepto4":"c0SZ2LyRAUf"},
					{"supervisor5":"AQLrFg5COzF","vinculacion5":"MADltBr37O4","concepto5":"nUlZSTZvFdr"}],
			Period:"",
			DataSet:"",
			Entity:"",
			Fileupload:{"status":"waiting"}
			};

   return Vari; 
});

Dhis2Api.factory("userAuthorization", ['$resource','commonvariable',function($resource,commonvariable) {
	return $resource(commonvariable.url + "me/authorization/:menuoption",
		{
			menuoption:'@menuoption'
		},
		{ get: { method: "GET", transformResponse: function (response) {return {status: response};}	}});

}]);

Dhis2Api.factory("Entity",['$resource','commonvariable', function ($resource,commonvariable) {
	return $resource( commonvariable.url+"trackedEntityInstances", 
	{te:'@te',
	ou:'@ou'},
  { get: { method: "GET"},
	post: { method: "POST"},
	remove: {method:'DELETE'}
  });
}]);

Dhis2Api.factory("TrackerEntityinProgram",['$resource','commonvariable', function ($resource,commonvariable) {
	return $resource( commonvariable.url+"trackedEntityInstances", 
	{te:'@te',
	ou:'@ou',
	program:'@program',
	ouMode:'@ouMode',
	programStatus:'@programStatus',
	eventStartDate:'@eventStartDate',
	eventEndDate:'@eventEndDate',
	eventStatus:'@eventStatus'},
  { get: { method: "GET"},
	post: { method: "POST"},
	remove: {method:'DELETE'}
  });
}]);
Dhis2Api.factory("TrackerEvent",['$resource','commonvariable', function ($resource,commonvariable) {
	return $resource( commonvariable.url+"events", 
	{orgUnit:'@orgUnit',
	programStage:'@programStage'
	},
  { get: { method: "GET"},
	post: { method: "POST"},
	remove: {method:'DELETE'}
  });
}]);
Dhis2Api.factory("SaveDataEvent",['$resource','commonvariable', function ($resource,commonvariable) {
	return $resource( commonvariable.url+"events/:uid", 
	null,
  { update: { method: "PUT"}
  });
}]);

Dhis2Api.factory("Optionset",['$resource','commonvariable', function ($resource,commonvariable) {
	return $resource( commonvariable.url+"optionSets/:uid", 
	{uid:'@uid'},
  { get: { method: "GET"}
  });
}]);
