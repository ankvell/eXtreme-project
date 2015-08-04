var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone');

Backbone.Model.prototype.idAttribute = '_id';

var ArticleModel = Backbone.Model.extend({
    defaults: {
        title: '',
        date: '',
        description: ''
    }
});

var ArticlesCollection = Backbone.Collection.extend({
    url: 'http://localhost:3000/api/articles'
});

var articlesCollection = new ArticlesCollection();

var ArticleView = Backbone.View.extend({
    model: new ArticleModel(),
    tagName: 'tr',
    initialize: function() {
        this.template = _.template($('.events-list-template').html());
    },
    events: {
        'click .edit-event': 'edit',
        'click .update-event': 'update',
        'click .cancel': 'cancel',
        'click .delete-event': 'delete'
    },
    edit: function() {
        $('.edit-event').hide();
        $('.delete-event').hide();
        this.$('.update-event').show();
        this.$('.cancel').show();

        var title = this.$('.title').html(),
            date = this.$('.date').html(),
            description = this.$('.description').html();

        this.$('.title').html('<input type="text" class="title-update" value="' + title + '">');
        this.$('.date').html('<input type="text" class="date-update" value="' + date + '">');
        this.$('.description').html('<input type="text" class="description-update" value="' + description + '">');
    },
    update: function() {
        this.model.set('title', $('.title-update').val());
        this.model.set('date', $('.date-update').val());
        this.model.set('description', $('.description-update').val());
        
        this.model.save(null, {
            success: function(response) {
                console.log('Updated ' + response.toJSON()._id);
            },
            error: function(response) {
                console.log('failed to update');
            }
        });
    },
    cancel: function() {
        articlesView.render();
    },
    delete: function() {
        this.model.destroy({
            success: function(response) {
                console.log('Deleted ' + response.toJSON()._id);
            },
            error: function() {
                conale.log('failed to delete');
            }
        });
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var ArticlesView = Backbone.View.extend({
    model: articlesCollection,
    el: $('.events-list'),
    initialize: function() {
        var self = this;
        this.model.on('add', this.render, this);
        this.model.on('change', function() {
            setTimeout(function() {
                self.render();
            }, 30);
        }, this);
        this.model.on('remove', this.render, this);
        this.model.fetch({
			success: function(response) {
				_.each(response.toJSON(), function(item) {
					console.log('GET, _id: ' + item._id);
				})
			},
			error: function() {
				console.log('Failed!');
			}
		});
    },
    render: function() {
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function(event) {
            self.$el.append((new ArticleView({
                model: event
            })).render().$el);
        });
        return this;
    }
});

var articlesView = new ArticlesView();

$(document).ready(function() {
    $('.add-event').on('click', function() {
        var article = new ArticleModel({
            title: $('.title-input').val(),
            date: $('.date-input').val(),
            description: $('.description-input').val()
        });
        $('.title-input').val('');
        $('.date-input').val('');
        $('.description-input').val('');
        articlesCollection.add(article);
        article.save(null, {
			success: function(response) {
				console.log('POST, _id: ' + response.toJSON()._id);
			},
			error: function() {
				console.log('Failed to save');
			}
		});
    });
});