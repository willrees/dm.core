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
/// <reference path="../../typescript.definitions/dm.core.d.ts""/>

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
/// <reference path="../../typescript.definitions/dm.core.d.ts""/>

window.dm.http = function ($, configuration) {

    var settings = {
        debug: false,
        validateAntiForgeryToken: false,
        redirectOnAllErrors: false                
    };

    var send = function (options) {
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
    };    

    var redirectToErrorView = function (d) {
        if ((d.status === 450 || d.status === 401 || d.status === 403) && configuration.authentication.usesAuthentication) {
            window.location = settings.loginPage + "?returnUrl=" + window.location.href.replace(settings.basePath, "/");
        } else if (settings.debug === false && configuration.errors.redirectOnErrors) {
            window.location = settings.errorPage;
        } else {
            if (settings.debug) {
                alert("HTTP error occured");
                console.log(arguments);    
            }
        }
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
    
    function areSettingsValid() {
        if (configuration.errors.redirectOnErrors && configuration.errors.defaultErrorPage === undefined) {
            throw "You must set the path to the sites generic error page in dm.configuration.errors.defaultErrorPage";    
        }
        
        if (configuration.authentication.usesAuthentication && configuration.authentication.loginPage === undefined) {
            throw "You must set the path to the sites login page in dm.authentication.loginPage";    
        }        
        
        if (configuration.basePath !== undefined)
        {
            throw "The sites base path has not been configured in dm.configuration.basePath";
        }
    }

    return {
        get: _get,
        post: _post,
        put: _put,
        delete: _delete,
        settings: settings
    };
}(jQuery, dm.config);
(function ($, context) {
	"use strict";

	dm.utilities.date = {
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
	
	return dm.utilities;
})(jQuery, dm.utilities.date);