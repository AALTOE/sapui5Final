sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/m/MessageBox"
    ],
    function (BaseController, History, MessageBox) {
        "use strict";

        /**
        * @param {sap.ui.core.mvc.Controller} Controller
        * @param {sap.ui.core.routing.History} History
        * @param {sap.m.core.MessageBox} MessageBox
        * @returns 
        */
        return BaseController.extend("com.logali.sapui5rh.controller.Base", {

            onInit: function () {},
            /**
            * FUNCIÓN QUE REGRESA A UNA PÁGINA ATRAS O A LA PAGINA PRIUNCIPAL
            * DESDE CUALQUIER PUNTO DE LA APP
            * @author : Alex Alto
            * @version: 1.0
            * @History:  La primera versión fue escrita por Alex Alto Ene - 2025 
            */
            onBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    //Regresamos a la vista anterior
                    window.history.go(-1);
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteView1", {},true);
                }
                if(this.getView().sViewName.substr(25) === "CreateEmployee"){
                    //Limpia los valores de los inputs
                    this.cleanInputsValue();
                }
            },
            /**
            * FUNCIÓN QUE OCULTA EL BOTON DE NETSTAPE EN EL PRIMER PASO
            * @author : Alex Alto
            * @version: 1.0
            * @History:  La primera versión fue escrita por Alex Alto Ene - 2025 
            */
            disableBtnStep: function () {
                //Ocultamos el boton en el primer paso
                const oFirstStep = this._wizard.getSteps()[0];
                this._wizard.discardProgress(oFirstStep);
                this._wizard.goToStep(oFirstStep);
                oFirstStep.setValidated(false);
            },
            /**
            * FUNCIÓN QUE VALIDA CON UNA EXPRESION REGULAR, QUE EL VALOR CONTEGA SOLO LETRAS
            * @author : Alex Alto
            * @param  : sValue Valor del texto ingresado
            * @version: 1.0
            * @returns: true | false
            * @History: La primera versión fue escrita por Alex Alto Feb - 2025
            */
            validOnlyText: function (sValue) {
                let regex = /^[a-zA-Z\s]*$/; 
                if (regex.test(sValue)) {
                    return true;
                }
                else {
                    return false;
                }
            },
            /**
            * FUNCIÓN QUE VALIDA LA NOMENCLATURA DEL DNI ESPAÑOL
            * @author : Alex Alto
            * @param  : dni Valor del texto ingresado
            * @version: 1.0
            * @returns: true | false
            * @History: La primera versión fue escrita por Alex Alto Feb - 2025
            */
            validateDNISpain : function (dni) {
                var number;
                var letter;
                var letterList;
                var regularExp = /^\d{8}[a-zA-Z]$/;
                //Se comprueba que el formato es válido
                if (regularExp.test(dni) === true) {
                    //Número
                    number = dni.substr(0, dni.length - 1);
                    //Letra
                    letter = dni.substr(dni.length - 1, 1);
                    number = number % 23;
                    letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList = letterList.substring(number, number + 1);
                    if (letterList !== letter.toUpperCase()) {
                        return false;
                    } else {
                        return true;//Correcto
                    }
                } else {
                    return false;//Error
                }
            },
            /** 
            *FUNCIÓN QUE MUESTRA UN MessageBox, SEGUN SU TIPO
            * @author :  Alex Alto
            * @params :  sMessageBoxType = Info, Warning, Error, etc.
            *            sTitle = Titulo del mensaje
            *            sMessage =  Mensaje 
            *            iTypeAction = Tipo de Acción
            *            0 = Cancelar
            *            1 = Guadar Empleado
            *            2 = Eliminar empleado 
            * @version:  2.0
            * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
            */
            showMessageBoxType: function (sMessageBoxType, sTitle, sMessage, iTypeAction) {
                MessageBox[sMessageBoxType](sMessage, {
                    title: sTitle,
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            if (iTypeAction === 0){
                                this.saveOKResetModel();
                            }
                        }
                    }.bind(this)
                });

            },
            /**
            * FUNCIÓN REINICIA LA APP DESDE 0 AL TERMINAR DE GUARDAR UN EMPLEADO
            * @author :  Alex Alto
            * @version:  1.0
            * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
            */
            saveOKResetModel : function (){
                //Regresa al paso 1
                this._handleNavigationToStep(0);
                //Descarta todo el progreso
                this._wizard.discardProgress(this._wizard.getSteps()[0]);
                //Regresa el menú principal
                this.onBack();
            },
            /**
            * FUNCIÓN LIMPIA TODOS LOS INPUTS DEL FORMULARIO
            * @author :  Alex Alto
            * @version:  1.0
            * @History:  La primera versión fue escrita por Alex Alto Feb - 2025
            */
            cleanInputsValue : function () {
                this.byId("iname").setValue("");
                this.byId("ilastname").setValue("");
                this.byId("icif").setValue("");
                this.byId("idni").setValue("");
                this.byId("idate").setValue("");
                this.byId("iname").setValueState("None");
                this.byId("ilastname").setValueState("None");
                this.byId("icif").setValueState("None");
                this.byId("idni").setValueState("None");
                this.byId("idate").setValueState("None");
                this.byId("uploadCollection").removeAllItems();
                this.oTypeEmployeeM.setProperty("/EMPLOYEECOMMENT","");
                this.oTypeEmployeeM.setProperty("/NUMFILES","");
                this.oTypeEmployeeM.setProperty("/FILES","");
                this.oTypeEmployeeM.setProperty("/BTNSTEP1",false);
                this.disableBtnStep();
                
            },
            /** 
            *FUNCIÓN QUE MUESTRA UN MENSAJE DE CONFIRMACIÓN PARA ELIMINAR UN EMPLEADO
            * @author :  Alex Alto
            * @params :  action, sMessage, sMessageBoxType, sPath
            * @version:  1.0
            * @History:  La primera versión fue escrita por Alex Alto Feb - 2025
            */
            showMessageCRUD: function async (action, sMessage, sMessageBoxType, sPath, object)  {
                const $this = this;
                return new Promise ((resolve, reject) =>{
                    MessageBox[sMessageBoxType](sMessage, {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: async function (oAction) {
                            if(oAction == MessageBox.Action.YES){
                                switch (action) {
                                    case 'create' : resolve(await $this._oDataCreate(sPath, object)); break;
                                    case 'delete' : resolve(await $this._oDataDelete(sPath));break;
                                }
                            }
                        }
                    });
                })        
            },
            /** 
            *FUNCIÓN QUE LLAMA AL MODELO ODATA Y REALIZA UN CREATE EN EL SERVIDOR
            * @author :  Alex Alto
            * @params :  sEntity, body
            * @version:  1.0
            * @History:  La primera versión fue escrita por Alex Alto Feb - 2025
            */
            _oDataCreate : function (sEntity, body){
                this.getView().getModel("employeeModel").create(sEntity, body, {
                    success: function (oData) {
                        if (sEntity === "/Users"){
                            this.getView().setBusy(false);
                            this._showInfoCreateEmployee(oData);
                        }else if(sEntity ==="/Salaries"){
                            this._showInfoCreateUpgrate();
                        }   
                        
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                        sap.m.MessageToast.show(this.oView.getModel("i18n").getResourceBundle().getText("MSGError"));
                    }.bind(this)
                })
            },
            /** 
            *FUNCIÓN QUE AL CREAR UN USUARIO, MUESTRA UN MENSAJE INFOMRATIVO, MOSTRANDO EL ID
            * @author :  Alex Alto
            * @params :  oData
            * @version:  1.0
            * @History:  La primera versión fue escrita por Alex Alto Feb - 2025
            */
            _showInfoCreateEmployee : function(oData){
                this.oTypeEmployeeM.setProperty("/IDNEWUSER", oData.EmployeeId)
                sap.m.MessageBox.information(this.oView.getModel("i18n").getResourceBundle().getText("newEmployeeMSG", oData.EmployeeId), {
                    onClose: function () {
                        //Al crear el empleado, reinicia todo el modelo
                        this.saveOKResetModel();
                        //Se inicia con la carga de archivos
                        this.onStartUpload();
                    }.bind(this)
                });
            },
            /** 
            *FUNCIÓN QUE LLAMA AL MODELO ODATA Y REALIZA UN DELETE EN EL SERVIDOR
            * @author :  Alex Alto
            * @params :  sPath
            * @version:  1.0
            * @History:  La primera versión fue escrita por Alex Alto Feb - 2025
            */
            _oDataDelete : function (sPath) {
                this.getView().getModel("employeeModel").remove(sPath, {
                    success: function () {
                        this.resetViewEmployee();
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show(this.oView.getModel("i18n").getResourceBundle().getText("MSGError"));
                    }.bind(this)
                })
            },
            /** 
            *FUNCIÓN QUE REALIZA UN ASCENSO DE UN EMPLEADO Y MUESTRA UN MENSAJE INFORMATIVO
            * @author :  Alex Alto
            * @params :  oData
            * @version:  1.0
            * @History:  La primera versión fue escrita por Alex Alto Feb - 2025
            */
            _showInfoCreateUpgrate : function(){
                sap.m.MessageToast.show(this.oView.getModel("i18n").getResourceBundle().getText("MSGUpgrate"));
                this._closeDialog();
                //Refrescamos los datos de la lista
                const oList = this.getView().byId("idTimeline");
                oList.getBinding("content").refresh(true);
                this.getView().setBusy(false)
            }
        });
    }
);