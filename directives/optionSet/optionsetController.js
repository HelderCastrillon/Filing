Dhis2Api.directive('d2Dropdownoptionset', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/optionSet/optionsetView.html',
		scope:{
			uidoption:'@uidoption',
			placeholder:'@placeholder',
			optionvalue:'@optionvalue'
		}
	}
	}); 
Dhis2Api.controller("d2DropdownOptionSetController", ['$scope','Optionset',"commonvariable", function ($scope,Optionset,commonvariable) {
	$scope.optionSelected=undefined;
	$scope.options=[];
	Optionset.get({uid:$scope.uidoption}).$promise.then(function(response){
		$scope.options=response.options;
	});
	$scope.onSelect = function ($item, $model, $label) {
			commonvariable.OptionSet[$scope.optionvalue] = $item;
		   };

}]);