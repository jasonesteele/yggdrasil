/**
 * Navigation bar.
 */
define(['jquery',
        'underscore',
        'util/contextPath',
        'hbs!templates/navbar/navbar',
        'hbs!templates/navbar/menu',
], function($, _, contextPath, content, menu) {
	var _options = {
		home: {
			action: contextPath(),
			tooltip: 'Home',
			label: '<span class="glyphicon glyphicon-home"></span>',
		},
	};
	var _menuItem = {
		content: 'Menu',
		'class': 'navbar-nav',
	}
	var _el;
	var _menu;

	var initialize = function(options) {
		if (options) {
			$.extend(true, _options, options);
		}

		_el = $(content({
			home : _options.home,
		}));
		_menu = _el.find('#navCollapseMenu');

		var _items = _.isFunction(options.items) ? options.items() : options.items;
		_.each(_items, function(item) {
			_menu.append(menu($.extend({}, _menuItem, item)))
		});

		return this;
	};

	return {
		initialize: initialize,
		el: function() { return _el },
	};
});