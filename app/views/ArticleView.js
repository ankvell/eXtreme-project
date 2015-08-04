var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone');

var ArticleView = Backbone.View.extend({
    tagName: 'tr',
    initialize: function() {
        this.template = _.template($('.events-list-template').html());
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    events: {
        'click .edit': 'editArticle',
        'click .update': 'updateArticle',
        'click .cancel': 'cancelEditing',
        'click .delete': 'deleteArticle'
    },
    editArticle: function() {
        this.$('.edit').hide();
        this.$('.delete').hide();
        this.$('.update').show();
        this.$('.cancel').show();

        var title = this.$('.title').html(),
            date = this.$('.date').html(),
            description = this.$('.description').html();

        this.$('.title').html('<input type="text" class="title-update" value="' + title + '">');
        this.$('.date').html('<input type="text" class="date-update" value="' + date + '">');
        this.$('.description').html('<input type="text" class="description-update" value="' + description + '">');
    },
    updateArticle: function() {
        this.model.set('title', $('.title-update').val());
        this.model.set('date', $('.date-update').val());
        this.model.set('description', $('.description-update').val());
    },
    cancelEditing: function() {
        this.render();
    },
    deleteArticle: function() {
        this.model.destroy();
    }
});
module.exports = ArticleView;