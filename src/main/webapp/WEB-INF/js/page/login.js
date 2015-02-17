/**
 * Main landing page.
 */
define(['jquery', 
        'gui/body',
        'util/contextPath',
        'hbs!template/frontPage',
        'hbs!template/loginForm'], 
function($, body, contextPath, frontPage, loginForm) {
	var form = $($.parseHTML(loginForm()));
	var usernameInput = form.find("input[name*='username']");
	var passwordInput = form.find("input[name*='password']");
	var submitButton = form.find("button");
	
	var initialize = function(err) {
		// Initialize page body
		body.initialize({title: 'Login'})
			.html(frontPage());
		
		// Hook up event handlers for login form
		form.prop('action', contextPath('/page/login'));
		form.find('input').on('keypress', function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if (code == 13) {
				if (!submitButton.prop('disabled')) {
					submitButton.trigger('click');
					e.preventDefault();
				}
			}
		});
		form.find('input').on('keyup', function(e) {
			if (usernameInput.val() && passwordInput.val())
				submitButton.prop('disabled', null);
			else
				submitButton.prop('disabled', 'disabled');
		});
		$(form).csrf();
		
		// Add input form to nav bar when dom is ready
		$(function () {
			$('#rightMenu').append(form);
			usernameInput.focus();
			
			$('meta[name="_lastSecurityError"]').each(function(idx, value) {
				require(['hbs!template/loginError'], function(loginError) {
					var alertDiv = $.parseHTML(loginError({
						header: 'Login Error!',
						message: $(value).attr('content')
					}));
					$(alertDiv).find('a').on('click', function(e) {
						// TODO pop up the account recovery dialog
						console.log("clicked");
						e.preventDefault();
					});
					$('#contents').prepend(alertDiv);
				});
			});
			
			
			if (window.location.href.indexOf('?logout') == window.location.href.length - 7) {
				require(['hbs!template/loggedOut'], function(loggedOut) {
					$('#contents').prepend(loggedOut());
				});
			}
		});
	}

	return {
		initialize: initialize
	} 
});
