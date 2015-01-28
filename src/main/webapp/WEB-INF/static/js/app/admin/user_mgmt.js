define(['jquery', 'underscore', 'backbone', 'backgrid', 'bootstrap'], 
		function($, _, backbone, backgrid) {
	// Type definitions
	var User = backbone.Model.extend({
		initialize: function() {
			var obj = this
			
			this.bind('change', function(model) {
				model.save().fail(function(jqXHR, textStatus, errorThrown) {
					console.log("error saving " + model);
					// TODO - pop up a notification
					model.fetch();
					// TODO - this is hokey - the fetch() causes another save
				});
			});
		}
	});

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
		name: "isEnabled",
		label: "Enabled",
		cell: "boolean",
	},{
		name: "username",
		label: "Username",
		cell: "string",
	},{
		name: "email",
		label: "E-Mail",
		cell: "string",
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
