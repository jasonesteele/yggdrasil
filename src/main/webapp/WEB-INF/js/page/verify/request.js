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
							url: contextPath("/api/public/account/verify"),
							dataType: "json",
							contentType: "application/json; charset=utf-8",
							data: JSON.stringify({
								email: emailVal,
							}),
						}).done(function(data) {
							$.notify("A new verification e-mail has been sent to " + emailVal, 'success');
						}).fail(function(jqXHR, textStatus, errorThrown) {
							var errMsg;
							if (jqXHR.responseJSON) {
								if (jqXHR.status == 404) {
									errMsg = "Account with that e-mail address not found."
								} else {
									errMsg = jqXHR.responseJSON.message;
								}
							} else {
								errMsg = "HTTP " + jqXHR.status + ": " + jqXHR.statusText;
							}
							$.notify("Error: " + errMsg);
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