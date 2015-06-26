/// <reference path="../../typescript.definitions/dm.core.d.ts""/>

window.dm.types.List = function (array) {
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
		
		return new dm.types.List(whereResults);
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
		
		return new dm.types.List(pluckResults);
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
	
	return arr;	
};