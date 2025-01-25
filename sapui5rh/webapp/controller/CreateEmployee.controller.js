sap.ui.define([
    "com/logali/sapui5rh/controller/Base.controller"
], (Base) => {
    "use strict";

    return Base.extend("com.logali.sapui5rh.controller.CreateEmployee", {
        onInit() {
            //Variable global para el objeto del NavContainer por id
            this._oNavContainer = this.byId("wizardNavContainer");
            //Variable global para obtener el objeto wizard por id
            this._wizard = this.byId("CreateProductWizard");
            //Variable global para obtener la página donde se encuentra el Wizard
            this._oWizardContentPage = this.byId("wizardContentPage");
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