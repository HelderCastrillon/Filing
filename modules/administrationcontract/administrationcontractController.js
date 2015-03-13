appContractSDSC.controller('administrationcontractController', ['$scope', 'fileUpload','commonvariable', function($scope, fileUpload,commonvariable){
	$scope.progressvalue=0;
	$scope.uploadFile = function(){
		var file = $scope.myFile;
		$scope.infofile=angular.fromJson(file);
        var uploadUrl = "../../../upload/uploadFile";
        fileUpload.uploadFileToUrl(file, uploadUrl, $scope.infofile.name, "Contratos");
	};
    $scope.loadfile=function(){
    	$scope.imgurl=commonvariable.Fileupload.url;
    };
 
}]);

