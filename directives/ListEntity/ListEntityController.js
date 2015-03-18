Dhis2Api.directive('d2Dropdownlistentity', function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/ListEntity/ListEntityView.html'
	}
	}); 
Dhis2Api.controller("d2DroplistrentityController", ['$scope','$http', 'Entity',"commonvariable",function ($scope, $http,Entity,commonvariable) {
		
	$scope.findEntitybyName = function(nameCt) {
			return Entity.get({te:"WkBTuQkUtRM",ou:"z37AIsY28kM",filter:"eax4yJM6RvI:like:"+nameCt})
			.$promise.then(function(response){
				return  response.rows;
			 })};
	$scope.onSelect = function ($item, $model, $label) {
			commonvariable.entity = $item;
		   };

}]);