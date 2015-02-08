/**
 * General manipulation of the visible contents of a page.
 */
define(['jquery', 'hbs!template/navbar'],
function($, navbarTemplate) {
	var navbar = function() {
		this.template = navbarTemplate;
	}
	
	return navbar;
});