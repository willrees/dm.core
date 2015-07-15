window.dm = (function (){
	var dm = function (selector) { 
		return new dm.fn.init(selector);	
	};
	
	dm.config = {
		basePath: undefined,	
	};
	
	dm.utilities = {};
	
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
window.dm.List = function (array) {
	"use strict";
	var arr = [];
	
	if (array !== undefined) {
		arr = array;
	}
	
	arr.first = function () {
		return this[0];	
	};
	
	arr.last = function () {
		return this[this.length - 1];	
	};
	
	arr.where = function (test) {
		if (typeof test != "function")
		{
			throw new TypeError();
		}
		
		var whereResults = [];
		arr.forEach(function (item, index, array) {
			if (test(JSON.parse(JSON.stringify(item)))) {
				whereResults.push(item);
			}
 		});
		
		return new dm.List(whereResults);
	};
	
	arr.pluck = function (propertyName) {
		if (typeof propertyName != "string") 
		{
			throw new TypeError();
		}
		
		var pluckResults = [];
		arr.forEach(function (item, index, array) {
			if (item[propertyName] !== undefined) {
				pluckResults.push(item[propertyName]);
			}
		});
		
		return new dm.List(pluckResults);
	};
	
	arr.shuffle = function() {
	  var currentIndex = arr.length;
	  var temporaryValue;
	  var randomIndex ;
	
	  while (0 !== currentIndex) {

	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	
	    temporaryValue = arr[currentIndex];
	    arr[currentIndex] = arr[randomIndex];
	    arr[randomIndex] = temporaryValue;
	  }
	
	  return arr;
	};
	
	//IE8 Polyfills
	  if (!arr["forEach"]) {
		  arr.forEach = function (callback) {
			  for (var i=0; i < this.length; i++) {
				  callback.apply(this, [this[i], i, this]);
			  }
		  };
	  }
	  
	  if (!arr["indexOf"]) {
		  arr.indexOf = function (obj, start) {
			  for (var i = (start || 0), j = this.length; i < j; i++) {
				  if (this[i] === obj) {
					  return i;
				  }
			  }
		  };
	  }
	
	return arr;	
};
dm.globalComponentFactory("featureDetection", function(document) {
	var tests = [];
	var createTest = function (testName, test, validClass, inValidClass) {
		tests.push({
			name: testName,
			test: test,
			validClass: validClass,
			inValidClass: inValidClass
		});
	};
	
	var runTests = function () {
		var classes = "";
		
		while(tests.length>0) {
			var test = tests.pop();
			if (test.test()) {
				classes = classes + " " + test.validClass;
			} else {
				classes = classes + " " + test.inValidClass;
			}
		}
		
		var html = document.querySelectorAll("html");
		html[0].className = html[0].className + classes;
	}
	
	function detectCSSFeature(featurename){
	    var feature = false,
	    domPrefixes = 'Webkit Moz ms O'.split(' '),
	    elm = document.createElement('div'),
	    featurenameCapital = null;
	
	    featurename = featurename.toLowerCase();
	
	    if( elm.style[featurename] !== undefined ) { feature = true; } 
	
	    if( feature === false ) {
	        featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1);
	        for( var i = 0; i < domPrefixes.length; i++ ) {
	            if( elm.style[domPrefixes[i] + featurenameCapital ] !== undefined ) {
	              feature = true;
	              break;
	            }
	        }
	    }
	    return feature; 
	}
	
	createTest('hasTouch', function() {
		return 'ontouchstart' in window // works on most browsers 
  			|| 'onmsgesturechange' in window; // works on ie10	
	}, 'touch', 'no-touch');
	
	createTest('hasCssTransition', function() {
		return detectCSSFeature('transition');
	}, 'csstransitions', 'no-csstransitions');
	
	createTest('hasCssTransforms', function() {
		return detectCSSFeature('transform');
	}, 'csstransform', 'no-csstransform');
	
	createTest('hasCssAnimation', function() {
		return detectCSSFeature('animation');
	}, 'cssanimation', 'no-cssanimation');
	
	if (dm.config.featureDetection.enabled) {
		runTests();	
	}
	
	return {
		runTests: runTests,
		createTest: createTest
	}
	
}, {enabled: false}, [document]);
dm.globalComponentFactory("http", function() {
    var config = dm.config;
    
    var settings = {
        debug: false,
        validateAntiForgeryToken: false,
        redirectOnAllErrors: false                
    };
    
    var _get = function (url) {
        return send({
            type: "GET",
            url: url,
            cache: false
        });
    };

    var _post = function (url, data) {
        return send({
            type: "POST",
            url: url,
            cache: false,
            data: data
        });
    };

    var _put = function (url, data) {
        return send({
            type: "PUT",
            url: url,
            cache: false,
            data: data
        });
    };

    var _delete = function (url, data) {
        return send({
            type: "DELETE",
            url: url,
            cache: false,
            data: data
        });
    };
    
    function send (options) {
        areSettingsValid();
        var deferred = $.Deferred();

        options.success = function (response, status, xhr) {
            if (response.Success || (response.Success === undefined && xhr.status === 200)) {
                deferred.resolve(response);
            } else if (settings.redirectOnAllErrors === true) {
                redirectToErrorView(xhr);
            } else {
                deferred.reject(response.Errors);
            }
        };

        options.error = function (d, textStatus, error) {
            redirectToErrorView(d, textStatus, error);
        };
        
        if (options.data && settings.validateAntiForgeryToken === true) {
            options.data.__RequestVerificationToken = $('input[name="__RequestVerificationToken"]').val();
        }

        $.ajax(options);

        return deferred.promise();
    }
    
    function redirectToErrorView (d) {
        if ((d.status === 450 || d.status === 401 || d.status === 403) && config.http.authentication.usesAuthentication) {
            window.location = settings.loginPage + "?returnUrl=" + window.location.href.replace(settings.basePath, "/");
        } else if (settings.debug === false && config.http.errors.redirectOnErrors) {
            window.location = settings.errorPage;
        } else {
            if (settings.debug) {
                alert("HTTP error occured");
                console.log(arguments);    
            }
        }
    }
    
    function areSettingsValid() {
        if (config.http.errors.redirectOnErrors && config.http.errors.defaultErrorPage === undefined) {
            throw "You must set the path to the sites generic error page in dm.config.http.errors.defaultErrorPage";    
        }
        
        if (config.http.authentication.usesAuthentication && config.http.authentication.loginPage === undefined) {
            throw "You must set the path to the sites login page in dm.config.http.authentication.loginPage";    
        }        
        
        if (config.basePath !== undefined)
        {
            throw "The sites base path has not been configured in dm.config.basePath";
        }
    }
    
    return {
        get: _get,
        post: _post,
        put: _put,
        delete: _delete,
        settings: settings
    };
     
}, 
{
    errors: {
		redirectOnErrors: true,
		defaultErrorPage: undefined	
	},
	authentication: {
		usesAuthentication: true,
		loginPage: undefined
	}
}, [jQuery]);
dm.utilities.date = (function ($) {
	"use strict";
	
	return {
		/**
		 * Checks a string to determine if it is a valid date.
		 * @param {string} txtDate - a string representation of a date.
		 * @return {bool} 
		 */
		isDate: function(txtDate) {
			var currVal = txtDate;
			if (currVal === '')
				return false;
	
			//Declare Regex  
			var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
			var dtArray = currVal.match(rxDatePattern); // is format OK?
	
			if (dtArray === null)
				return false;
	
			//Checks for mm/dd/yyyy format.
			var dateMonth = parseInt(dtArray[1]);
			var dateDay = parseInt(dtArray[3]);
			var dateYear = parseInt(dtArray[5]);
	
			if (dateMonth < 1 || dateMonth > 12)
				return false;
			else if (dateDay < 1 || dateDay > 31)
				return false;
			else if ((dateMonth == 4 || dateMonth == 6 || dateMonth == 9 || dateMonth == 11) && dateDay == 31)
				return false;
			else if (dateMonth == 2) {
				var isleap = (dateYear % 4 === 0 && (dateYear % 100 !== 0 || dateYear % 400 === 0));
				if (dateDay > 29 || (dateDay == 29 && !isleap))
					return false;
			}
			return true;
		}
	};
	
})(jQuery);