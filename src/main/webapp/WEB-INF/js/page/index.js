/**
 * Main landing page.
 */
define(['jquery', 
        'gui/body',
        'util/contextPath',
        'hbs!template/logoutButton',
        'hbs!template/menuItem'], 
function($, body, contextPath, logoutButton, menuItem) {
	var menuItem = menuItem;
	var logoutButton = logoutButton;
	
	var initialize = function(err) {
		body.initialize({title: 'Home'})
			.html("<h1>Home Page</h1>");

		$(function() {
			var itemEl = $($.parseHTML(menuItem()));
			itemEl.append(logoutButton({action: contextPath("logout")}));
			itemEl.find("form").csrf();
			itemEl.find("a").on("click", function(e) {
				itemEl.find("form").submit();
				e.preventDefault();
			});
			$('#rightMenu').append(itemEl);
		});
	}

	return {
		initialize: initialize
	} 
});
