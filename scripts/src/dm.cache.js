dm.globalComponentFactory('CacheProvider', function (List) {
	
	var CacheProvider = function () {
		var cache = new List();
		
		this.get = function (key) {
			var cachedObj = cache.where(function(item) {
				return item.key === key;
			});
			
			return (cachedObj.length === 0) ? undefined : cachedObj[0];
		};
		
		this.set = function (key, value) {
			if (this.containsKey(key) === false) {
				cache.push({
					key: key,
					value: value
				});
			} else {
				this.get(key).value = value;
			}
		};
		
		this.containsKey = function (key) {
			return this.get(key) !== undefined;
		};
		
		this.remove = function (key) {
			if (this.containsKey(key)) {
				var cachedObject = this.get(key);
				cache.remove(cachedObject);
			}	
		};
		
		this.clear = function () {
			cache = new List();	
		};
	};
	
	return CacheProvider;
	
}, null, [dm.List]);