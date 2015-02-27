/**
 * Applicant login page.
 */
define(['jquery', 
        'gui/body',
], function($, body) {
	var initialize = function() {
		body.initialize({
			title: 'Home',
			contents: "<h1>Home Page</h1>",
		});
	};
	
	return {
		initialize: initialize,
	};
});