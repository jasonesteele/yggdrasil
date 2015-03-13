/**
 * Common scaffolding for application pages.
 */
define(['jquery',
        'underscore',
        'settings',
        'gui/navbar',
        'bootstrap',
        'css!style/bootstrap.css',
        'css!style/bootstrap-theme.css',
        'css!style/app.css',
], function($, _, settings, navbar) {
	var _options = {
			title: 'Page',
			contents: null,
			navbar: {
				autoFocus: true,
			},
			onShow: function() {},
	};
	var _el;
	var _navbar;
	var initialize = function(options) {
		if (options) {
			$.extend(true, _options, options);
		}
		_navbar = navbar.initialize(_options.navbar);
		document.title = settings.appName + ' - ' + _options.title;
		$(function() {
			_el = $('#contents');
			_el.empty();
			_el.append(_navbar.el);
			_el.append(_.isFunction(_options.contents) ? _options.contents() : _options.contents);
		  $('[data-toggle="tooltip"]').tooltip();
		  _el.fadeIn(500);
		  _options.onShow(_el);
		});
		return this;
	};
	return {
		initialize: initialize,
	};
});