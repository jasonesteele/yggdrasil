/**
 * Applicant login page.
 */
define(['jquery', 
        'gui/body',
        'hbs!templates/resendActivation',
        'util/contextPath',
        'util/csrf',
        'util/validation',
        'util/notify',
], function($, body, contents, contextPath) {
	var initialize = function() {
		body.initialize({
			title: 'Resend Activation',
			contents: contents(),
			navbar: {
				autoFocus: false,
			},
			onShow: function (container) {
				var form = container.find('form');
				var submitButton = form.find('button');
				
				form.find('input').on('keypress', function(e) {
					var code = (e.keyCode ? e.keyCode : e.which);
					if (code == 13) {
						if (!submitButton.prop('disabled')) {
							submitButton.trigger('click');
						}
						e.preventDefault();
					}
				});
				
				form.csrf();
				form.validate({
					rules: {
						email: {
							required: true,
							email: true,
						},
					},
					messages: {
						createEmail: {
							required: "E-mail address is required",
							email: "Enter a valid e-mail address",
						},
					},
					errorPlacement: function(error, element) {
						$(element).prev('.form-control-header').find('.error').html(error);
					},
					submitHandler: function() {
						var emailVal = form.find('input[name*="email"]').val();
						$.ajax({
							type: "POST",
							url: contextPath("/api/public/account/resend"),
							contentType: "application/json; charset=utf-8",
							dataType: "json",
							data: JSON.stringify({
								email: emailVal,
							}),
						}).done(function(data) {
							$.notify("A new verification e-mail has been sent to " + emailVal, 'success');
							form.ajaxSubmit();
						}).fail(function(msg) {
							$.notify("Error resending account verification: " + msg.statusText, 'error');
							// TODO - if account already verified, show different error
						});
					},
				});
				
				form.find("#email").focus();
			},
		});
	}
	
	return {
		initialize: initialize,
	};
});