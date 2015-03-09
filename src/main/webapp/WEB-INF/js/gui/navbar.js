/**
 * Navigation bar.
 */
define(['jquery',
        'underscore',
        'util/contextPath',
        'hbs!templates/navbar/navbar',
        'util/csrf',
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
		// TODO - query available navigation from server
		
		require(['hbs!templates/menu/logoutControl'], function(logoutControl) {
			var _logoutForm = $(logoutControl({ action : contextPath("/logout") }));
			_menu.append(_logoutForm);
			$(function() {
				_logoutForm.find('form').csrf();
			});
		});

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