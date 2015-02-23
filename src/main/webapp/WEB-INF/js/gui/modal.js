/**
 * Modal dialog.
 */
define(['jquery',
        'underscore',
], function($, _, modalFrame) {
	var _defaultOptions = {
			parent: null,
			content: null,
			onShow: function(modal) { },
	};

	var show = function(options) {
		var _options = $.extend({}, _defaultOptions, options);
		var parent = _options.parent;
		if (!_options.parent) _options.parent = $('body');

		var dialog = $(_options.content);
		_options.parent.append(dialog);
		dialog.modal('show');
		dialog.on('hidden.bs.modal', function (e) {
			dialog.remove();
		});
		dialog.on('shown.bs.modal', function (e) {
			if (_.isFunction(_options.onShow)) _options.onShow(dialog);
		});
	}

	return {
		show: show
	};
});