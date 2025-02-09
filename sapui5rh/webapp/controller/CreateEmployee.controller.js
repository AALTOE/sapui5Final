sap.ui.define([
    "com/logali/sapui5rh/controller/Base.controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], (Base, JSONModel, MessageBox) => {
    "use strict";

     /**
     * @param {sap.ui.model.json.JSONModel} JSONModel
     * @param {sap.m.MessageBox} MessageBox
     * @returns 
     */

    return Base.extend("com.logali.sapui5rh.controller.CreateEmployee", {

        onBeforeRendering: function () {
            //Iniciamos el modelo 
            this._employeeTypeModel();
            //Variable global del modelo
            this.oTypeEmployeeM = this.getView().getModel("objTypeEmployee");
        },

        onInit() {
            //Variable global para el objeto del NavContainer por id
            this._oNavContainer = this.byId("wizardNavContainer");
            //Variable global para obtener el objeto wizard por id
            this._wizard = this.byId("createEmployeeWizard");
            //Variable global para obtener la página donde se encuentra el Wizard
            this._oWizardContentPage = this.byId("wizardContentPage");
            this.disableBtnStep();
        },

        /**
        * FUNCIÓN QUE CREA UN MODELO TEMPORAL PARA EL TIPO DE EMPLEADO 
        * "INTERNO" "AUTONOMO" "GERENTE", POR DEFAULT SE GENERA COMO "INTERNO"
        * @author :  Alex Alto
        * @version:  1.0
        * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
        */
       _employeeTypeModel: function(){
           var oViewModel;
           oViewModel = new JSONModel({});
           this.getView().setModel(oViewModel, "objTypeEmployee");
       },
        /**
        * FUNCIÓN QUE HABILITAR los CAMPOS DEL FOMRULARIO,
        * DEPENDIENDO EL TIPO DE EMPLEADO
        * @author :  Alex Alto
        * @version:  1.0
        * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
        */
       _selectEmployee : function (oEvent){
            //Obtenemos el texto del boton seleccionado
            let employeeType      = oEvent.getParameters().item.getText();
            //Obtenemos el modelo
            this.oTypeEmployeeM.setProperty("/EMPLOYEETEXT", employeeType);
            //Obtenemos los recursos del i18n
            let oResourceBundle   = this.getView().getModel("i18n").getResourceBundle();
            //Validamos el tipo de empleado
            if(employeeType === oResourceBundle.getText("bntAut")){
                //Establece la configuración para el empleado Autonomo
                this.oTypeEmployeeM.setProperty("/EMPLOYEINTER", false); //Interno
                this.oTypeEmployeeM.setProperty("/EMPLOYEAUT", true);    //Autonomo
                this.oTypeEmployeeM.setProperty("/EMPLOYEGER", false);   //Gerente
                this.oTypeEmployeeM.setProperty("/INPUTDNI", false);     //DNI
                this.oTypeEmployeeM.setProperty("/INPUTCFI", true);      //CFI
                this.oTypeEmployeeM.setProperty("/INPUTPRICE", true);    //Precio diario    
                this.oTypeEmployeeM.setProperty("/INPUTSALARY", false);  //Saldo bruto anual
                this.oTypeEmployeeM.setProperty("/SLIDERMIN", 100);      //Valor minumo
                this.oTypeEmployeeM.setProperty("/SLIDERMAX", 2000);     //Valor maximo  
                this.oTypeEmployeeM.setProperty("/SLIDERSTEP", 100);     //Intervalo
                this.oTypeEmployeeM.setProperty("/SLIDERVALUE", 400);    //Valor por defecto    
            }else if(employeeType === oResourceBundle.getText("btnGer")){
                //Establece la configuración para el empleado Gerente
                    this.oTypeEmployeeM.setProperty("/EMPLOYEINTER", false);
                    this.oTypeEmployeeM.setProperty("/EMPLOYEAUT", false);
                    this.oTypeEmployeeM.setProperty("/EMPLOYEGER", true);
                    this.oTypeEmployeeM.setProperty("/INPUTDNI", true);
                    this.oTypeEmployeeM.setProperty("/INPUTCFI", false);
                    this.oTypeEmployeeM.setProperty("/INPUTPRICE", false);
                    this.oTypeEmployeeM.setProperty("/INPUTSALARY", true);
                    this.oTypeEmployeeM.setProperty("/SLIDERMIN", 50000);
                    this.oTypeEmployeeM.setProperty("/SLIDERMAX", 200000);
                    this.oTypeEmployeeM.setProperty("/SLIDERSTEP", 1000);
                    this.oTypeEmployeeM.setProperty("/SLIDERVALUE", 70000);
                }else{
                    //Establece la configuración para el empleado Interno
                    this.oTypeEmployeeM.setProperty("/EMPLOYEINTER", true);
                    this.oTypeEmployeeM.setProperty("/EMPLOYEAUT", false);
                    this.oTypeEmployeeM.setProperty("/EMPLOYEGER", false);
                    this.oTypeEmployeeM.setProperty("/INPUTDNI", true);
                    this.oTypeEmployeeM.setProperty("/INPUTCFI", false);
                    this.oTypeEmployeeM.setProperty("/INPUTPRICE", false);
                    this.oTypeEmployeeM.setProperty("/INPUTSALARY", true);
                    this.oTypeEmployeeM.setProperty("/SLIDERMIN", 12000);
                    this.oTypeEmployeeM.setProperty("/SLIDERMAX", 80000);
                    this.oTypeEmployeeM.setProperty("/SLIDERSTEP", 1000);
                    this.oTypeEmployeeM.setProperty("/SLIDERVALUE", 24000);
                }
            //Avanzamos al paso dos | Si editamos el paso uno, se mantiene y no se avanza
		    if(this._wizard.getCurrentStep() === this.byId("employeeTypeStep").getId()){
			    this._wizard.nextStep();
            }
            //Validamos el formulario para no mostar el botón paso 3
            this.validationForm();
            //Refresca el modelo
            this.oTypeEmployeeM.refresh();
       },
       /**
        * FUNCIÓN QUE MUESTRA UN MENSAJE DE CONFIRMACIÓN PARA CANCELA EL PROGRESO
        * @author :  Alex Alto
        * @version:  1.0
        * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
        */
       cancelProgress : function () {
        let oResourceBundle   = this.getView().getModel("i18n").getResourceBundle();
        this.showMessageBoxType("warning", oResourceBundle.getText("cancelTitle"), oResourceBundle.getText("cancelMSG"), 0);
       },
       /**
        * FUNCIÓN QUE VALIDA EL CAMPO NOMBRE CON SOLO LETRAS
        * @author : Alex Alto
        * @param  : {*} oEvent
        * @version: 1.0
        * @History: La primera versión fue escrita por Alex Alto Feb - 2025
        */
        _validName: function (oEvent) {
            let sName = oEvent.getParameter("value");
            if (this.validOnlyText(sName) && sName != '') {
                this.oTypeEmployeeM.setProperty("/SATENAME", "Success");
                this.oTypeEmployeeM.setProperty("/EMPLOYEENAME", sName);
            }
            else {
                this.oTypeEmployeeM.setProperty("/SATENAME", "Error");
            }
            this.oTypeEmployeeM.refresh();
            this.validationForm();
        },
        /**
        * FUNCIÓN QUE VALIDA EL CAMPO APELLIDOS CON SOLO LETRAS
        * @author : Alex Alto
        * @param  : {*} oEvent
        * @version: 1.0
        * @History: La primera versión fue escrita por Alex Alto Feb - 2025
        */
        _validLastName: function (oEvent) {
            let sLastName = oEvent.getParameter("value");
            if (this.validOnlyText(sLastName) && sLastName != '') {
                this.oTypeEmployeeM.setProperty("/SATELASTNAME", "Success");
                this.oTypeEmployeeM.setProperty("/EMPLOYEELASTNAME", sLastName);
            }
            else {
                this.oTypeEmployeeM.setProperty("/SATELASTNAME", "Error");
            }
            this.oTypeEmployeeM.refresh();
            this.validationForm();
        },
        /**
        * FUNCIÓN QUE VALIDA EL FOMATO DEL CAMPO DNI EN ESPAÑA
        * EJEMPLO: 01234567L
        * @author : Alex Alto
        * @param  : {*} oEvent
        * @version: 1.0
        * @History: La primera versión fue escrita por Alex Alto Feb - 2025
        */
        _validDNI: function (oEvent) {
            let sDNI = oEvent.getParameter("value");
            if (this.validateDNISpain(sDNI) && sDNI != '') {
                this.oTypeEmployeeM.setProperty("/SATEDNI", "Success");
                this.oTypeEmployeeM.setProperty("/EMPLOYEEDNI", sDNI);
            }
            else {
                this.oTypeEmployeeM.setProperty("/SATEDNI", "Error");
            }
            this.oTypeEmployeeM.refresh();
            this.validationForm();
        },
        /**
        * FUNCIÓN QUE VALIDA EL CAMPO CIF
        * EJEMPLO: 01234567L
        * @author : Alex Alto
        * @param  : {*} oEvent
        * @version: 1.0
        * @History: La primera versión fue escrita por Alex Alto Feb - 2025
        */
        _validCIF: function (oEvent) {
            let sCIF = oEvent.getParameter("value");
            if (sCIF != '') {
                this.oTypeEmployeeM.setProperty("/SATECIF", "Success");
                this.oTypeEmployeeM.setProperty("/EMPLOYEECIF", sCIF);
            }
            else {
                this.oTypeEmployeeM.setProperty("/SATECIF", "Error");
            }
            this.oTypeEmployeeM.refresh();
            this.validationForm();
        },
        /**
        * FUNCIÓN QUE VALIDA EL CAMPO Fecha Incorporación DONDE LA FECHA SEA VALIDA
        * @author : Alex Alto
        * @param  : {*} oEvent
        * @version: 1.0
        * @History: La primera versión fue escrita por Alex Alto Feb - 2025
        */
        _validDate: function (oEvent) {
            let sDate = oEvent.getParameter("value");
            try {
                if (oEvent.getSource().isValidValue() && sDate != '') {
                    this.oTypeEmployeeM.setProperty("/SATEDATE", "Success");
                    this.oTypeEmployeeM.setProperty("/EMPLOYEEDATE", sDate);
                    this.oTypeEmployeeM.setProperty("/EMPLOYEEDATEVALUE", oEvent.getSource().mProperties.dateValue);
                }
                else {
                    this.oTypeEmployeeM.setProperty("/SATEDATE", "Error");
                }
                this.oTypeEmployeeM.refresh();
            } catch (error) { }
            this.validationForm();
        },
        /**
        *FUNCIÓN QUE VALIDA SI ESTA COMPLETO EL FOMRULARIO DE MANERA CORRECTA PARA HABILITAR
        * EL PASO 3
        * @author : Alex Alto
        * @version: 2.0
        * @History:  La primera versión fue escrita por Alex Alto Feb - 2025
        */
       validationForm: function () {
            let vsName      = this.oTypeEmployeeM.getProperty("/SATENAME");
            let vsLastName  = this.oTypeEmployeeM.getProperty("/SATELASTNAME");
            let vsCIF       = this.oTypeEmployeeM.getProperty("/SATECIF");
            let vsDNI       = this.oTypeEmployeeM.getProperty("/SATEDNI");
            let vsDate      = this.oTypeEmployeeM.getProperty("/SATEDATE");
           //Se valida la bandera isValidForm y muestra el botón
           if ((vsName === "Success") && (vsLastName === "Success") && ((vsCIF === "Success" || vsDNI === "Success")) && (vsDate=== "Success")) {
                this._wizard.validateStep(this.byId("employeesData"));
            } else {
                //De lo contrario no muesta el botón
                this._wizard.invalidateStep(this.byId("employeesData"));
            }
        },
        /**
        * FUNCIÓN QUE VALIDA SI AGREGARON ARCHIVOS Y GENERA UN ARREGLO EN EL MODELO
        * CON LA LISTA DE ARCHIVOS SELECCIONADOS
        * EL PASO 3
        * @author : Alex Alto
        * @version: 2.0
        * @History:  La primera versión fue escrita por Alex Alto Feb - 2025
        */
        setFilesModel : function () {
            //Obtiene el objeto del ID uploadCollection
            var oUploadCollection = this.byId("uploadCollection");
            //Obtiene los items
            var ofiles = oUploadCollection.getItems();
            //Obtiene la cantidad de archivos
            var onumFiles = oUploadCollection.getItems().length;
            //SETEA EL NUMERO DE ARCHIVOS AL MODELO
            this.oTypeEmployeeM.setProperty("/NUMFILES", onumFiles);
            //SI SE CARGO UN ARCHIVO
            if (onumFiles > 0) {
                var arrayFiles = [];
                for (var i in ofiles) {
                    //LOS INGRESA E UN ARRREGLO CON SU NOMBRE Y TIPO DE MEDIO
                    arrayFiles.push({ FileName: ofiles[i].getFileName(), MimeType: ofiles[i].getMimeType() });
                }
                //SETEA EL ARREGLO DE ARCHIVOS AL MODELO
                this.oTypeEmployeeM.setProperty("/FILES", arrayFiles);
            } else {
                //SETEA EL ARREGLO VACIO DE ARCHIVOS AL MODELO CUANDO NO SE SELEECIONE NINGUNO
                this.oTypeEmployeeM.setProperty("/FILES", []);
            }
            //Refresca el modelo
            this.oTypeEmployeeM.refresh(); 
        },
         /**
         * FUNCIÓN QUE AL TERMINAR DE LLENAR LOS FORMULARIOS
         * ENVIA UNA NUEVA VISTA PARA REVISAR LOS DATOS INGRESADOS
         * @author : Alex Alto
         * @version: 2.0
         * @History:  La primera versión fue escrita por Alex Alto Feb - 2025
         */
        wizardCompletedHandler: function () {
            this.setFilesModel();
            this._oNavContainer.to(this.byId("wizardReviewPage"));
        },
        /**
        * FUNCIÓN QUE REGRESA AL WIZARD
        * @author : Alex Alto
        * @version: 2.0
        * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
        */
        backToWizardContent: function () {
            this._oNavContainer.backToPage(this._oWizardContentPage.getId());
        },
        /**
        * FUNCIÓN QUE REGRESA AL PASO UNO PARA EDITAR LA INFOMRACIÓN
        * @author : Alex Alto
        * @version: 2.0
        * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
        */
        editStepOne: function () {
			this._handleNavigationToStep(0);
		},
        /**
        * FUNCIÓN QUE REGRESA AL PASO DOS PARA EDITAR LA INFOMRACIÓN
        * @author : Alex Alto
        * @version: 2.0
        * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
        */
		editStepTwo: function () {
			this._handleNavigationToStep(1);
		},
        /**
        * FUNCIÓN QUE REGRESA AL TRES UNO PARA EDITAR LA INFOMRACIÓN
        * @author : Alex Alto
        * @version: 2.0
        * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
        */
		editStepThree: function () {
			this._handleNavigationToStep(2);
		},
        /**
        * FUNCIÓN QUE REGRESA AL WIZARD EN EL PASO INDICADO
        * @author : Alex Alto
        * @version: 1.0
        * @History:  La primera versión fue escrita por Alex Alto Ene - 2025
        */
        _handleNavigationToStep: function (iStepNumber) {
			var fnAfterNavigate = function () {
				this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
				this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}.bind(this);

			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this.backToWizardContent();
		},
        /**
        * FUNCIÓN QUE GENERA EL TOKEN AL SELECCIONAR UN ARCHIVO Y
        * LOS GUARDA EN CABECERA
        * @author : Alex Alto
        * @version: 1.0
        * @History:  La primera versión fue escrita por Alex Alto Feb - 2025
        */
        onFileChange : function (oEvent) {
            let oUploadCollection = oEvent.getSource();
            let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
              name: "x-csrf-token",
              value: this.getView().getModel("employeeModel").getSecurityToken()
            });
            oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
        },
        /**
        * FUNCIÓN QUE INCIA LA CARGA DE ARCHIVOS EN EL SERVIDOR
        * @author : Alex Alto
        * @version: 1.0
        * @History:  La primera versión fue escrita por Alex Alto Feb - 2025
        */
         onStartUpload : function () {
            var that = this;
            var oUploadCollection = that.byId("uploadCollection");
            oUploadCollection.upload();
        },
        /**
        * FUNCIÓN QUE ENVIA EL SLUG JUNTO CON LA INFOMRACIÓN DE LOS ARCHIVOS
        * @author : Alex Alto
        * @version: 1.0
        * @History:  La primera versión fue escrita por Alex Alto Feb - 2025
        */
        onFileBeforeUpload : function (oEvent){
            let fileName = oEvent.getParameter("fileName");
            let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
              name : "slug",
              value : this.getOwnerComponent().SapId+";"+this.oTypeEmployeeM.getProperty("/IDNEWUSER")+";"+fileName
            });
            oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        },
        /**
        * FUNCIÓN QUE PREPARA TODOS LOS DATOS NECESARIOS PARA LA CREACIÓN DEL USUARIO
        * @author : Alex Alto
        * @version: 1.0
        * @History:  La primera versión fue escrita por Alex Alto Feb - 2025
        */
        _CreateEmployee : function (){
            //Validamos que tipo de empleado se va a crear
            let sTypeEmployee;
            let sDNICIF;
            if(this.oTypeEmployeeM.getProperty("/EMPLOYEINTER")){
                sTypeEmployee = "0";
                sDNICIF = this.oTypeEmployeeM.getProperty("/EMPLOYEEDNI");
            }else if(this.oTypeEmployeeM.getProperty("/EMPLOYEAUT")){
                sTypeEmployee = "1";
                sDNICIF = this.oTypeEmployeeM.getProperty("/EMPLOYEECIF");
            }else if(this.oTypeEmployeeM.getProperty("/EMPLOYEGER")){
                sTypeEmployee = "2";
                sDNICIF = this.oTypeEmployeeM.getProperty("/EMPLOYEEDNI");
            }
            //Generamos el objeto con los datos correspondientes
            let body = {
                Type        : sTypeEmployee,
                SapId       : this.getOwnerComponent().SapId,
                FirstName   : this.oTypeEmployeeM.getProperty("/EMPLOYEENAME"),
                LastName    : this.oTypeEmployeeM.getProperty("/EMPLOYEELASTNAME"),
                Dni         : sDNICIF,
                CreationDate: this.oTypeEmployeeM.getProperty("/EMPLOYEEDATEVALUE"), 
                Comments    : this.oTypeEmployeeM.getProperty("/EMPLOYEECOMMENT")
            };
            //Agregamos una nueva propiedad
            body.UserToSalary = [{
                Amount  : parseFloat(this.oTypeEmployeeM.getProperty("/SLIDERVALUE")).toString(),
                Comments: this.oTypeEmployeeM.getProperty("/EMPLOYEECOMMENT"),
                Waers   : "EUR"
            }];
            //Guardamos el mensaje de confimración
            let msgCreateEmployee   = this.oView.getModel("i18n").getResourceBundle().getText("confirmNewEmployee", 
                                    this.oTypeEmployeeM.getProperty("/EMPLOYEENAME"));
            //Ejecutamos un mensaje de confirmación
            this.showMessageCRUD("create", msgCreateEmployee, "warning", "/Users", body);
        }
    });
});