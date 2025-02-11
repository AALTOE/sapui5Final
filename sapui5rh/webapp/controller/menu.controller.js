sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.logali.sapui5rh.controller.menu", {
        
        onInit() {
        },

        /**
         * Función que abre la vista CreateEmployee
         */
        toCreateEmployee : function (){
            try {
                var oReouter = sap.ui.core.UIComponent.getRouterFor(this);
                oReouter.navTo("RouteCreateEmployee");
            } catch (error) {
                console.log(error)
            }
        },

        /**
         * Función que abre la vista ViewEmployee
         */
        toViewEmployee : function (){
            try {
                var oReouter = sap.ui.core.UIComponent.getRouterFor(this);
                oReouter.navTo("RouteViewEmployee");
            } catch (error) {
                console.log(error)
            }
        },
        /**
         * Función que abre una nueva prestaña y muestra la app EmployeesSignature
         * ya desplegada en BTP
         */
        toEmployeeSignature : function (){
            window.open("https://67ef397ctrial-67ef397ctrial-ext-dev-logali-approuter.cfapps.us10-001.hana.ondemand.com", "_blank",); 
        }
    });
});