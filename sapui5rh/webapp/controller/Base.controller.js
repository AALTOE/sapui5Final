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

            onInit: function () {

            },
            /**
             * Función que regresa a una pagina anterior o 
             * a la pagina principal desde cualquier punto
             * @param {*} oEvent 
            */
            onBack: function (oEvent) {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    //Regresamos a la vista anterior
                    window.history.go(-1);
                } else {
                    //Aqui llega directamente a la vista de los detalles
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteView1", true);
                }
            },

            

            /* FUNCIÓN QUE CANCELA EL PROGRESO DEL WIZARD Y REGRESA AL PASO 1
            * 
            * @author :  Alex Alto
            * @version:  1.0
            * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
            */            
            showMessageBoxCancel: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._handleNavigationToStep(0);
                            this._employeeTypeModel();
                            this._wizard.discardProgress(this._wizard.getSteps()[0]);
                        }
                    }.bind(this)
                });
            },
            /* FUNCIÓN QUE CANCELA EL PROGRESO DEL WIZARD Y REGRESA AL MENU PRINCIPAL
            * 
            * @author :  Alex Alto
            * @version:  1.0
            * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
            */
            showMessageBoxReturn: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._handleNavigationToStep(0);
                            this._employeeTypeModel();
                            this._wizard.discardProgress(this._wizard.getSteps()[0]);
                            this.onBack();
                        }
                    }.bind(this)
                });
            },
            /* FUNCIÓN REINICIA LA APP DESDE 0 AL TERMINAR DE GUARDAR UN EMPLEADO
            * 
            * @author :  Alex Alto
            * @version:  1.0
            * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
            */
            saveOK : function (){
                //Regresa al paso 1
                this._handleNavigationToStep(0);
                //Reinicia el modelo
                this._employeeTypeModel();
                //Descarta todo el progreso
                this._wizard.discardProgress(this._wizard.getSteps()[0]);
                //Regresa el menú principal
                this.onBack();
            }

        });
    }
);