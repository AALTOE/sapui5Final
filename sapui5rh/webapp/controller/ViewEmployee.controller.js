sap.ui.define([
    "com/logali/sapui5rh/controller/Base.controller",
    "../Formatter/TypeEmployeeFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
], (Base, TypeEmployeeFormatter, Filter, FilterOperator, JSONModel) => {
    "use strict";

    /**
    * @param {sap.ui.model.Filter} Filter
    * @param {sap.ui.model.FilterOperator} FilterOperator
    * @param {sap.ui.model.json.JSONModel} JSONModel
    * @returns 
    */

    return Base.extend("com.logali.sapui5rh.controller.ViewEmployee", {

        formatter: TypeEmployeeFormatter,

        onInit() {
            //Obtenemos el obejeto del SplitApp por su ID
            this.getMasterPageObject = this.byId("masterViewEmployee");
            //Modelo que guarda el Spath y el ID del empleado
            var oViewModel;
            oViewModel = new JSONModel({
               SPATH	    : "",
               EMPLOYEEID	: ""
           });
           this.getView().setModel(oViewModel, "objEmployeeInfo");
        },
        /**
         * FUNCIÓN QUE FILTRA POR ID DEL EMPLEADO EN LA LISTA
         * SOLO SE PUEDE CON ESE CAMPO
         * @param {*} oEvent 
         * @version:  1.0
         * @History:  La primera versión fue escrita por Alex Alto FEB - 2025
         */
        onFilterEmployees : function (oEvent){
            const aFilter = [];
            const sQuery  = oEvent.getParameter("newValue");
            if(sQuery){
                aFilter.push(new Filter("EmployeeId" , FilterOperator.Contains, sQuery));
            }
            const oList = this.getView().byId("listEmployees");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },
        /**
         * FUNCIÓN QUE CAMBIA DE PAGINA AL PRESIONAR UN ELEMENTO EN LA LISTA, PARA MOSTAR SUS DETALLES
         * VISUALIZANDO LA PAGINA CON ID 'detailSelectEmployeePage'
         * @param {*} oEvent 
         * @version:  1.0
         * @History:  La primera versión fue escrita por Alex Alto FEB - 2025
         */
        onPressNavToDetail: function (oEvent) {
            //Navegamos hacia la pagina de detalle
			this.getMasterPageObject.to(this.createId("detailSelectEmployeePage"));
            //Obtenemos la ruta de consulta del ODATA (EmployeeId y SapId)
            const oContext = oEvent.getParameter("listItem").getBindingContext("employeeModel").sPath;
            //Pasamos la información obtenida del ODATA al modelos para visualizar en la pagina 
            const oDetailEmployeePage = this.byId("detailSelectEmployeePage");
            oDetailEmployeePage.bindElement("employeeModel>"+oContext);
            //Guardamos en el modelo la ruta y ID del empleado en el modelo
            const oDataEmployee =this.getView().getModel("objEmployeeInfo");
            oDataEmployee.setProperty("/SPATH", oContext);
            oDataEmployee.setProperty("/EMPLOYEEID", oContext.substring(19, 23));
            //Refresca el modelo
            oDataEmployee.refresh();
		},
        /**
         * FUNCIÓN QUE INVOCA UN MENSAJE DE CONFIRMACIÓN ANTES DE ELIMINAR EL EMPLEADO
         * AL CONFIRMAR SE ELIMINA EL EMPLEADO Y LLAMA LA FUNCIÓN resetViewEmployee
         * @param {*} oEvent 
         * @version:  1.0
         * @History:  La primera versión fue escrita por Alex Alto FEB - 2025
         */
        showConfirmDelete : function (oEvent) {
            const oResourceBundle   = this.getView().getModel("i18n").getResourceBundle();
            const oDataEmployee     = this.getView().getModel("objEmployeeInfo");
            const body              = oDataEmployee.getProperty("/SPATH");
            const sMsgBox = oResourceBundle.getText("txtDeleteEmployee", oDataEmployee.getProperty("/EMPLOYEEID"));
            try {
                this.showMessageCRUD("delete", sMsgBox, "warning", body);
            } catch (error) {
                
            }
        },
        /**
         * FUNCIÓN QUE AL ELIMINAR UN EMPLEADO CORRECTAMENTE, SE REINICIA LA VISTA DEL DETALLE DE EMPLEADO
         * ESTA FUNCION SE LLAMA EN Base.controller
         * @param {*} oEvent 
         * @version:  1.0
         * @History:  La primera versión fue escrita por Alex Alto FEB - 2025
         */
        resetViewEmployee : function (){
            //Obtenemos los recursos de i18n
            const oResourceBundle   = this.getView().getModel("i18n").getResourceBundle();
            //Obtenemos el modelo
            const oDataEmployee     = this.getView().getModel("objEmployeeInfo");
            //Se muestra un mensaje de confirmación
            sap.m.MessageToast.show(oResourceBundle.getText("txtDeleteEmployeeOK", oDataEmployee.getProperty("/EMPLOYEEID")));
            //Navegamos hacia la página que muestra un solo mensaje
			this.getMasterPageObject.to(this.createId("selectEmployeePage"));
            //Refrescamos los datos de la litsa
            var oList = this.getView().byId("listEmployees");
            oList.getBinding("items").refresh(true);
        }
        
    });
});