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