/**
 * Navigation bar.
 */
define(['jquery',
        'underscore',
        'util/contextPath',
        'hbs!templates/navbar/navbar',
], function($, _, contextPath, content) {
	var _options = {
		home: {
			action: contextPath(),
			tooltip: 'Home',
			label: '<span class="glyphicon glyphicon-home"></span>',
		},
	};
	var _menuItem = {
		content: 'Menu',
	}
	var _el;
	var _menu;
	
	var initializeNav = function(session) {
		console.log("initializing navbar for session");
		console.log(session);
	}

	var initialize = function(options) {
		if (options) {
			$.extend(true, _options, options);
		}

		_el = $(content({
			home : _options.home,
		}));
		_menu = _el.find('#navCollapseMenu');

		$.getJSON(contextPath("/api/public/session"))
			.done(function(data) {
				if (!data) {
					require(['gui/login'], function(login) {
						login.initialize(_menu);
					});
				} else {
					initializeNav(data);
				} 
			}).fail(function(jqxhr, textStatus, error) {
				console.log(error);
				$.notify("Error retrieving user session", "error");
			});
		
		if (_options.items) {
			var _items = _.isFunction(options.items) ? options.items() : options.items;
			_.each(_items, function(item) {
				_menu.append(item)
			});
		}

		return this;
	};

	return {
		initialize: initialize,
		el: function() { return _el },
	};
});