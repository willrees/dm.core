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
                deferred.reject(response.Errors);            
            } else {
                //An unknown error occured or the response object was not in the expected format. redirect to the error page.
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