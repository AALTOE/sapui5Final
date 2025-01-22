/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"comlogali/sapui5rh/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});