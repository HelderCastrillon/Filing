appContractSDSC.controller('administrationcontractController', ['$scope','$modal','TrackerEntityinProgram','TrackerEvent','commonvariable', function($scope,$modal,TrackerEntityinProgram,TrackerEvent,commonvariable){
	
	$scope.findValue=function(events){
		angular.forEach($scope.Entities.rows, function(eValue, eKey) {
			angular.forEach(events, function(value, key) {
				if(value.trackedEntityInstance==eValue[0]){
					angular.forEach(commonvariable.DataElement, function(dValue, dKey) {
						angular.forEach(value.dataValues, function(vValue, vKey) {
							if(vValue.dataElement==dValue){
								$scope.Entities.rows[eKey][dKey]=vValue.value;
							}
						});
					});
					$scope.Entities.rows[eKey]['DataEvent']=value;
				}
			});
		console.log($scope.Entities.rows);
		});
			
	}
	
	$scope.search="";
	$scope.loadlistentities=function(nextpage){
		if($scope.search){
			$scope.likesearch="LIKE:"+$scope.search
		}
		TrackerEntityinProgram.get({
			te:commonvariable.TypeEntity,
			ou:commonvariable.OrganisationUnit,
			program:commonvariable.Program,
			ouMode:'SELECTED',
			programStatus:'ACTIVE',
			eventStartDate:commonvariable.StartDate,
			eventEndDate:commonvariable.EndDate,
			eventStatus:'ACTIVE',
			page:nextpage,
			query:$scope.likesearch
		}).$promise.then(function(data){
			$scope.Entities=data;
			$scope.numPages=data.metaData.pager.pageCount;
			$scope.loadInfomationEvent();
		 });
		
		
	}
	
	$scope.loadInfomationEvent=function(){
		TrackerEvent.get({
			orgUnit:commonvariable.OrganisationUnit,
			programStage:commonvariable.programStage
		}).$promise.then(function(data){
			$scope.trackerValues=data;
			$scope.findValue(data.events);
		 });
		
	}
	$scope.loadlistentities(1);
	
	
	 $scope.range = function(n) {
	        return new Array(n);
	    };
	
	      $scope.openAddinfo = function (size,typeattachselected,link,DataEvent) {
	    	  if(link){
	    		  var nLink=commonvariable.urldownload + commonvariable.folder+"/"+link
	    		  window.open(nLink);
	    		  
	    	  }
	    	  else{
		        var modalInstance = $modal.open({
		          templateUrl: 'myModalContent.html',
		          controller: 'ModalInstanceCtrl',
		          size: size,
		          resolve: {
		            DataValue: function () {
		            	DataEvent['typeattachselected']=typeattachselected;
		            	return DataEvent;
		            }
		          }
		        });
		    
		    modalInstance.result.then(function (responseSuccess) {
		    	console.log(responseSuccess); 
		    	$scope.loadlistentities(1);
		    }, function (responseCancel) {
		    	console.log(responseCancel);
		          });
		        };
	      }
	        
	     


}]);
appContractSDSC.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $filter, fileUpload,commonvariable,$timeout,TrackerEntityinProgram,DataValue,SaveDataEvent) {
	
	$scope.typeattachselected= DataValue.typeattachselected;
	$scope.uploadFile = function(){
	var $translate = $filter('translate');
		
		var file = $scope.myFile;
		$scope.infofile=angular.fromJson(file);
        var uploadUrl = commonvariable.urlupload;
        currentdate= new Date();
        $scope.filename= currentdate.getTime()+"-" + $scope.infofile.name;
        fileUpload.uploadFileToUrl(file, commonvariable.urlupload,$scope.filename, commonvariable.folder);
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
    $scope.ContractDate=(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate())+"/"+(datetoday.getMonth()<=9?"0"+datetoday.getMonth():datetoday.getMonth())+"/"+datetoday.getFullYear();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.ContractDate = null;
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


	  $scope.ok = function () {
		  var newEvent={
	  				"event":DataValue.event,
	  				"orgUnit":DataValue.orgUnit,
	  				"program":DataValue.program,
	  				"programStage":DataValue.programStage,
	  				"status":DataValue.status,
	  				"trackedEntityInstance":DataValue.trackedEntityInstance,
	  				"dataValues":[
	  				{
	  				"dataElement":commonvariable.DataElement.nContrato,
	  				"value":$scope.ContractNumber,
	  				"providedElsewhere":false
	  				},
	  				{
	  				"dataElement":commonvariable.DataElement.fContrato,
	  				"value":$scope.ContractDate,
	  				"providedElsewhere":false
	  				},
	  				{
	  				"dataElement":commonvariable.DataElement.rContrato,
	  				"value":$scope.filename,
	  				"providedElsewhere":false
	  				}
	  				]
	  				
	  		};
		  SaveDataEvent.update({uid:DataValue.event},newEvent);
	    $modalInstance.close('success');
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	});
