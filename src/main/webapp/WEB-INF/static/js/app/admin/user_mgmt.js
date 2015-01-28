define(['jquery', 'underscore', 'backbone', 'backgrid', 'bootstrap'], 
		function($, _, backbone, backgrid) {
	// Type definitions
	var User = backbone.Model.extend({});

	var UserList = backbone.Collection.extend({
		model: User,
		url: contextPath + "admin/api/account"
	});
	
	var users = new UserList();

	var columns = [{
		name: "id",
		label: "ID",
		editable: false,
		cell: backgrid.IntegerCell.extend({
			orderSeparator: ''
		}),
	},{
		name: "username",
		label: "Username",
		cell: "string",
	},{
		name: "email",
		label: "E-Mail",
		cell: "string",
	},{
		name: "isEnabled",
		label: "Enabled?",
		cell: "boolean",
	}];
	
	var grid = new Backgrid.Grid({
	  columns: columns,
	  collection: users
	});

	var initialize = function() {
		$("#userList").append(grid.render().el);
		users.fetch({reset: true});	
	}

	return {
		initialize : initialize
	};
});
