/**
 * General manipulation of the application container, including
 * <head>, navigation bar and general styling.
 */
define(['jquery',
        'gui/navbar',
        'gui/title',
        'util/formCsrf',
        'bootstrap',
        'css!style/bootstrap',
        'css!style/bootstrap-theme',
        'css!style/app'],
function($, navbar, title) {
	var navbar;
	
	/**
	 * Clears the contents of the page body.
	 */
	var clear = function() {
		$('contents').empty();
		return this;
	}
	
	/**
	 * Initializes the skeleton for a page.
	 */
	var initialize = function(options) {
		title(options.title);
		$(function() {
			navbar.initialize($('body'))
				.brand({ label: "Yggrasil" });
		});
		return this;
	}
	
	/**
	 * Sets the HTML contents for the page.
	 */
	var html = function(contents) {
		$('#contents').html(contents);
		return this;
	}
	
	return {
		clear: clear,
		html: html,
		initialize: initialize,
		navbar: navbar,
	}
});