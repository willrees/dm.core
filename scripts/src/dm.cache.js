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