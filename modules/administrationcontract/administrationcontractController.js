appContractSDSC.controller('administrationcontractController', ['$filter','$scope', 'fileUpload','commonvariable','$timeout', function($filter,$scope, fileUpload,commonvariable,$timeout){
	$scope.uploadFile = function(){

		var $translate = $filter('translate');
		
		var file = $scope.myFile;
		$scope.infofile=angular.fromJson(file);
        var uploadUrl = "../../../upload/uploadFile";
        fileUpload.uploadFileToUrl(file, uploadUrl, $scope.infofile.name, "Contratos");
        $scope.progress=0;
        $scope.showinfo=false;
        $scope.upactive="active";
        updateprocess();
	};
	function updateprocess() {
		switch (commonvariable.Fileupload.status){
			case "success":
				$scope.status="success";
				$scope.progress=100;
				$scope.showinfo=true;
				$scope.upactive="";
				break;
			case "error":
				$scope.status="error";
				$scope.progress=1;
				$scope.showinfo=true;
				break;
			default:
				break;	
	}
				
		if($scope.progress<30)
			$scope.progress = $scope.progress+1;
		if($scope.progress>=30 && $scope.progress<90)
			$scope.progress = $scope.progress + 1/2;
		if($scope.progress>=90 && $scope.progress<98)
			$scope.progress = $scope.progress + 1/10;
		if($scope.progress>=98 && $scope.progress<100)
			$scope.progress = $scope.progress + 1/100;
		if($scope.progress>=100)
			$scope.progress = 100;
		if($scope.progress<100 && commonvariable.Fileupload.status=="waiting")
			$timeout(updateprocess, 50);
      }
    $scope.loadfile=function(){
    	$scope.imgurl=commonvariable.Fileupload.url;
    };

    // Date datepicker
  $scope.today = function() {
    datetoday = new Date();
    $scope.dt=(datetoday.getDay()<=9?"0"+datetoday.getDay():datetoday.getDay())+"/"+(datetoday.getMonth()<=9?"0"+datetoday.getMonth():datetoday.getMonth())+"/"+datetoday.getFullYear();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };
  
   $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

 
}]);

