//@ts-nocheck
sap.ui.define([],

    function () {

        return {
            /**
             * FUNCIÓN QUE FORMATEA EL TIPO DE EMPLEADO DEVOLVIENDO UN ICONO
             * @param {*} sType Tipo de Empleado
             * @returns un icono
             * @version 1.0
             * @History:  La primera versión fue escrita por Alex Alto FEB - 2025
             */
            iconType: function (sType) {

                switch (sType) {
                    case '0': return "sap-icon://employee-pane";
                    case '1': return "sap-icon://employee";
                    case '2': return "sap-icon://kpi-managing-my-area";
                    default: return sType;
                }
            },
            /**
             * FUNCIÓN QUE FORMATEA EL TIPO DE EMPLEADO DEVOLVIENDO UN TEXTO
             * @param {*} sType Tipo de Empleado
             * @returns texto
             * @version 1.0
             * @History:  La primera versión fue escrita por Alex Alto FEB - 2025
             */
            employeeType: function (sType) {
                const resourceBundle = this.getView().getModel("i18n").getResourceBundle();
                switch (sType) {
                    case '0': return resourceBundle.getText("btnInter");
                    case '1': return resourceBundle.getText("bntAut");
                    case '2': return resourceBundle.getText("btnGer");
                    default: return sType;
                }
            }
        }

    });