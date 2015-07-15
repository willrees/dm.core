window.dm = (function (){
	var dm = function (selector) { 
		return new dm.fn.init(selector);	
	};
	
	dm.config = {
		basePath: undefined,	
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
		componentFactory(componentName, component, settings, dependencies, false)
	};
	
	dm.globalComponentFactory = function (componentName, component, settings, dependencies) {
		componentFactory(componentName, component, settings, dependencies, true)
	};
	
	
	dm.bind = function (settings) {
		if (settings != undefined) {
			this.config = jQuery.extend(true, this.config, settings);
		}
		for (var i = 0; i < this.registeredComponents.length; i++) {
			var componentDef = this.registeredComponents[i];
			if (componentDef.initialized === false) {
				componentDef.initialized = true;
				var namespace = (componentDef.global) ? dm : dm.fn;
				namespace[componentDef.name] = componentDef.component.apply(namespace[componentDef.name], componentDef.dependencies);
			}
		}
	};
	
	function componentFactory(componentName, component, settings, dependencies, global)	{
		var namespace = (global) ? dm : dm.fn;
		
		if (namespace[componentName] === undefined) {
			
			if (settings !== undefined && settings !== null)
			{
				dm.config[componentName] = settings;
			}
			
			dm.registeredComponents.push({
				name: componentName,
				component: component,
				dependencies: dependencies,
				initialized: false,
				global: global
			}); 
		}	
	}
	
	return dm;
})();