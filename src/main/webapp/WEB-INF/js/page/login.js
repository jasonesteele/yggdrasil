/**
 * Applicant login page.
 */
define(['jquery', 
        'gui/body',
        'util/contextPath',
        'hbs!templates/menu/loginForm',
        'util/csrf',
        'util/validation',
        'util/notify',
], function($, body, contextPath, loginForm) {
	/**
	 * Set up javascript hooks for login form.
	 */
	var initializeLoginForm = function(body) {
		var form = body.find('#loginForm');
		var usernameInput = form.find("input[name*='username']");
		var passwordInput = form.find("input[name*='password']");
		var submitButton = form.find("button");
		var createAccount = form.find("a");

		form.find('input').on('keypress', function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if (code == 13) {
				if (!submitButton.prop('disabled')) {
					submitButton.trigger('click');
				}
				e.preventDefault();
			}
		});
		form.find('input').on('keyup', function(e) {
			if (usernameInput.val() && passwordInput.val())
				submitButton.prop('disabled', null);
			else
				submitButton.prop('disabled', 'disabled');
		});
		form.csrf();

		createAccount.on('click', function(e) {
			require(['gui/modal',
			         'hbs!templates/createAccountForm',
			], function(modal, message) {
				modal.show({
					content: message(),
					onShow: function(modal) {
						var form = modal.find('form');
						form.csrf();
						form.validate({
							rules: {
								createUsername: {
									required: true,
									minlength: 3,
									regex: '^[a-zA-Z0-9]+$',
									// TODO - add check for username already in use
								},
								createEmail: {
									required: true,
									email: true,
									// TODO - add check for email already in use
								},
								createPassword: { 
									required: true,
									minlength: 8,
								},
								createConfirmPassword: {
									required: true,
									equalTo: '#createPassword',
								},
							},
							messages: {
								createUsername: { 
									required: "Username is required",
									minlength: $.validator.format("Username must be at least {0} characters"),
									regex: "Username must contain only letters and digits",
								},
								createEmail: {
									required: "E-mail address is required",
									email: "Enter a valid e-mail address",
								},
								createPassword: {
									required: "Password is required",
									minlength: $.validator.format("Password must be at least {0} characters"),
								},
								createConfirmPassword: { 
									required: "Re-enter password",
									equalTo: "Passwords must match",
								},
							},
							errorPlacement: function(error, element) {
								$(element).prev('.form-control-header').find('.error').html(error);
							},
							submitHandler: function() {
								$.ajax({
									type: "POST",
									url: contextPath("/api/public/newAccount"),
									contentType: "application/json; charset=utf-8",
									dataType: "json",
									data: JSON.stringify({
										username: modal.find('input[name*="createUsername"]').val(),
										email: modal.find('input[name*="createEmail"]').val(),
										password: modal.find('input[name*="createPassword"]').val(),
									}),
								}).done(function(data) {
									window.location.href = contextPath();
								}).fail(function(msg) {
									$.notify("Error creating account: " + msg.statusText);
								});
							},
						});

						var submitButton = modal.find('#createAccountButton');

						modal.find('#createUsername').focus();

						modal.find('input').on('keypress', function(e) {
							var code = (e.keyCode ? e.keyCode : e.which);
							if (code == 13) {
								if (!submitButton.prop('disabled')) {
									submitButton.trigger('click');
								}
								e.preventDefault();
							}
						});
					},
				});
			});
			e.preventDefault();
		});

		usernameInput.focus();
	}

	var initialize = function() {
		body.initialize({
			title: 'Login',
			contents: "<h1>Front Page</h1>",
			navbar: {
				items: [ loginForm() ],
			},
			onShow: function(body) {
				// Hook up login form
				initializeLoginForm(body);

				// Display error modal if required="required"
				if (window.location.href.indexOf('?error') >= 0) {
					require(['gui/modal',
					         'hbs!templates/loginErrorMessage',
					], function(modal, message) {
						var errorMessage = $('meta[name="_lastSecurityError"]').attr('content');
						if (!errorMessage) errorMessage = 'Unknown security error';
						modal.show({
							content: message({title: 'Security Error', error: errorMessage}),
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