appContractSDSC.controller('administrationcontractController', ['$scope', 'fileUpload','commonvariable', function($scope, fileUpload,commonvariable){
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));
        var uploadUrl = "../../../upload/uploadFile";
        fileUpload.uploadFileToUrl(file, uploadUrl, $scope.name, $scope.folder);
    };
    $scope.loadfile=function(){
    	$scope.imgurl=commonvariable.Fileupload.url;
    };
}]);

