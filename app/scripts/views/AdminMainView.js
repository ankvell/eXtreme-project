var $ = require('jquery'),
    Backbone = require('backbone'),
    AdminEditArticleView = require('./AdminEditArticleView');

var AdminMainView = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.collection, 'add', this.renderContact);
        this.listenTo(this.collection, 'change', this.render);
        this.render();
    },
    render: function() {
        $('.content').empty();
        $('.content').append('<div class="east_side"><table id="articles_table"></table></div>');
        this.collection.forEach(function(article) {
            this.renderArticle(article);
        }, this);
        $('<div class="sidebar"><button type="button" id="add_new_article">Додати нову статтю</button></div>').prependTo('.content');
        $('#add_new_article').on('click', function() {
            App.eventAggregator.trigger('add:article');
        });
        return this;
    },
    renderArticle: function(article) {
        var adminEditArticleView = new AdminEditArticleView({
            model: article
        });
        $('#articles_table').append(adminEditArticleView.render().el);
    }
});
module.exports = AdminMainView;