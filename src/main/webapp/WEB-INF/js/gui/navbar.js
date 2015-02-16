/**
 * Navigation bar, menus and breadcrumbs.
 */
define(['jquery', 'util/contextPath', 'hbs!template/navbar'],
function($, contextPath, navbarTemplate) {
	var _brand = {
			label: "Brand",
			action: "",
	}
	
	/**
	 * Set the brand label and/or action.
	 */
	var brand = function(brand) {
		if (brand) {
			$.extend(_brand, brand);
			$('.navbar-brand')
				.attr('href', contextPath(_brand.action))
				.html(_brand.label);
			}
		return this;
	}

	var initialize = function() {
		$('nav').remove();
		$('body').prepend(navbarTemplate(_brand));
		return this;
	}

	return {
		initialize: initialize,
		brand: brand,
	};
});
