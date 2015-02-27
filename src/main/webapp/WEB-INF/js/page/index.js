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
			navbar: {
				items: [ logoutControl({ action : contextPath("/logout") }) ],
			},
			onShow: function(body) {
				$("#logoutForm").csrf();
			},
		});
	};
	
	return {
		initialize: initialize,
	};
});