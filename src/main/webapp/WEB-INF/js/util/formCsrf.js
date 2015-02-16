define(['jquery'], function($) {
	var csrfToken = $('meta[name="_csrf"]').attr('content');	
	
	$.fn.extend({
		csrf: function() {
			return this.each(function(idx, form) {
				$(form).append('<input type="hidden" name="_csrf" value="' + csrfToken + '">');
			});
		}
	});
})
