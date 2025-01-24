sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History"
    ],
    function (BaseController, History) {
        "use strict";

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
            }

        });
    }
);