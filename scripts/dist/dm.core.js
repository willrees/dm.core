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
dm.List = function(array) {
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
dm.globalComponentFactory('cache', function (List) {
	
	var cache = new List();
	
	var get = function (key) {
		var cachedObj = cache.where(function(item) {
			return item.key === key;
		});
		
		return (cachedObj.length === 0) ? undefined : cachedObj[0];
	};
	
	var set = function (key, value) {
		var cachedObj = dm.cache.get(key);
            
		if (cachedObj === undefined || cachedObj === null) {
			cache.push({
				key: key,
				value: value
			});
		} else {
			cachedObj.value = value;
		}
	};
	
	return {
		get: get,
		set: set		
	}
}, null, [dm.List]);
dm.globalComponentFactory("http", function() {
    var config = dm.config.http;
    
    var settings = {
        debug: false,
        validateAntiForgeryToken: false                      
    };
    
    var _get = function (url) {
        return send({
            type: "GET",
            url: url,
            cache: false
        });
    };

    var _post = function (url, data, dataType) {
        
        if (dataType === null || dataType === undefined) {
            dataType = "json"
        }
        
        return send({
            type: "POST",
            url: url,
            cache: false,
            data: data,
            dataType: dataType
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
        
        var deferred = $.Deferred();

        options.success = function (response, status, xhr) {            
            if (response.Success || (response.Success === undefined && xhr.status.toString().indexOf('2') === 0)) {
                //Request was successful. Resolve the promise and pass through the response.
                deferred.resolve(response);
            } else if (response.Success === false) {
                //Request was not successful and was handled gracefully on the server.
                //TODO:: Display frendly error message on client.                
                deferred.reject(response);
            } else {
                if (settings.debug) {
                    alert("HTTP error occured");
                    console.log(arguments);    
                } else {
                    window.location = config.errors.errorPage500;
                }   
            }
        };

        options.error = function (d, textStatus, error) {
            processError(d, textStatus, error);
        };
        
        if (options.data && settings.validateAntiForgeryToken === true) {
            options.data.__RequestVerificationToken = $('input[name="__RequestVerificationToken"]').val();
        }

        $.ajax(options);

        return deferred.promise();
    }
    
    function processError (d) {
        if ((d.status === 450 || d.status === 401 || d.status === 403) && config.authentication.usesAuthentication) {
            window.location = config.authentication.loginPage + "?returnUrl=" + window.location.href.replace(settings.basePath, "/");
        } else if (d.status.toString().indexOf('5') === 0 && settings.debug === false) {
            window.location = config.errors.errorPage500;
        } else if (d.status === 404) {
            window.location = config.errors.errorPage404;
        } else {
            if (settings.debug) {
                alert("HTTP error occured");
                console.log(arguments);    
            } else {
                window.location = config.errors.errorPage500;
            }
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
		errorPage500: '500.html',
        errorPage404: '404.html'
	},
	authentication: {
		usesAuthentication: true,
		loginPage: 'login.html'
	}
}, [jQuery]);
dm.globalComponentFactory("utilities", function($) {	
	var date = {
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
	}
	
	return {
		date: date
	}
}, null, [jQuery]);
dm.globalComponentFactory("dataApi", function (document, $) {
	
	// DOM Cache
	var $doc = $(document);
	
	/******************************************************************************
	 * data-href
	 ******************************************************************************/
	 
	/// <summary>Adds a click handler to any element with the data-href handler.</summary>	
	/// <returns type="void"></returns>
	var dataHrefEvent = function () {
		$doc.on('click', '[data-href]', function (e) {				
			dm.dataApi.dataHref.call(this, e);			
		});
	};
	
	/// <summary>Gets the data-href value from "this" and redirects to that value</summary>	
	/// <returns type="void"></returns>
	var dataHrefHandler = function (e) {		
		e.stopPropagation();
		e.preventDefault();		
		window.location = $(this).data('href');
	};
	
	/******************************************************************************
	 * data-async-submit
	 ******************************************************************************/
	 
	 var dataAsyncSubmitEvent = function () {
		 $doc.on('click', '[data-async-submit="true"]', function (e) {				
			dm.dataApi.dataAsyncFormSubmit.call(this, e);			
		});
	 };
	 
	 var dataAsyncSubmitHandler = function (e) {
		 e.stopPropagation();
		 e.preventDefault();
		 
		 var $triggerElement = $(this);
		 var $form = $($triggerElement.get(0).form);
		 
		 if ($form.valid()) {
			var url = $triggerElement.attr("data-submit-url");
			var data = $form.serialize();
			dm.http.post(url, data, "json")
			.always(function(response) {
				$triggerElement.trigger('async-submit-finished', response);
			});	 
		 }
	 };
	
	var init = function () {
		dataHrefEvent();
		dataAsyncSubmitEvent();	
	};
	
	init();
	
	return {
		dataHref: dataHrefHandler,
		dataAsyncFormSubmit: dataAsyncSubmitHandler
	};
	
}, null, [document, jQuery]);