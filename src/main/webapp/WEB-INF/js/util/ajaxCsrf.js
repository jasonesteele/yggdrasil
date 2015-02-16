define(['jquery'], 
	function($) {
		var headers = {}
		headers[$('meta[name="_csrf_header"]').attr('content')] =
			$('meta[name="_csrf"]').attr('content');
		$.ajaxSetup({
			headers: headers
	});
})