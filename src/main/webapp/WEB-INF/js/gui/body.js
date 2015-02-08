/**
 * General manipulation of the visible contents of a page.
 */
define(['jquery',
        'gui/navbar',
        'gui/title',
        'bootstrap',
        'css!style/bootstrap',
        'css!style/bootstrap-theme'],
function($, Navbar, title) {
	var navbar;
	
	/**
	 * Clears the contents of the page body.
	 */
	var clear = function() {
		$('contents').empty();
	}
	
	/**
	 * Initializes the skeleton for a page.
	 */
	var initialize = function(options) {
		title(options.title);
		$(function() {
			$('nav').remove();
			navbar = new Navbar();
			$('body').prepend(navbar.template());
		});
	}
	
	/**
	 * Sets the HTML contents for the page.
	 */
	var contents = function(contents) {
		$('#contents').html(contents);
	}
	
	return {
		clear: clear,
		contents: contents,
		initialize: initialize,
		navbar: navbar,
	}
});