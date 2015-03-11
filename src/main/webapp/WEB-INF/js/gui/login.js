/**
 * Handling for the login form.
 */
define(['jquery',
        'underscore',
        'util/contextPath',
        'hbs!templates/menu/loginForm',
        'util/csrf',
        'util/validation',
], function($, _, contextPath, loginForm) {
	var _el = $(loginForm());
	
	var createAccountPopup = function(e) {
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
								url: contextPath("/api/public/account"),
								contentType: "application/json; charset=utf-8",
								dataType: "json",
								data: JSON.stringify({
									username: modal.find('input[name*="createUsername"]').val(),
									email: modal.find('input[name*="createEmail"]').val(),
									password: modal.find('input[name*="createPassword"]').val(),
								}),
							}).done(function(data) {
								window.location.href = contextPath('page/verify/sent');
							}).fail(function(msg) {
								$.notify("Error creating account: " + msg.statusText, 'error');
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
	};
	
	var initialize = function(menuContainer) {
		var form = _el.find("form");
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
		
		createAccount.on('click', createAccountPopup)
		
		menuContainer.append(_el);
		
		$(function() {
			usernameInput.focus();
		});
	}
	
	return {
		initialize: initialize,
	}
});
      