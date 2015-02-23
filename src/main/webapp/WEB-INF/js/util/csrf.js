define(['jquery'], 
function($) {
	var csrfToken = $('meta[name="_csrf"]').attr('content');

	if (csrfToken) {
		var csrfHeader = $('meta[name="_csrfToken"]').attr('content');
		if (!csrfHeader) csrfHeader = 'X-CSRF-TOKEN';

		var headers = {};
		headers[csrfHeader] = csrfToken; 
		$.ajaxSetup({
			headers: headers
		});

		$.fn.extend({
			csrf: function() {
				return this.each(function(idx, form) {
					$(form).append('<input type="hidden" name="_csrf" value="' + csrfToken + '">');
				});
			}
		});
	}
})