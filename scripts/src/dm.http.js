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