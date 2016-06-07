.controller('conversorcabeceraisosController',
  ['$rootScope','$scope', '$location', 'conversorcabeceraisosModel','$uibModal','factoryParsing','conversorcabecerasModel','catalogosModel',
  function ($rootScope,$scope, $location, conversorcabeceraisosModel,$uibModal,factoryParsing,conversorcabecerasModel,catalogosModel) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conversorcabeceraisos';
    $scope.preloader = true;
    $scope.msjAlert = false;
    $scope.longitud =  128;
    $scope.bitmaps = [];
    $scope.nuevosChecks = [];
    $scope.itemsValidos = [];
    $scope.primeraVista = false;
    $scope.cuartaVista = false;
    $scope.vistaGuardarCabecera = true;
    $scope.datos = {};
    $scope.nuevoCatalogoIso = true;
    $scope.listaProcesos = [
        {
          name: 'Nuevo Catalogo ISO',
          value: 'nuevoCatalogoIso'
        }, 
        {
          name: 'Editar Catalogo ISO',
          value: 'editarCatalogoIso'
        },
        {
          name: 'Nuevo Formato ISO',
          value: 'nuevoFormatoIso'
        },
        {
          name: 'Editar Formato ISO',
          value: 'editarFormatoIso'
        }
    ];
    $scope.tiposCabecera = [
        {
          name: 'ENVIO',
          value: 'ENVIO'
        }, 
        {
          name: 'RESPUESTA',
          value: 'RESPUESTA'
        }
    ];
    $scope.procesSeleccionado = $scope.listaProcesos[0];
    $scope.cambioProceso = function(item){
        if(item.value == 'nuevoCatalogoIso'){
            $scope.nuevoCatalogoIso   =   true;
            $scope.editarCatalogoIso  =   false;
            $scope.nuevoFormatoIso    =   false;
            $scope.editarFormatoIso   =   false;       
        }else if(item.value == 'editarCatalogoIso'){
            $scope.nuevoCatalogoIso   =   false;
            $scope.editarCatalogoIso  =   true;
            $scope.nuevoFormatoIso    =   false;
            $scope.editarFormatoIso   =   false;      
        }else if(item.value == 'nuevoFormatoIso'){
            $scope.nuevoCatalogoIso   =   false;
            $scope.editarCatalogoIso  =   false;
            $scope.nuevoFormatoIso    =   true;
            $scope.editarFormatoIso   =   false; 
        }else{
            $scope.nuevoCatalogoIso   =   false;
            $scope.editarCatalogoIso  =   false;
            $scope.nuevoFormatoIso    =   false;
            $scope.editarFormatoIso   =   true; 
        }
    }
    var tramaOperadores = {
                            "Transaccion": {
                              "Cabecera": {
                                "Idioma": "EN",
                                "Aplicacion": "MC",
                                "Canal": "TELLER",
                                "CodigoBanco": "0010",
                                "IdEmpresa": "43591",
                                "Sucursal": "QUITO",
                                "Agencia": "270",
                                "CodigoCaja": "005",
                                "Usuario": "userempresa",
                                "Codigo": "CONSULTAR-SWITCHOPERADOR"
                              },
                              "Detalle": {
                                //"Id_Operador": "10002",
                                "FuenteInformacion": "SWITCH",
                                "FuenteRegistrador": "SWITCH"

                              }
                            }
                          };
    factoryParsing.obtenerOperadores(JSON.stringify(tramaOperadores)).then(function(operadores){
        $scope.allOperadores = operadores.Respuesta;
        $scope.datos.operador = $scope.allOperadores[1];
        factoryParsing.obtenerOperadoresCabeceraIso().then(function(otrosOperadores){
            $scope.otrosOperadores = [];
            for(prop in $scope.allOperadores){
              for(p in otrosOperadores){
                if(otrosOperadores[p].ValorDefault == $scope.allOperadores[prop].Id_Operador){
                   $scope.otrosOperadores.push({Operador:$scope.allOperadores[prop].Operador,Id_Operador:otrosOperadores[p].ValorDefault,IdFormato:otrosOperadores[p].IdFormato});
                }
              }
            }
            $scope.datos.otroOperador = $scope.otrosOperadores[0];
            //console.log(otrosOperadores);
        });
    });
    
    $scope.tipoCabecera = $scope.tiposCabecera[0];
    catalogosModel.findById('ISO8583TIPOVALOR').then(function(data){
        $scope.tiposValor = [];
        for(prop in data){
           $scope.tiposValor.push({name:data[prop].TABLAArgumento+' | '+data[prop].TABLADescripcion,value:data[prop].TABLAArgumento});
        }
        $scope.tipoValor = $scope.tiposValor[0];
    });

    catalogosModel.findById('ISO8583TIPOCAMPO').then(function(data){
        $scope.tiposCampo = [];
        for(prop in data){
           $scope.tiposCampo.push({name:data[prop].TABLAArgumento+' | '+data[prop].TABLADescripcion,value:data[prop].TABLAArgumento});
        }
        $scope.tipoCampo = $scope.tiposCampo[0];
    });
    $scope.mostrarFormatos = function(items){
        factoryParsing.obtenerFormatos({Id_Operador:items.Id_Operador}).then(function(result){
            $scope.formatosPorOperador = result;
            $scope.datos.formato =  $scope.formatosPorOperador[0];
        });

    }
    var divInputs = function(){
        var cont = 0,flag=false;
        for (var i = 1; i <= $scope.longitud; i++) {
          cont++;
          if(i % 32 == 0){
            flag = true;
          }
          var ceros="";
          var inicio = String(i).length;
          inicio = parseInt(inicio);
          for(var x = inicio;x < 3 ; x++){
              ceros += '0';
          }
          var validar = false,disabled = false;
          if(i <= 64){
              validar = true;
          }
          if(i == 65){
              disabled = true;
          }
          $scope.bitmaps.push({name:cont,value:ceros+i,orden:i,check:false,validar:validar,disabled:disabled}); 
          $scope.nuevosChecks.push({name:cont,value:ceros+i,orden:i,check:false,validar:true,disabled:true});  
          if(flag){
             flag = false;
             cont = 0;
          } 
          
        }
    }
    divInputs();
    $scope.cambioValoresChecks = function(){
      $scope.bitmaps = [];
      divInputs();
    }
    $scope.addChecksValidos = function(item){
        if(item.orden == 1 && item.check){
          for (var i = 64; i < 128; i++) {
               $scope.bitmaps[i].validar = true;
          }
        }
        if(item.orden == 1 && !item.check){
          for (var i = 64; i < 128; i++) {
               var tmpIdx = $scope.itemsValidos.indexOf($scope.bitmaps[i]);
               if(tmpIdx != -1){
                  $scope.itemsValidos.splice(tmpIdx, 1);
               }
               $scope.bitmaps[i].validar = false;
               $scope.bitmaps[i].check = false;
          }
        }
        var idx = $scope.itemsValidos.indexOf(item);
        if(idx != -1){
          $scope.itemsValidos.splice(idx, 1);
        }else{
          $scope.itemsValidos.push(item);
        }
        
    }
     $scope.addChecksAsignacion = function(item){
        var idx = -1;
        for (l in  $scope.itemsParaDetalle) {
              if(item.orden == $scope.itemsParaDetalle[l].orden){
                  idx = l;
              } 
        }
        if(idx != -1){
          $scope.itemsParaDetalle.splice(idx, 1);
        }else{
          $scope.itemsParaDetalle.push(item);
        } 
        
    }
    $scope.eliminarData = function(item){
      var idx = $scope.itemsValidos.indexOf(item);
      $scope.itemsValidos.splice(idx, 1);
      var idx2 = $scope.bitmaps.indexOf(item);
      $scope.bitmaps[idx2].check = false;
    }
    
    $scope.descripcion = true;
    $scope.habilitarEdicion = function(arg,index){
          var execute = '$scope.itemsValidos['+index+'].mostrarLabel'+arg+' = false';
          var execute2 = '$scope.itemsValidos['+index+'].mostrarText'+arg+' = true';
          eval(execute);
          eval(execute2);
    }
    $scope.bloquearEdicion = function(arg,index){
          var execute = '$scope.itemsValidos['+index+'].mostrarLabel'+arg+' = true';
          var execute2 = '$scope.itemsValidos['+index+'].mostrarText'+arg+' = false';
          eval(execute);
          eval(execute2);
          if($scope.itemsValidos[index].longitud == ''){
              $scope.itemsValidos[index].longitud = 0;
          }
    }
    $scope.siguiente = function(){
      $scope.itemsParaDetalle = [];
      factoryParsing.obtenerCatalogos({id:0}).then(function(resp){
          for (var i=0; i < resp.length; i++) {
                for (var j=0; j < $scope.itemsValidos.length; j++) {
                  if (resp[i].Bitmap == $scope.itemsValidos[j].orden) {
                      $scope.itemsValidos[j].nombre = resp[i].Nombre;
                      $scope.itemsValidos[j].tipo = $scope.tipoCampo;
                      $scope.itemsValidos[j].tipoValor = $scope.tipoValor;
                      $scope.itemsValidos[j].longitud = resp[i].Longitud;
                      $scope.itemsValidos[j].descripcion = resp[i].Descripcion;
                      $scope.itemsValidos[j].mostrarTextLongitud = false;
                      $scope.itemsValidos[j].mostrarLabelLongitud = true;
                      $scope.itemsValidos[j].mostrarTextDescripcion = false;
                      $scope.itemsValidos[j].mostrarLabelDescripcion = true;
                      $scope.itemsValidos[j].mostrarTextNombre = false;
                      $scope.itemsValidos[j].mostrarLabelNombre = true;
                  }
                }
          }
          $scope.itemsValidos.sort(function(a, b) {
              return parseFloat(a.orden) - parseFloat(b.orden);
          });
          $scope.primeraVista = false;
          $scope.terceraVista = true;
      });
      var tmpBinario1 = '';
      var tmpBinario2 = '';
      for(p in $scope.bitmaps){
        if($scope.bitmaps[p].orden <= 64){
           if($scope.bitmaps[p].check){
              tmpBinario1 += '1';
           }else{
              tmpBinario1 += '0';
           }
        }else{
           if($scope.bitmaps[0].check){
              if($scope.bitmaps[p].check){
                  tmpBinario2 += '1';
              }else{
                  tmpBinario2 += '0';
              }
              if(tmpBinario2 == '0000000000000000000000000000000000000000000000000000000000000000'){
                  console.log('esta marcado pero no hay seleccion');
                  tmpBinario1 = tmpBinario1.replace('1','0'); 
              }
           }else{
              tmpBinario2 = '0000000000000000000000000000000000000000000000000000000000000000'
              tmpBinario2 = '0000000000000000000000000000000000000000000000000000000000000000'
              break;
           }
        }
      }
     
      console.log(tmpBinario1);
      console.log(tmpBinario2);
      console.log('--------------');
      $scope.valorHexadecimal1 = ConvertBase.binaryToHex(tmpBinario1);
      console.log($scope.valorHexadecimal1.result);
      $scope.valorHexadecimal2 = ConvertBase.binaryToHex(tmpBinario2);
      console.log($scope.valorHexadecimal2.result);
    } 
    $scope.siguienteCuartaVista = function(){
      console.log($scope.itemsParaDetalle);
    }
    $scope.guardarCabecera = function(){
        var conversorCabeceras = conversorcabecerasModel.create();
        conversorCabeceras.NombreFormato = $scope.nombreCabecera;
        conversorCabeceras.DescripcionFormato = $scope.descripcionCabecera;
        conversorCabeceras.Cabecera = false;
        conversorCabeceras.Pie = false;
        conversorCabeceras.Separador = '';
        conversorCabeceras.FormatoConversion = 0;
        conversorCabeceras.Formato_destino = false;
        var tipoProceso = '',tipoConversion = '';
        if($scope.tipoCabecera.name == 'ENVIO'){
          tipoProceso = 'IN';
          tipoConversion = 'PROCESO,ISO8583';
        }else{
          tipoProceso = 'OUT';
          tipoConversion = 'ISO8583,PROCESO';
        }
        conversorCabeceras.Tipo_Proceso = tipoProceso;
        conversorCabeceras.NombreObjeto = '';
        conversorCabeceras.estado = 'ACTIVO';
        conversorCabeceras.tipo_archivo_salida = 'STRING';
        conversorCabeceras.ORIENTACION = '';
        conversorCabeceras.RutinaPrevalidacion = '';
        conversorCabeceras.Unificador = '|';
        conversorCabeceras.Check_Totales_Por = '';
        conversorCabeceras.ValidaIdentificacion = true;
        conversorCabeceras.RutinaPreconversion = '';
        conversorCabeceras.InfiereTipoIdCliente = false;
        conversorCabeceras.MuestraCabeceraColumna = false;
        conversorCabeceras.TipoConversion = tipoConversion;
        /*conversorCabeceras.save().then(function(r){
            $scope.primeraVista = true;
            $scope.vistaGuardarCabecera = false;
            console.log(r);
        });*/
         $scope.primeraVista = true;
            $scope.vistaGuardarCabecera = false;
    }
    $scope.validarFormato = function(arg,index){
      if(arg <= 0 || arg > 999){
          $scope.itemsValidos[index].longitud = '';
      }
    }
    $scope.guardarDatos = function(){
        $scope.dataEnviar = [];

        for(prop in $scope.itemsValidos){
           $scope.dataEnviar.push({Id_Operador:16,Bitmap:$scope.itemsValidos[prop].orden,Nombre:$scope.itemsValidos[prop].nombre,Tipo:$scope.itemsValidos[prop].tipo.value,Longitud:$scope.itemsValidos[prop].longitud,Descripcion:$scope.itemsValidos[prop].descripcion,TipoDato:$scope.itemsValidos[prop].tipoValor.value});
        }
        /*ya hecho no borrar solo descomentar factoryParsing.grabarCatalogosISO(dataEnviar).then(function(r){
            console.log(r);
        });*/
       
        for(xx in $scope.nuevosChecks){
          $scope.nuevosChecks[xx].class = false;
          for(var x = 0; x < $scope.itemsValidos.length; x++){
            if($scope.itemsValidos[x].orden == $scope.nuevosChecks[xx].orden){
                  $scope.nuevosChecks[xx].disabled = false;
                  $scope.nuevosChecks[xx].class = true;
                  $scope.nuevosChecks[xx].check = true;
                  $scope.itemsParaDetalle.push($scope.itemsValidos[x]);
            }
          }
         
        }
        $scope.terceraVista  = false;
        $scope.cuartaVista  = true;
    }
    $scope.anterior = function(){
      $scope.primeraVista = true;
      $scope.terceraVista = false;
      $scope.cuartaVista = false;
    }
    $scope.anteriorCuartaVista = function(){
      $scope.terceraVista = true;
      $scope.cuartaVista = false;
    }
    conversorcabeceraisosModel.getAll().then(function(data) {
      $scope.conversorcabeceraisosList = data;
      $scope.conversorcabeceraisosTemp = angular.copy($scope.conversorcabeceraisosList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversorcabeceraisos/modalCreate.html',
        controller: 'modalconversorcabeceraisosCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conversorcabeceraisosList.push(data);
           $scope.conversorcabeceraisosTemp = angular.copy($scope.conversorcabeceraisosList);
        }
      },function(result){
      $scope.conversorcabeceraisosList = $scope.conversorcabeceraisosTemp;
      $scope.conversorcabeceraisosTemp = angular.copy($scope.conversorcabeceraisosList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/conversorcabeceraisos/modalDelete.html',
      controller: 'modalconversorcabeceraisosDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conversorcabeceraisosList.indexOf(data);
      $scope.conversorcabeceraisosList.splice(idx, 1);
      conversorcabeceraisosModel
        .destroy(data._id)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])