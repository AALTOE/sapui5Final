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
               EMPLOYEEID	: "",
               EnableSave   : false
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
            //Obtenemos los ficheros
            this._oDataGetFiles(oDataEmployee.getProperty("/EMPLOYEEID"));   
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
            //Refrescamos los datos de la lista
            var oList = this.getView().byId("listEmployees");
            oList.getBinding("items").refresh(true);
        },
        /**
         * FUNCIÓN QUE MUESTRA UN FRAGMENT QUE CONTIENE UN FORMULARIO PARA EL ASCENSO
         * @version:  1.0
         * @History:  La primera versión fue escrita por Alex Alto FEB - 2025
         */
        showUpgrateEmployee : function () {
            if (!this.oMPDialog) {
				this.oMPDialog = this.loadFragment({
					name: "com.logali.sapui5rh.Fragments.ViewEmployee.F5UpgrateEmployee"
				});
			}
			this.oMPDialog.then(function (oDialog) {
				this.oDialog = oDialog;
				this.oDialog.open();
			}.bind(this));
        }, 
        /**
         * FUNCIÓN QUE CIERRA EL DIALOGO DEL ASCENSO Y RESETEA EL
         * FORMULARIO
         * @version:  1.0
         * @History:  La primera versión fue escrita por Alex Alto FEB - 2025
         */
        _closeDialog: function () {
			this.oDialog.close();
            this.byId("inputAmount").setValue("");
            this.byId("inputCreationDate").setValue("");
            this.byId("inputComments").setValue("");
		},
        /**
         * FUNCIÓN QUE VALIDA EL CAMPO DEL SALARIO
         * @version:  1.0
         * @History:  La primera versión fue escrita por Alex Alto FEB - 2025
         */
        validSlary : function (oEvent) {
            const sValue = oEvent.getParameters().value;
            let context = oEvent.getSource();
            const oDataEmployee =this.getView().getModel("objEmployeeInfo");
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            if(sValue === "" | undefined){
                context.setValueState("Error");
                context.setValueStateText(oResourceBundle.getText("txtMessageSalary"));
                oDataEmployee.setProperty("/VALIDSALARY", false);
            }else{
                context.setValueState("None");
                oDataEmployee.setProperty("/VALIDSALARY", true);
            }
            oDataEmployee.refresh();
            this.enableSaveButton();
        },
        /**
         * FUNCIÓN QUE VALIDA EL CAMPO DEL FECHA
         * @version:  1.0
         * @History:  La primera versión fue escrita por Alex Alto FEB - 2025
         */
        validDate : function (oEvent) {
            let context = oEvent.getSource();
            const oDataEmployee =this.getView().getModel("objEmployeeInfo");
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            //Validamos la fecha
            if (!oEvent.getSource().isValidValue()) {
                context.setValueState("Error");
                context.setValueStateText(oResourceBundle.getText("valueStateDate"));
                oDataEmployee.setProperty("/VALIDDATE", false);
            } else {
                context.setValueState("None");
                oDataEmployee.setProperty("/VALIDDATE", true);
            }
            oDataEmployee.refresh();
            this.enableSaveButton();
        },
        /**
         * FUNCIÓN QUE VALIDA SI EL CAMPO SALARIO Y FECHA SON CORRECTO, HABILITA EL BOTON DE GUARDAR
         * @version:  1.0
         * @History:  La primera versión fue escrita por Alex Alto FEB - 2025
         */
        enableSaveButton : function (){
            const oDataEmployee =this.getView().getModel("objEmployeeInfo");
            if( oDataEmployee.getProperty("/VALIDSALARY") && 
                oDataEmployee.getProperty("/VALIDDATE")
            ){
                oDataEmployee.setProperty("/EnableSave", true);
            }else{
                oDataEmployee.setProperty("/EnableSave", false);
            }
            oDataEmployee.refresh();
        },
        /**
         * FUNCIÓN QUE PREPARA LA INFOMRACIÓN PARA REALIZAR EL UPGRATE
         * @version:  1.0
         * @History:  La primera versión fue escrita por Alex Alto FEB - 2025
         */
        upgrateEmployee : function () {
            this.getView().setBusy(true);
            const oDataEmployee = this.getView().getModel("objEmployeeInfo");
            const sEmployeeID   = oDataEmployee.getProperty("/EMPLOYEEID");
            const sAmount       = this.byId("inputAmount").getValue();
            const dCreationDate = this.byId("inputCreationDate").mProperties.dateValue;
            const sComments     = this.byId("inputComments").getValue();
            var body = {
                Amount      : sAmount,
                CreationDate: dCreationDate,
                Comments    : sComments,
                SapId       : this.getOwnerComponent().SapId,
                EmployeeId  : sEmployeeID,
                Waers       : "EUR"
            };
            //Realizamos la creación directamente
            this._oDataCreate("/Salaries", body);
            
        },

        _oDataGetFiles : function (EmployeeID){
            //Bind file
            this.byId("uploadCollectionEmployee").bindAggregation("items", {
              path : "employeeModel>/Attachments",
              filters : [
                new Filter("EmployeeId",FilterOperator.EQ,EmployeeID)/*,
                new Filter("SapId",FilterOperator.EQ,this.getOwnerComponent().SapId)*/
              ],
              template : new sap.m.UploadCollectionItem({
                documentId : "{employeeModel>AttId}",
                visibleEdit : false,
                fileName : "{employeeModel>DocName}"
              }).attachPress(this.downloadFile)
            })
        },

        onFileBeforeUpload : function (oEvent){
            let fileName = oEvent.getParameter("fileName");
            let objContext = oEvent.getSource().getBindingContext("employeeModel").getObject();
            let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
              name : "slug",
              value : objContext.SapId+";"+objContext.EmployeeId+";"+fileName
            });
            oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        },
  
        onFileChange : function (oEvent) {
            let oUploadCollection = oEvent.getSource();
            let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
              name: "x-csrf-token",
              value: this.getView().getModel("employeeModel").getSecurityToken()
            });
            oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
        },
  
        onFileUploadComplete : function(oEvent){
            oEvent.getSource().getBinding("items").refresh();
        },

        onFiledeleted : function (oEvent) {
            var oUploadCollection = oEvent.getSource();
            var sPath = oEvent.getParameter("item").getBindingContext("employeeModel").getPath();
            this.getView().getModel("employeeModel").remove(sPath, {
              success : function (){
                oUploadCollection.getBinding("items").refresh();
              },
              error : function (){}
            });
          },
  
          /**
           * Función que descarga los archivos
           * @param {*} oEvent 
           */
          downloadFile : function (oEvent) {
            const sPath = oEvent.getSource().getBindingContext("employeeModel").getPath();
            window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV/" + sPath + "/$value") ;
          }
    });
});