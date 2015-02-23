/**
 * Applicant login page.
 */
define(['jquery', 
        'gui/body',
        'util/contextPath',
        'hbs!templates/frontPage',
        'hbs!templates/loginForm',
        'util/csrf',
], function($, body, contextPath, contents, loginForm) {
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
						modal.find('#createUsername').focus();
						modal.find('form').csrf();

						var submitButton = modal.find('#createAccountButton');
						modal.find('input').on('keypress', function(e) {
							var code = (e.keyCode ? e.keyCode : e.which);
							if (code == 13) {
								if (!submitButton.prop('disabled')) {
									submitButton.trigger('click');
								}
								e.preventDefault();
							}
						});

						modal.find('button').on('click', function(e) {
							var username = modal.find('input[name*="username"]').val();
							var email = modal.find('input[name*="email"]').val();
							var password = modal.find('input[name*="password"]').val();
							var confirmPassword = modal.find('input[name*="confirmPassword"]').val();
							console.log("create account: username=" + username + ",email="
									+ email + ",password=" + password + ",confirmPassword="
									+ confirmPassword);

							e.preventDefault();
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
			contents: contents,
			navbar: {
				items: [
				  {
				  	'class': 'navbar-form navbar-right',
				  	content: loginForm(),
				  }
				],
			},
			onShow: function(body) {
				// Hook up login form
				initializeLoginForm(body);

				// TODO add jquery validation

				// Display error modal if required
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
					require(['gui/modal',
					         'hbs!templates/logoutMessage',
					], function(modal, message) {
						modal.show({content: message()});
					});
				}
			},
		});
	}

	return {
		initialize: initialize
	}
});