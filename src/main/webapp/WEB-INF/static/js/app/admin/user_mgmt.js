define(['jquery', 'underscore', 'backbone', 'backgrid', 'bootstrap', 
        'app/lib/ajax-crsf', 'app/lib/notify'], 
		function($, _, backbone, backgrid, notify) {
	
	// Type definitions
	var User = backbone.Model.extend({
		initialize: function() {
			
			var obj = this
			
			this.bind('backgrid:edited', function(model, column, command) {
		    model.save();
		  });
			
			this.bind('error', function(model, resp, options) {
				var message;
				if (resp.responseJSON && resp.responseJSON.message) {
					message = resp.responseJSON.message;
				} else {
					message = "HTTP Status " + resp.status + ": " + message;
				}
		    $.notify(
		    		"Error: " + message,
		    		'error');
				model.fetch();
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
	  collection: users,
	  emptyText: "no users loaded"  // TODO - style this?
	});

	var initialize = function() {
		$("#userList").append(grid.render().el);
		users.fetch({reset: true});
	}

	return {
		initialize : initialize
	};
});
