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
				title: 'Verification Error',
				contents: contents({ resendUrl: contextPath("/page/verify/request") }),
			});
		});
	}

	return {
		initialize: initialize
	}
});