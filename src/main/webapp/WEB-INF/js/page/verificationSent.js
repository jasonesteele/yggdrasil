/**
 * Applicant login page.
 */
define(['jquery', 
        'gui/body',
        'util/contextPath',
        'hbs!templates/verificationSent',
], function($, body, contextPath, verified) {
	var initialize = function() {
		body.initialize({
			title: 'Account Verification Sent',
			contents: verified(),
		});
		
		$(function() {
			$.getJSON(contextPath("/api/public/session"))
				.done(function(data) {
					if (data) {
						$('#verification').html(data.email);
					} 
				});
		});
	};
	
	return {
		initialize: initialize,
	};
});