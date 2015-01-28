define(['jquery', 'underscore', 'backbone', 'bootstrap'], 
		function($, _, backbone) {
	// Type definitions
	var User = backbone.Model.extend({
	});

	var UserList = backbone.Collection.extend({
		model: User,
		url: contextPath + "admin/api/account"
	});

	var UserView = Backbone.View.extend({
		tagName: "<tr>",
		template: $("#userRowTemplate").html(),
		render: function() {
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.toJSON()));
			return this;
		}
	});

	var UserListView = Backbone.View.extend({
		el: $("#userList"),

		initialize: function() {
			this.collection = users;
			this.render();
		},

		render: function() {
			var that = this;
			_.each(this.collection.models, function(item) {
				that.renderUser(item);
			}, this);
		},

		renderUser: function(item) {
			var itemView = new UserView({
				model: item
			});
			this.$el.append(itemView.render().el);
		}
	});

	var users = new UserList();
	var userList = new UserListView();

	var initialize = function() {
		userList.initialize();
	}

	return {
		initialize : initialize
	};
});
