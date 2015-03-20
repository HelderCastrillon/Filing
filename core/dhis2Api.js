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

	var Vari={
			url:"http://localhost:8080/dhis/api/",
			urlbase:"http://localhost:8080/dhis/",
			OrganisationUnit:"z37AIsY28kM",
			TypeEntity:"WkBTuQkUtRM",
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
