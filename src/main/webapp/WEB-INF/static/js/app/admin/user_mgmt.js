define(['jquery', 'underscore', 'backbone', 'backgrid', 'bootstrap', 
        'app/lib/ajax-crsf', 'app/lib/notify'], 
		function($, _, backbone, backgrid, notify) {
	
	// Type definitions
	var User = backbone.Model.extend({
		initialize: function() {
			this.bind('backgrid:edited', function(model, column, command) {
		    model.save().error(function(xhr, textStatus, message) {
					var message;
					if (xhr.responseJSON && xhr.responseJSON.message) {
						message = xhr.responseJSON.message;
					} else {
						message = "HTTP Status " + xhr.status + ": " + message;
					}
			    $.notify("Error: " + message, 'error');

			    model.fetch();
		    })
		  });
			
			this.bind('error', function(model, resp, options) {
				if (resp.status == 403) {
					setTimeout(function() {
						window.location.reload();
					}, 2000);
				}
			});
			
		}
	});

	var UserList = backbone.Collection.extend({
		model: User,
		url: contextPath + "api/admin/account"
	});
	
	var users = new UserList();

	var DeleteCell = Backgrid.Cell.extend({
    template: _.template($("#deleteButton").html()),
    events: {
      "click": "deleteRow"
    },
    deleteRow: function (e) {
      e.preventDefault();
      var collection = this.model.collection;

      this.model.destroy().error(function(xhr, textStatus, message) {
				var message;
				if (xhr.responseJSON && xhr.responseJSON.message) {
					message = xhr.responseJSON.message;
				} else {
					message = "HTTP Status " + xhr.status + ": " + message;
				}
		    $.notify("Error: " + message, 'error');

		    collection.fetch();
      });
    },
    render: function () {
      this.$el.html(this.template());
      this.delegateEvents();
      return this;
    }
	});

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
	},{
		name: "delete",
		label: "",
		editable: false,
		cell: DeleteCell,
	}];
	
	var UserRow = Backgrid.Row.extend({
	  events: {
	    focusin: "rowFocused",
	    focusout: "rowLostFocus",
	    mouseover: "mouseover",
	    mouseout: "mouseout",
	  },
	  rowFocused: function() {
	    this.$el.addClass('focus');
	  },
	  rowLostFocus: function() {
	    this.$el.removeClass('focus');
	  },
	  mouseover: function() {
	    this.$el.addClass('highlight');
	  },
	  mouseout: function() {
	    this.$el.removeClass('highlight');
	  },
	});

	var grid = new Backgrid.Grid({
		row: UserRow,
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
