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