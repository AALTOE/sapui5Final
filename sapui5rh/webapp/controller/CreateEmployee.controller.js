sap.ui.define([
    "com/logali/sapui5rh/controller/Base.controller",
    "sap/ui/model/json/JSONModel"
], (Base, JSONModel) => {
    "use strict";

     /**
     * @param {sap.ui.model.json.JSONModel} JSONModel
     * @returns 
     */

    return Base.extend("com.logali.sapui5rh.controller.CreateEmployee", {

        onInit() {
            //Variable global para el objeto del NavContainer por id
            this._oNavContainer = this.byId("wizardNavContainer");
            //Variable global para obtener el objeto wizard por id
            this._wizard = this.byId("createEmployeeWizard");
            //Variable global para obtener la página donde se encuentra el Wizard
            this._oWizardContentPage = this.byId("wizardContentPage");
            //Iniciamos el modelo 
            this._employeeTypeModel();
        },

        /* FUNCIÓN QUE CREA UN MODELO TEMPORAL PARA EL TIPO DE EMPLEADO 
        *  "INTERNO" "AUTONOMO" "GERENTE", POR DEFAULT SE GENERA COMO "INTERNO"
        * 
        * @author :  Alex Alto
        * @version:  1.0
        * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
        */
       _employeeTypeModel: function(){
           //Modelo para el formulario por default
           var oViewModel;
           oViewModel = new JSONModel({
               EMPLOYEINTER	: true,
               EMPLOYEAUT	: "",
               EMPLOYEGER	: "",
               INPUTDNI     : true,
               INPUTCFI     : false,
               INPUTPRICE   : false,
               INPUTSALARY  : true,
               SLIDERMIN    : 12000,
               SLIDERMAX    : 80000,
               SLIDERSTEP   : 1000,
               SLIDERVALUE  : 24000
           });
           this.getView().setModel(oViewModel, "objTypeEmployee");
       },
        /* FUNCIÓN QUE HABILITAR los CAMPOS DEL FOMRULARIO,
        *  DEPENDIENDO EL TIPO DE EMPLEADO
        * 
        * @author :  Alex Alto
        * @version:  1.0
        * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
        */
       _selectEmployee : function (oEvent){
            //Obtenemos el texto del boton seleccionado
            const employeeType      = oEvent.getParameters().item.getText();
            //Obtenemos el modelo temporal
            const oTypeEmployeeM    =this.getView().getModel("objTypeEmployee");
            //Obtenemos los recursos del i18n
            const oResourceBundle   = this.getView().getModel("i18n").getResourceBundle();
            //Validamos el tipo de empleado
            if(employeeType === oResourceBundle.getText("bntAut")){
                //Establece la configuración para el empleado Autonomo
                oTypeEmployeeM.setProperty("/EMPLOYEINTER", false); //Interno
                oTypeEmployeeM.setProperty("/EMPLOYEAUT", true);    //Autonomo
                oTypeEmployeeM.setProperty("/EMPLOYEGER", false);   //Gerente
                oTypeEmployeeM.setProperty("/INPUTDNI", false);     //DNI
                oTypeEmployeeM.setProperty("/INPUTCFI", true);      //CFI
                oTypeEmployeeM.setProperty("/INPUTPRICE", true);    //Precio diario    
                oTypeEmployeeM.setProperty("/INPUTSALARY", false);  //Saldo bruto anual
                oTypeEmployeeM.setProperty("/SLIDERMIN", 100);      //Valor minumo
                oTypeEmployeeM.setProperty("/SLIDERMAX", 2000);     //Valor maximo  
                oTypeEmployeeM.setProperty("/SLIDERSTEP", 100);     //Intervalo
                oTypeEmployeeM.setProperty("/SLIDERVALUE", 400);    //Valor por defecto    
            }else if(employeeType === oResourceBundle.getText("btnGer")){
                //Establece la configuración para el empleado Gerente
                    oTypeEmployeeM.setProperty("/EMPLOYEINTER", false);
                    oTypeEmployeeM.setProperty("/EMPLOYEAUT", false);
                    oTypeEmployeeM.setProperty("/EMPLOYEGER", true);
                    oTypeEmployeeM.setProperty("/INPUTDNI", true);
                    oTypeEmployeeM.setProperty("/INPUTCFI", false);
                    oTypeEmployeeM.setProperty("/INPUTPRICE", false);
                    oTypeEmployeeM.setProperty("/INPUTSALARY", true);
                    oTypeEmployeeM.setProperty("/SLIDERMIN", 50000);
                    oTypeEmployeeM.setProperty("/SLIDERMAX", 200000);
                    oTypeEmployeeM.setProperty("/SLIDERSTEP", 1000);
                    oTypeEmployeeM.setProperty("/SLIDERVALUE", 70000);
                }else{
                    //Establece la configuración para el empleado Interno
                    this._employeeTypeModel();
                }
            //Refresca el modelo
            oTypeEmployeeM.refresh();
       },
       /* FUNCIÓN QUE MUESTRA UN MENSAJE DE CONFIRMACIÓN PARA CANCELA EL PROGRESO
        * 
        * @author :  Alex Alto
        * @version:  1.0
        * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
        */
       cancelProgress : function () {
        const oResourceBundle   = this.getView().getModel("i18n").getResourceBundle();
        this.showMessageBoxReturn(oResourceBundle.getText("cancelMSG"), "warning");
       },

       /* FUNCIÓN QUE VALIDA SI ESTA COMPLETO EL FOMRULARIO PARA HABILITAR
        * EL PASO 3
        * 
        * @author :  Alex Alto
        * @version:  1.0
        * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
        */
       validationForm: function () {
            //Obtenemos los datos del modelo
           const oTypeEmployeeM = this.getView().getModel("objTypeEmployee");
           //Obtenemos el valor de los campos del formulario
           const sname     = this.byId("iname").getValue();
           const slastname = this.byId("ilastname").getValue();
           const scif      = this.byId("icif").getValue();
           const sdni      = this.byId("idni").getValue();
           const sdate     = this.byId("idate").getValue();
           //Obtenemos si el empelado es autonomo
           const isEmplAut = oTypeEmployeeM.getProperty("/EMPLOYEAUT");

            //Validamos el campo Nombre
            if (sname) {
                oTypeEmployeeM.setProperty("/SATENAME", "None");
            } else {
                oTypeEmployeeM.setProperty("/SATENAME", "Error");
            }

            if (slastname) {
                oTypeEmployeeM.setProperty("/SATELASTNAME", "None");
            } else {
                oTypeEmployeeM.setProperty("/SATELASTNAME", "Error");
            }

            if (isEmplAut){
                if (slastname) {
                    oTypeEmployeeM.setProperty("/SATECIF", "None");
                } else {
                    oTypeEmployeeM.setProperty("/SATECIF", "Error");
                }
            }else{
                if (slastname) {
                    oTypeEmployeeM.setProperty("/SATEDNI", "None");
                } else {
                    oTypeEmployeeM.setProperty("/SATEDNI", "Error");
                }
            }

            if (sdate) {
                oTypeEmployeeM.setProperty("/SATEDATE", "None");
            } else {
                oTypeEmployeeM.setProperty("/SATEDATE", "Error");
            }

           
           //Si los campos estan compeltos, habilita el paso 3
            if (sname && slastname && (scif || sdni) && sdate) {
                this._wizard.validateStep(this.byId("employeesData"));
            } else {
                //De lo contrario no muesta el botón
                this._wizard.invalidateStep(this.byId("employeesData"));
            }
        },

        /**
         * Función que al terminar de llenar los formularios
         * envia una nueva vista para revisar los datos ingresados
         */
        wizardCompletedHandler: function () {
            this._oNavContainer.to(this.byId("wizardReviewPage"));
        },
        /**
         * Función que regresa al Wizard
         */
        backToWizardContent: function () {
			this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		},
        /**
         * Función que regresa al paso uno para editar la infomración
         */
        editStepOne: function () {
			this._handleNavigationToStep(0);
		},
        /**
         * Función que regresa al paso dos para editar la infomración
         */
		editStepTwo: function () {
			this._handleNavigationToStep(1);
		},
        /**
         * Función que regresa al paso tres para editar la infomración
         */
		editStepThree: function () {
			this._handleNavigationToStep(2);
		},
        /**
         * Función que regresa al wizard en el paso indicado
         * @param {*} iStepNumber 
         */
        _handleNavigationToStep: function (iStepNumber) {
			var fnAfterNavigate = function () {
				this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
				this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}.bind(this);

			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this.backToWizardContent();
		},

    });
});