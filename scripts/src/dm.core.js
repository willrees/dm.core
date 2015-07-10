window.dm = (function (){
	var dm = function (selector) { 
		return new dm.fn.init(selector);	
	};
	
	dm.config = {
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
	
	dm.registeredComponents = [];
		dm.fn = dm.prototype;
		
		dm.fn.init = function (selector) {			
			this.selector = selector;
			console.log(this);
			return this;
		};
		
		dm.fn.init.prototype = dm.prototype;
		
		dm.componentFactory = function (componentName, component, settings, dependencies) {
			if (this.fn[componentName] === undefined) {
				
				if (settings !== undefined && settings !== null)
				{
					this.config[componentName] = settings;
				}
				
				this.registeredComponents.push({
					name: componentName,
					component: component,
					dependencies: dependencies,
					initialized: false
				}); 
			}	
		};
		
		dm.bind = function (settings) {
			if (settings != undefined) {
				this.config = jQuery.extend(true, this.config, settings);
			}
			for (var i = 0; i < this.registeredComponents.length; i++) {
				var componentDef = this.registeredComponents[i];
				if (componentDef.initialized === false) {
					componentDef.initialized = true;
					this.fn[componentDef.name] = componentDef.component(componentDef.dependencies);
				}
			}
		};
	
	return dm;
})();