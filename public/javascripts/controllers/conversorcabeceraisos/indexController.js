.controller('conversorcabeceraisosController',
  ['$rootScope','$scope', '$location', 'conversorcabeceraisosModel','$uibModal','factoryParsing','conversorcabecerasModel','catalogosModel','$route','$ngBootbox',
  function ($rootScope,$scope, $location, conversorcabeceraisosModel,$uibModal,factoryParsing,conversorcabecerasModel,catalogosModel,$route,$ngBootbox) {
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
    $scope.flagFix = false;
    $scope.msjAlertEliminarCatalogo = false;
    $scope.deshabilitarBtnNuevoCatalogo = true;
    $scope.tablaConversorDetalleVista = false;
    $scope.longitudInput = 128;
    $scope.cambioPaginacion = function(dato){
      $rootScope.configTable.itemsPerPage =  dato.value;
    }
    $scope.listaPaginados = [
        {
          name: '5',
          value: '5'
        }, 
        {
          name: '10',
          value: '10'
        }, 
        {
          name: '15',
          value: '15'
        }, 
        {
          name: '20',
          value: '20'
        }
    ];

    $scope.valorPaginacion = $scope.listaPaginados[0];
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
        factoryParsing.obtenerOperadoresCabeceraIso().then(function(otrosOperadores){
            $scope.otrosOperadores = [];
            $scope.allOperadores = [];
            var existe = false;
            for(prop in operadores.Respuesta){
              existe = false
              for(p in otrosOperadores){
                if(otrosOperadores[p].Id_Operador == operadores.Respuesta[prop].Id_Operador){
                   $scope.otrosOperadores.push({Operador:operadores.Respuesta[prop].Operador,Id_Operador:otrosOperadores[p].Id_Operador});
                }
                if(operadores.Respuesta[prop].Id_Operador == otrosOperadores[p].Id_Operador){
                   existe = true;
                }
              }
              if(!existe){
                  $scope.allOperadores.push(operadores.Respuesta[prop]);
              }
            }
            $scope.datos.otroOperador = $scope.otrosOperadores[0];
            $scope.datos.operador = $scope.allOperadores[1];
            $scope.deshabilitarBtnNuevoCatalogo = false;
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

    var desCheckBitmaps = function(){
        for(i in $scope.bitmaps){
            $scope.bitmaps[i].check = false;  
        }
        for(i=64;i < 128;i++){
            $scope.bitmaps[i].validar = false;  
        }
        $scope.itemsValidos = [];
    } 
     $scope.cambioProceso = function(item){
        if(item.value == 'nuevoCatalogoIso'){
            desCheckBitmaps();
            $scope.nuevoCatalogoIso   =   true;
            $scope.editarCatalogoIso  =   false;
            $scope.nuevoFormatoIso    =   false;
            $scope.editarFormatoIso   =   false;       
        }else if(item.value == 'editarCatalogoIso'){
            $scope.preloader = true; 
            factoryParsing.obtenerDetalleCatalogos($scope.otrosOperadores).then(function(data){
                $scope.listaCatalogosDetalles = data;
                $scope.listaCatalogosDetalles.sort(function(a, b) {
                    return parseFloat(a.Bitmap) - parseFloat(b.Bitmap);
                });
                var campos = 0;
                for(uu in $scope.otrosOperadores){
                  campos = 0;
                  for(vv in data){
                    if(data[vv].Id_Operador == $scope.otrosOperadores[uu].Id_Operador){
                        campos++;
                    }
                  }
                  $scope.otrosOperadores[uu].campos = campos;
                }
                $scope.nuevoCatalogoIso   =   false;
                $scope.editarCatalogoIso  =   true;
                $scope.nuevoFormatoIso    =   false;
                $scope.editarFormatoIso   =   false;
                $scope.preloader = false; 

            });     
        }else if(item.value == 'nuevoFormatoIso'){
            $scope.nuevoCatalogoIso   =   false;
            $scope.editarCatalogoIso  =   false;
            $scope.nuevoFormatoIso    =   true;
            $scope.editarFormatoIso   =   false; 
        }else{
            $scope.mostrarFormatos($scope.otrosOperadores[0]);
            $scope.nuevoCatalogoIso   =   false;
            $scope.editarCatalogoIso  =   false;
            $scope.nuevoFormatoIso    =   false;
            $scope.editarFormatoIso   =   true; 
        }
    }
    $scope.anteriorProcesos = function(){
        $scope.primeraVista         = false;
        $scope.cuartaVista          = false;
        $scope.vistaGuardarCabecera = true;
    }
    $scope.mostrarCuartaVista = function(){
        $scope.tablaConversorDetalleVista = false;
        $scope.cuartaVista = true;
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
               var tmpIdx = -1;
               for(xx in $scope.itemsValidos){
                  if($scope.bitmaps[i].orden ==  $scope.itemsValidos[xx].orden){
                    tmpIdx = xx;
                  }
               }
               if(tmpIdx != -1){
                  $scope.itemsValidos.splice(tmpIdx, 1);
               }
               $scope.bitmaps[i].validar = false;
               $scope.bitmaps[i].check = false;
          }
        }
        var idx = -1;
        for(t in $scope.itemsValidos){
            if(item.orden == $scope.itemsValidos[t].orden){
              idx = t;
            }
        }
        if(idx != -1){
          $scope.itemsValidos.splice(idx, 1);
          if($scope.flagFix){
              for(t in $scope.nuevosChecks){
                if(item.orden == $scope.nuevosChecks[t].orden){
                  $scope.nuevosChecks[t].disabled = true;
                  $scope.nuevosChecks[t].check = false;
                }
              }
          }
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
      for(t in $scope.nuevosChecks){
          if(item.orden == $scope.nuevosChecks[t].orden){
            $scope.nuevosChecks[t].disabled = true;
            $scope.nuevosChecks[t].check = false;
          }
      }

    }
    $scope.guardarCatalogo = function(){
        var ope = '';
        $scope.dataEnviar = [];
        if($scope.editarCatalogoIso){
           ope = $scope.datos.operador
           $scope.dataEnviar.push({eliminar:true,Id_Operador:$scope.datos.operador});
        }else if($scope.nuevoCatalogoIso){
           ope = $scope.datos.operador.Id_Operador;
        }
        for(prop in $scope.itemsValidos){
           $scope.dataEnviar.push({Id_Operador:ope,Bitmap:$scope.itemsValidos[prop].orden,Nombre:$scope.itemsValidos[prop].nombre,Tipo:$scope.itemsValidos[prop].tipo.value,Longitud:$scope.itemsValidos[prop].longitud,Descripcion:$scope.itemsValidos[prop].descripcion,TipoDato:$scope.itemsValidos[prop].tipoValor.value});
        }
        factoryParsing.grabarCatalogosISO($scope.dataEnviar).then(function(r){
            if(r.msj == 'Success'){
                 $ngBootbox.alert('¡El Catálogo se guardo con éxito!').then(function() {
                          $route.reload();
                 });
            }else{
                $ngBootbox.alert('¡Error indeterminado en conexión!').then(function() {
                        $route.reload();
                });
            }
        });
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
        $scope.flagFix = true;
        var id = 0;
        if($scope.editarCatalogoIso){
             id = $scope.datos.operador;
        }else if($scope.nuevoCatalogoIso){
             id = 0;
        }
        factoryParsing.obtenerCatalogos({id:id}).then(function(resp){
              var tipoCampo,tipoValor;
              for (var i=0; i < resp.length; i++) {
                    for (var j=0; j < $scope.itemsValidos.length; j++) {
                      if (resp[i].Bitmap == $scope.itemsValidos[j].orden) {
                          $scope.itemsValidos[j].nombre = resp[i].Nombre;
                          if($scope.editarCatalogoIso){
                              for(p in $scope.tiposCampo){
                                  if($scope.tiposCampo[p].value ==  resp[i].Tipo){
                                      tipoCampo = $scope.tiposCampo[p];
                                  }
                              }
                              for(p in $scope.tiposValor){
                                  if($scope.tiposValor[p].value ==  resp[i].TipoDato){
                                      tipoValor = $scope.tiposValor[p]; 
                                  }
                              }
                          }else if($scope.nuevoCatalogoIso){
                               tipoCampo = $scope.tipoCampo;
                               tipoValor = $scope.tipoValor;
                          }
                          $scope.itemsValidos[j].tipo = tipoCampo;
                          $scope.itemsValidos[j].tipoValor = tipoValor;
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
              if($scope.editarCatalogoIso){
                  factoryParsing.obtenerCatalogos({id:0}).then(function(resp){
                      for (var i=0; i < resp.length; i++) {
                            for (var j=0; j < $scope.itemsValidos.length; j++) {
                              if (!$scope.itemsValidos[j].longitud) {
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

                  });
              }
              $scope.itemsValidos.sort(function(a, b) {
                  return parseFloat(a.orden) - parseFloat(b.orden);
              });
              $scope.primeraVista = false;
              $scope.terceraVista = true;
        });  
    } 
    var creacionArrayConversorDetalle  = function(tipo){
       $scope.arrayConversorDetalle = [];
       for(prop in $scope.itemsParaDetalle){
           if($scope.tipoCabecera.value == 'ENVIO'){
              $scope.arrayConversorDetalle.push({TipoRegistro: 'D',NumeroCampo:$scope.itemsParaDetalle[prop].orden,PosicionInicio: 0,LongitudCampo: 0,TipoCampo: 'X',SeparadorDecimales: 0,NumeroDecimales: 0,DescripcionCampo:'',IdCampoEquivalente: 0,CampoEquivalente:$scope.itemsParaDetalle[prop].Nombre,Obligatorio: 0,Validaciones: '',Tipo_Registro: 'ITEM',Default_Value: '',observacion: '',Rutina_Validacion: '',Rutina_Transformacion: '',CaracterConcatenacion: '',OrdenCampo: -1,Rutina_Conversion: '',ValidaEnMasivas: 1});
           }else{
              $scope.arrayConversorDetalle.push({TipoRegistro: 'D',NumeroCampo:$scope.itemsParaDetalle[prop].orden, PosicionInicio: 0,LongitudCampo: 0,TipoCampo: 'X',SeparadorDecimales: 0,NumeroDecimales: 0,DescripcionCampo:$scope.itemsParaDetalle[prop].Nombre,IdCampoEquivalente: 0,CampoEquivalente:'',Obligatorio: 0,Validaciones: '',Tipo_Registro: 'ITEM',Default_Value: '',observacion: '',Rutina_Validacion: '',Rutina_Transformacion: '',CaracterConcatenacion: '',OrdenCampo: -1,Rutina_Conversion: '',ValidaEnMasivas: 1});
           }
           
       }
    }
    var crearBitmaps = function(arrayBusqueda){
          var tmpBinario1 = '';
          var tmpBinario2 = '';
          for(p in arrayBusqueda){
            if(arrayBusqueda[p].orden <= 64){
               if(arrayBusqueda[p].check){
                  tmpBinario1 += '1';
               }else{
                  tmpBinario1 += '0';
               }
            }else{
               if(arrayBusqueda[0].check){
                  if(arrayBusqueda[p].check){
                      tmpBinario2 += '1';
                  }else{
                      tmpBinario2 += '0';
                  }
                  if(tmpBinario2 == '0000000000000000000000000000000000000000000000000000000000000000'){
                      //console.log('esta marcado pero no hay seleccion');
                      tmpBinario1 = tmpBinario1.replace('1','0'); 
                  }
               }else{
                  tmpBinario2 = '0000000000000000000000000000000000000000000000000000000000000000'
                  tmpBinario2 = '0000000000000000000000000000000000000000000000000000000000000000'
                  break;
               }
            }
          }
          /*console.log(tmpBinario1);
          console.log(tmpBinario2);
          console.log('--------------');*/
          $scope.valorHexadecimal1 = ConvertBase.binaryToHex(tmpBinario1);
          //console.log($scope.valorHexadecimal1.result);
          $scope.valorHexadecimal2 = ConvertBase.binaryToHex(tmpBinario2);
          //console.log($scope.valorHexadecimal2.result);
    }
    $scope.siguienteTablaConversorDetalle = function(){
       creacionArrayConversorDetalle($scope.tipoCabecera.value);
       $scope.cuartaVista = false;
       $scope.tablaConversorDetalleVista = true;
       crearBitmaps($scope.nuevosChecks);
    }
    $scope.procesoPrimeraVista = function(item){
        $scope.muestraOper = false;
        if(item){
           $scope.muestraOper = false;
           $scope.mostrarOperador = item.Operador;
           $scope.itemsValidos = [];
           $scope.datos.operador = item.Id_Operador;
           factoryParsing.obtenerDetalleCatalogos([{Id_Operador:item.Id_Operador}]).then(function(detalles){
                for(prop in $scope.bitmaps){
                  $scope.bitmaps[prop].check = false;
                  for(p in detalles){
                    if(detalles[p].Bitmap == 1){
                        for(i = 64;i < 128;i++){
                          $scope.bitmaps[i].validar = true;
                        }
                    }
                    if(detalles[p].Bitmap == $scope.bitmaps[prop].orden){
                       $scope.bitmaps[prop].check = true;
                       $scope.itemsValidos.push({name:$scope.bitmaps[prop].name,value:$scope.bitmaps[prop].value,orden:$scope.bitmaps[prop].orden,check:$scope.bitmaps[prop].check,validar:$scope.bitmaps[prop].validar,disabled:$scope.bitmaps[prop].disabled});
                    }
                  }
                }
               
           });
        }else{
          $scope.muestraOper = true;
          desCheckBitmaps();
        }
        $scope.primeraVista = true;
        $scope.vistaGuardarCabecera = false;
    }
    $scope.validarFormato = function(arg,index){
      if(arg <= 0 || arg > 999){
          $scope.itemsValidos[index].longitud = '';
      }
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
    /*conversorcabeceraisosModel.getAll().then(function(data) {
      $scope.conversorcabeceraisosList = data;
      $scope.conversorcabeceraisosTemp = angular.copy($scope.conversorcabeceraisosList);
      $scope.preloader = false;
    });*/
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversorcabeceraisos/modalCreate.html',
        controller: 'modalconversorcabeceraisosCreateController',
        size: 'lg',
        resolve: {
         datos: function () {
          return $scope.listaCatalogosDetalles;
         },
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
  var encerarNuevosChecks = function(){
      for(prop in $scope.nuevosChecks){
         $scope.nuevosChecks[prop].disabled = true; 
         $scope.nuevosChecks[prop].check    = false; 
         $scope.nuevosChecks[prop].class    = false; 
      }
  }
  $scope.procesoNuevoFormato = function(){
        encerarNuevosChecks();
        $scope.itemsParaDetalle = [];
        factoryParsing.obtenerCatalogos({id:$scope.datos.otroOperador.Id_Operador}).then(function(resp){
            for(xx in $scope.nuevosChecks){
                $scope.nuevosChecks[xx].class = false;
                for(var x = 0; x < resp.length; x++){
                  if(resp[x].Bitmap == $scope.nuevosChecks[xx].orden){
                        $scope.nuevosChecks[xx].disabled = false;
                        $scope.nuevosChecks[xx].class = true;
                        $scope.nuevosChecks[xx].Descripcion = resp[x].Descripcion;
                        $scope.nuevosChecks[xx].Id_Operador = resp[x].Id_Operador;
                        $scope.nuevosChecks[xx].Longitud    = resp[x].Longitud;
                        $scope.nuevosChecks[xx].Nombre      = resp[x].Nombre;
                        $scope.nuevosChecks[xx].Tipo        = resp[x].Tipo;
                        $scope.nuevosChecks[xx].TipoDato    = resp[x].TipoDato;
                  }
                }
            }
            $scope.terceraVista  = false;
            $scope.cuartaVista  = true;
            $scope.vistaGuardarCabecera = false;
            $scope.cuartaVista  = true;
        });
  }

  var agregarIdFormato = function(IdFormato){
      for(prop in $scope.arrayConversorDetalle){
          $scope.arrayConversorDetalle[prop].IdFormato = IdFormato;
      }
  }
  var crearCabeceraIso = function(IdFormato,idOperador,bitmap1,bitmap2){
      var arrayCabeceraIso = [
          {IdFormato:IdFormato,Orden:1,Nombre:'Longitud',Tipo:'H',Longitud:4,Bytes:2,AplicaDefault:false,ValorDefault:128,Respuesta:'',Descripcion:'Longitud de la trama. Constante'},
          {IdFormato:IdFormato,Orden:2,Nombre:'MTI',Tipo:'N',Longitud:4,Bytes:4,AplicaDefault:true,ValorDefault:$scope.mtiInput,Respuesta:'',Descripcion:'Codigo del tipo de mensaje'},
          {IdFormato:IdFormato,Orden:3,Nombre:'BitMap Primario',Tipo:'H',Longitud:16,Bytes:8,AplicaDefault:false,ValorDefault:bitmap1,Respuesta:'',Descripcion:'Valor hexadecimal representativo del BitMap primario con una longitud de 64 bit'},
          {IdFormato:IdFormato,Orden:4,Nombre:'BitMap Secundario',Tipo:'H',Longitud:16,Bytes:8,AplicaDefault:true,ValorDefault:bitmap2,Respuesta:'',Descripcion:'Valor hexadecimal representativo del BitMap secundario con una longitud de 64 bit. (Opcional)'},
          {IdFormato:IdFormato,Orden:5,Nombre:'Operador',Tipo:'N',Longitud:6,Bytes:6,AplicaDefault:true,ValorDefault:idOperador,Respuesta:'',Descripcion:'Identificador del operador insertado en esta tabla'}

      ]; 


      return arrayCabeceraIso;
  }
  $scope.guardarConversorDetalle = function(){
        var conversorCabeceras = conversorcabecerasModel.create();
        conversorCabeceras.NombreFormato = $scope.nombreCabecera;
        conversorCabeceras.DescripcionFormato = $scope.descripcionCabecera;
        conversorCabeceras.Cabecera = false;
        conversorCabeceras.Pie = false;
        conversorCabeceras.Separador = '';
        conversorCabeceras.FormatoConversion = 0;
        conversorCabeceras.Formato_destino = false;
        var tipoProceso = '',tipoConversion = '';
        if($scope.tipoCabecera.value == 'ENVIO'){
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
        conversorCabeceras.save().then(function(r){
            if(r.message){
                var arrayEnviar = [];
                agregarIdFormato(r.IdFormato);
                var datosCabeceraIso = crearCabeceraIso(r.IdFormato,$scope.datos.otroOperador.Id_Operador,$scope.valorHexadecimal1.result,$scope.valorHexadecimal2.result);
                arrayEnviar.push(datosCabeceraIso);
                arrayEnviar.push($scope.arrayConversorDetalle);
                factoryParsing.guardarFormatoISO(arrayEnviar).then(function(resultDta){
                    if(resultDta.msj){
                      $ngBootbox.alert('¡El Formato se creo con éxito!').then(function() {
                        $route.reload();
                      });
                    }else{
                      $ngBootbox.alert('¡Error indeterminado en conexión!').then(function() {
                        $route.reload();
                      });
                    }
                });
            } 
        });
     
  }
  /*  Delete  */
  $scope.openDelete = function (item) {
      factoryParsing.obtenerFormatos(item).then(function(respuestaData){
            var totalFormatos = respuestaData.length;
            if(totalFormatos > 0){
               item.eliminar = false;
            }else{
               item.eliminar = true;
            }
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
              factoryParsing.eliminarCatalogo(data).then(function(r){
                  if(r >= 1){
                      var idx = $scope.otrosOperadores.indexOf(data); 
                      $scope.otrosOperadores.splice(idx, 1);
                      $scope.msjEliminarCatalogo = '¡El Catálogo se elimino con éxito!'
                      $scope.claseEliminarCatalogo = 'success';
                      $scope.msjAlertEliminarCatalogo = true;
                      $ngBootbox.alert('¡El Catálogo se elimino con éxito!').then(function() {
                        $route.reload();
                      });
                  }else{
                      $scope.msjEliminarCatalogo = '¡Error indeterminado en conexión!'
                      $scope.claseEliminarCatalogo = 'danger';
                      $scope.msjAlertEliminarCatalogo = true;
                      $ngBootbox.alert('¡Error indeterminado en conexión!').then(function() {
                        $route.reload();
                      });
                  }
              }); 
            });
      });
  };
}])