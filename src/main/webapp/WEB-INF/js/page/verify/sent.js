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
						$('#verificationTo').html("<em>" + data.email + "</em>");
					} 
				});
		});
	};
	
	return {
		initialize: initialize,
	};
});