appContractSDSC.controller('administrationcontractController', ['$scope','$modal','TrackerEntityinProgram','TrackerEvent','commonvariable', function($scope,$modal,TrackerEntityinProgram,TrackerEvent,commonvariable){
	
    $scope.findValue1 = function (events) {
		angular.forEach($scope.Entities.rows, function(eValue, eKey) {
		    angular.forEach(events, function (value, key) {
		        if (value.trackedEntityInstance == eValue[0]) {
					angular.forEach(commonvariable.DataElement, function(dValue, dKey) {
						angular.forEach(value.dataValues, function(vValue, vKey) {
							if(vValue.dataElement==dValue){
								$scope.Entities.rows[eKey][dKey]=vValue.value;
							}
						});
					});
					$scope.Entities.rows[eKey]['DataEvent'] = value;
					console.log($scope.Entities.rows[eKey]);
				}
			});
			
		});
			
    }
    
    $scope.logs = function (val) {
        console.log(val);
    }
    $scope.findValue = function () {
        angular.forEach($scope.Entities.rows, function (eValue, eKey) {

            TrackerEvent.get({
                orgUnit: commonvariable.OrganisationUnit,
                programStage: commonvariable.programStage,
                trackedEntityInstance: eValue[0]
            }).$promise.then(function (data) {
                var currentkey = eKey;
                $scope.trackerValues = data;
                var value = data.events[0];
                    angular.forEach(commonvariable.DataElement, function (dValue, dKey) {
                        angular.forEach(value.dataValues, function (vValue, vKey) {
                            if (vValue.dataElement == dValue) {
                                $scope.Entities.rows[eKey][dKey] = vValue.value;
                            }
                        });
                    });
                    $scope.Entities.rows[currentkey]['DataEvent'] = value;
                    console.log($scope.Entities.rows[currentkey]);
            });

        });
        
    }


	
	//find otroSi
	$scope.findOtrosi=function(){

		angular.forEach($scope.Entities.rows, function(eValue, eKey) {
						
				angular.forEach($scope.otrosilist.events, function(oValue, oKey) {
					if(eValue[0]==oValue.trackedEntityInstance){						
						$scope.numotrosi=0;	
						$scope.numruta=0;					
						angular.forEach(oValue.dataValues, function(oeValue, oeKey) {
							angular.forEach(commonvariable.DataElementOtroSI, function(dValue, dKey) {
								if(oeValue.dataElement==dValue.ruta){
									$scope.numruta++;									
								}
								if(oeValue.dataElement==dValue.codigo){
									$scope.numotrosi++;
								}
							});
						});
					}
				});
			if($scope.numruta==$scope.numotrosi)
				$scope.Entities.rows[eKey]["ruta"]=true;
			else 
				$scope.Entities.rows[eKey]["ruta"]=false;
			
			$scope.Entities.rows[eKey]["numotrosi"]=$scope.numotrosi;
		});
	}


	$scope.loadEventOtrosi=function(Stage,type){
		TrackerEvent.get({
			orgUnit:commonvariable.OrganisationUnit,
			programStage:commonvariable.otroSiStage
		}).$promise.then(function(data){
			$scope.otrosilist=data;	
			$scope.findOtrosi();		
		 });		
	};

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
		    $scope.Entities = data;
			$scope.numPages=data.metaData.pager.pageCount;
		    //$scope.loadInfomationEvent();
			$scope.findValue();
			// find otrosi
			$scope.loadEventOtrosi();
		 });
		
		
	}
	
	$scope.loadInfomationEvent=function(trackedstateid){
		TrackerEvent.get({
			orgUnit:commonvariable.OrganisationUnit,
			programStage: commonvariable.programStage,
			trackedEntityInstance: trackedstateid
		}).$promise.then(function(data){
			$scope.trackerValues=data;
			$scope.findValue1(data.events);
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
appContractSDSC.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $filter, fileUpload,commonvariable,$timeout,TrackerEntityinProgram,DataValue,SaveDataEvent,TrackerEvent,Optionset,Users,sendmailservice) {
	
	$scope.alerts=[];
	
	$scope.loadSupervisor=function(){
		Optionset.get({uid:'H6K1g3cTydR'}).$promise.then(function(data){
			$scope.listSupervisior=data.options;
		})};
	$scope.loadSupervisor();
	$scope.FindSupervisorCode=function(fcode,key){
		angular.forEach($scope.listSupervisior, function(lValue,lKey) {
			if(lValue.code==fcode){
				$scope.formListSupervision[key]=lValue.name;
				return 1;
			}
		});
		return 0;
	};

	$scope.contructsupervision=function(){
		$scope.formListSupervision=[];
		angular.forEach($scope.supervisionlist.events, function(sValue, sKey) {
			angular.forEach(sValue.dataValues, function(Value, Key) {
				angular.forEach(commonvariable.DataelementSupervision, function(dValue, dKey) {
						angular.forEach(dValue, function(iValue, iKey) {
							if(Value.dataElement==iValue){
								if(iKey.substring(0, 10)=='supervisor'){
									$scope.currentsupervisior=iKey.substring(10, 11);
									$scope.formListSupervision["number"+iKey.substring(10, 11)]=iKey.substring(10, 11);
									$scope.FindSupervisorCode(Value.value,iKey);
								}
								else
									$scope.formListSupervision[iKey]=Value.value;								
							}
						});
					});
			});
		});
	if($scope.currentsupervisior==5){
		$scope.showinfosupervision=false;
		$scope.showlistSupervision=true;
		$scope.alerts.push({type: 'danger', msg: 'No puede adicionar otro supervisor solo se permiten 5, por favor consulte con el equipo de soporte'});
	}
	};


	$scope.contructOtrosi=function(){
		$scope.formListOtrosi=[];
		var k=0;
		var code="";
		angular.forEach($scope.supervisionlist.events, function(sValue, sKey) {
			angular.forEach(sValue.dataValues, function(Value, Key) {				
				angular.forEach(commonvariable.DataElementOtroSI, function(dValue, dKey) {
						angular.forEach(dValue, function(iValue, iKey) {
							if(Value.dataElement==iValue){
								if($scope.formListOtrosi[dKey]==undefined)
									$scope.formListOtrosi[dKey]=[];
								if(iKey=="ruta"){
									if(Value.value=="")
										$scope.formListOtrosi[dKey][iKey]=undefined;
									else
										$scope.formListOtrosi[dKey][iKey]=commonvariable.urldownload+"/"+commonvariable.folder+"/"+Value.value;
								}
								else
									$scope.formListOtrosi[dKey][iKey]=Value.value;
												
							}
						});
					});
			});
		});
	};



	$scope.loadInfomationEvent=function(Stage,type,entity){
		TrackerEvent.get({
			orgUnit:commonvariable.OrganisationUnit,
			programStage:Stage,
			trackedEntityInstance:entity
		}).$promise.then(function(data){
			$scope.supervisionlist=data;
			if(type=="Supervision" || type=="ListContract")
				$scope.contructsupervision();
			else
				$scope.contructOtrosi();
		 });
		
	};

	$scope.typeattachselected= DataValue.typeattachselected;

	$scope.showinfocontract=false;
	$scope.showinfosupervision=false;
	$scope.showinfootrosi=false;
	$scope.showlistSupervision=false;
	$scope.showlistOtrosi=false;
	
	switch($scope.typeattachselected){
		case 'Contrato':
			$scope.showinfocontract=true;
			$scope.showinfosupervision=false;
			$scope.showinfootrosi=false;
			$scope.showlistSupervision=false;
			$scope.showlistOtrosi=false;
			break;
		case 'Supervision':
			$scope.loadInfomationEvent(commonvariable.supervisionStage,$scope.typeattachselected,DataValue.trackedEntityInstance);
			$scope.showinfocontract=false;
			$scope.showinfosupervision=true;
			$scope.showinfootrosi=false;
			$scope.showlistSupervision=false;
			$scope.showlistOtrosi=false;
			break;
		case 'Adicional - Otro Si':
			$scope.loadInfomationEvent(commonvariable.otroSiStage,$scope.typeattachselected,DataValue[0]);
			$scope.showinfocontract=false;
			$scope.showinfosupervision=false;
			$scope.showinfootrosi=true;
			$scope.showlistSupervision=false;
			$scope.showlistOtrosi=false;
			break;
		case 'ListContract':
			$scope.loadInfomationEvent(commonvariable.supervisionStage,$scope.typeattachselected,DataValue.trackedEntityInstance);
			$scope.showinfocontract=false;
			$scope.showinfosupervision=false;
			$scope.showinfootrosi=false;
			$scope.showlistSupervision=true;
			$scope.showlistOtrosi=false;
			break;
		case 'ListOtrosi':
			$scope.loadInfomationEvent(commonvariable.otroSiStage,$scope.typeattachselected,DataValue[0]);
			$scope.showinfocontract=false;
			$scope.showinfosupervision=false;
			$scope.showinfootrosi=false;
			$scope.showlistSupervision=false;
			$scope.showlistOtrosi=true;
			break;
	}
	$scope.uploadFile = function(){
	var $translate = $filter('translate');
		
		var file = $scope.myFile;
		$scope.infofile=angular.fromJson(file);
        var uploadUrl = commonvariable.urlupload;
        currentdate= new Date();
        $scope.filename= "Contrato-"+currentdate.getTime()+".pdf" //+ $scope.infofile.name;
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
    $scope.ContractDate=datetoday.getFullYear()+"-"+(datetoday.getMonth()<=9?"0"+datetoday.getMonth():datetoday.getMonth())+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate());
  	$scope.initDate=$scope.ContractDate;
  	$scope.endDate=$scope.ContractDate;


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
  $scope.openinitsup = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedinit = true;
  };
  $scope.openendsup = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedend = true;
  };


	  $scope.ok = function () {

		  var newEvent={
		  				"event":DataValue.event,
		  				"orgUnit":DataValue.orgUnit,
		  				"program":DataValue.program,
		  				"programStage":DataValue.programStage,
		  				"status":DataValue.status,
		  				"trackedEntityInstance":DataValue.trackedEntityInstance
		  			};

		  switch($scope.typeattachselected){
		  	case "Contrato":
	  			var newDataValue= {"dataValues":[
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
	  				}]};


	  				//save value
	  				if(DataValue.dataValues)
					  	newEvent['dataValues']=DataValue.dataValues;
				  	else
				  		newEvent['dataValues']=[];
				  
				  	var lim=newEvent.dataValues.length;
				  	angular.forEach(newDataValue.dataValues, function(value, key) {
					  	newEvent.dataValues[lim++]=value;
					});
				 	SaveDataEvent.update({uid:DataValue.event},newEvent);
				 	////	  				
	  		
		  		break;
		  case "Supervision":
		  		var newDataValue={"dataValues":[]};
		  		
				if($scope.supervisionlist.events[0].dataValues==undefined)
					 $scope.supervisionlist.events[0].dataValues=[];

				var lim=$scope.supervisionlist.events[0].dataValues.length;
				var pos=($scope.currentsupervisior==undefined?0:$scope.currentsupervisior)*1;
		  		angular.forEach(commonvariable.DataelementSupervision[pos], function(dValue, dKey) {
						if(dKey!="fechainicio"  && dKey!="fechafinal")
							$scope.supervisionlist.events[0].dataValues[lim++]={		
					  				"dataElement":dValue,
					  				"value":commonvariable.OptionSet[dKey.substring(0, dKey.length-1)].code,
					  				"providedElsewhere":false
					  				};

					});
		  		//Date of the contract
		  		var lim=$scope.supervisionlist.events[0].dataValues.length;
		  		if($scope.currentsupervisior==undefined){
		  			$scope.supervisionlist.events[0].dataValues[lim++]={		
				  				"dataElement":commonvariable.DataelementSupervision[0].fechainicio,
				  				"value":$scope.initDate,
				  				"providedElsewhere":false
				  				};
				  	$scope.supervisionlist.events[0].dataValues[lim++]={		
				  				"dataElement":commonvariable.DataelementSupervision[0].fechafinal,
				  				"value":$scope.endDate,
				  				"providedElsewhere":false
				  				};
		  		}
		  		SaveDataEvent.update({uid:$scope.supervisionlist.events[0].event},$scope.supervisionlist.events[0]);
				
				///send notification
				Users.get().$promise.then(function(data){
						angular.forEach(data.users, function(dvalue,dkey){
							if(dvalue.userCredentials.openId==commonvariable.OptionSet.supervisor.code){
								///

								var mensajesupervision='<h3> Estimado Supervisor : ' + dvalue.name+"</h3>";
								mensajesupervision+="<br> <h4> El presente correo es informativo y se le envía para notificarle que se le ha asignado la supervisión de un contrato, ";
								mensajesupervision+="recuerde que usted recibirá el oficio de asignación de supervisión prontamente. </h4>";
								mensajesupervision+="<br> Para ver los contratos asignados puede usted ingresar a la plataforma DHIS2 con sus credenciales siguiendo los pasos a continuación:"; 
								mensajesupervision+="<br> 1) ingresar a la plataforma DHIS2 en la dirección <a href='http://192.146.87.62/dhis/' target='_blank'>http://192.146.87.62/dhis/</a>"; 
								mensajesupervision+="<br> 2)  a continuación escriba su usuario y su contraseña"; 
								mensajesupervision+="<br> 3)  proceso a ingresar al modulo de supervisión, que se encuentra en el menú principal"; 
								mensajesupervision+="<br> Si tiene algun inconveniente para ingresar a la plataforma  DHIS2 le pedimos el favor de acercarse a la oficina de sistemas";
								mensajesupervision+="<br> gracias"; 

								///

								sendmailservice.post({},
									{to:dvalue.email,
									toname:"Supervisor - "+dvalue.name,
									fromname:'Sistema de radicación de contratos - Notificacion automatica',
									subject:'Correo informativo - Notificación de supervisión de contrato',
									message:mensajesupervision
									});
							}		

						});	 					
				 }); 
  		  	
	  		  	break;
			  
	    case "Adicional - Otro Si":
	    		var lim=$scope.supervisionlist.events[0].dataValues.length;
				$scope.supervisionlist.events[0].dataValues[lim++]={
	  				"dataElement":commonvariable.DataElementOtroSI[DataValue.numotrosi-1].ruta,
	  				"value":$scope.filename,
	  				"providedElsewhere":false
	  				}
	  			SaveDataEvent.update({uid:$scope.supervisionlist.events[0].event},$scope.supervisionlist.events[0]);


				///send notification
				Users.get().$promise.then(function(data){
						angular.forEach(data.users, function(dvalue,dkey){
							if(dvalue.userCredentials.openId==commonvariable.OptionSet.supervisor.code){
								///

								var mensajesupervision='<h3> Estimado Supervisor : ' + dvalue.name+"</h3>";
								mensajesupervision+="<br> <h4> El presente correo es informativo y se le envía para notificarle que se le registrado un otrosi al un contrato supervisado. </h4>";
								mensajesupervision+="<br> Para ver los contratos asignados puede usted ingresar a la plataforma DHIS2 con sus credenciales siguiendo los pasos a continuación:"; 
								mensajesupervision+="<br> 1) ingresar a la plataforma DHIS2 en la dirección <a href='http://192.146.87.62/dhis/' target='_blank'>http://192.146.87.62/dhis/</a>"; 
								mensajesupervision+="<br> 2)  a continuación escriba su usuario y su contraseña"; 
								mensajesupervision+="<br> 3)  proceso a ingresar al modulo de supervisión, que se encuentra en el menú principal"; 
								mensajesupervision+="<br> Si tiene algun inconveniente para ingresar a la plataforma  DHIS2 le pedimos el favor de acercarse a la oficina de sistemas";
								mensajesupervision+="<br> gracias"; 

								///

								sendmailservice.post({},
									{to:dvalue.email,
									toname:"Supervisor - "+dvalue.name,
									fromname:'Sistema de radicación de contratos - Notificación automática',
									subject:'Correo informativo - Notificación de OtroSI de contrato Supervisado',
									message:mensajesupervision
									});
							}		

						});	 					
				 }); 

	    		break;
		}
	    if($scope.typeattachselected=="Contrato"){
			  

		}
	     $modalInstance.close('success');
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };

	  

	$scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
	};
	});
