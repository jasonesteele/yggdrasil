/**
 * Applicant login page.
 */
define(['jquery', 
        'gui/body',
        'hbs!templates/verified',
], function($, body, verified) {
	var initialize = function() {
		body.initialize({
			title: 'Account Verified',
			contents: verified(),
		});
	};
	
	return {
		initialize: initialize,
	};
});