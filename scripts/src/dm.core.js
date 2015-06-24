/// <reference path="../../typescript.definitions/dm.core.d.ts""/>

window.dm = window.dm || {};
window.dm.types = window.dm.types || {};
window.dm.utilities = window.dm.utilities || {};

window.dm.config = {
	basePath: undefined,
	errors: {
		redirectOnErrors: true,
		defaultErrorPage: undefined	
	},
	authentication: {
		usesAuthentication: true,
		loginPage: undefined
	}	
};