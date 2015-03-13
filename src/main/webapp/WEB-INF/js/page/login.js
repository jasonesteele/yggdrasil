/**
 * Applicant login page.
 */
define(['jquery', 
        'gui/body',
        'util/contextPath',
        'util/csrf',
        'util/validation',
        'util/notify',
], function($, body, contextPath) {
	var initialize = function() {
		body.initialize({
			title: 'Login',
			contents: "<h1>Front Page</h1>",
			onShow: function(body) {
				// Display error modal if required="required"
				if (window.location.href.indexOf('?error') >= 0) {
					require(['gui/modal',
					         'hbs!templates/loginErrorMessage',
					], function(modal, message) {
						var errorMessage = $('meta[name="_lastSecurityError"]').attr('content');
						if (!errorMessage) errorMessage = 'Unknown security error';
						modal.show({
							content: message({
								title: 'Security Error',
								error: errorMessage,
								recoverAccountUrl: contextPath("/page/verify/recover"),
							}),
							parent: body,
						});
					});
				}

				// Display logout message modal if required
				if (window.location.href.indexOf('?logout') >= 0) {
					$.notify('You have been logged out', 'info');
				}
			},
		});
	}

	return {
		initialize: initialize
	}
});