/**
 * Applicant login page.
 */
define(['jquery', 
        'gui/body',
        'util/contextPath',
        'hbs!templates/menu/logoutControl',
        'util/csrf',
], function($, body, contextPath, logoutControl) {
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