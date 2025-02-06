sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/logali/sapui5rh/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("com.logali.sapui5rh.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        },

        SapId: "alex.alto.espiri@gmail.com"
    });
});