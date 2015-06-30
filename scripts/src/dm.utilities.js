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
})(jQuery, dm.utilites.date);