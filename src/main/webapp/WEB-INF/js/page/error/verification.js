/**
 * Applicant login page.
 */
define(['jquery', 
        'gui/body',
        'util/contextPath',
], function($, body, contextPath) {
	var initialize = function() {
		var template = 'hbs!templates/errorPage/invalidVerification';
		if (window.location.href.indexOf('?expired') >= 0) {
			template = 'hbs!templates/errorPage/expiredVerification';
		}
		
		require([template], function(contents) {
			body.initialize({
				title: 'Error',
				contents: contents({ resendUrl: contextPath("/page/profile") }),
			});
		});
	}

	return {
		initialize: initialize
	}
});