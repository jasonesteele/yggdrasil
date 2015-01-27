define(['jquery', 'underscore', 'backbone', 'bootstrap'], 
		function($, _, backbone) {
	// Type definitions
	var User = backbone.Model.extend({
	});

	var UserList = backbone.Collection.extend({
		model: User
	});

	var users = new UserList();

	var initialize = function() {
		$.getJSON(contextPath + "admin/api/account")
			.done(function(data) {
				$.each(data.users, function(i, user) {
					users.add(user);
				});
				console.log("success");
			}).fail(function() {
				console.log("faiure");
			});
	}

	return {
		initialize : initialize
	};
});
