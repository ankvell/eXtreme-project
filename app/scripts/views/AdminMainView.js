var $ = require('jquery'),
    Backbone = require('backbone'),
    AdminEditArticleView = require('./AdminEditArticleView');

var AdminMainView = Backbone.View.extend({
    initialize: function(){
        this.listenTo(this.collection, 'add', this.renderContact);
        this.listenTo(this.collection, 'change', this.render);
        this.render();
    },
    render: function(){
        $('.east_side').empty();
        this.collection.forEach(function(article){
            this.renderArticle(article);
        }, this);
        $('<button type="button" id="add_new_article"/>').text('Add new article').prependTo('.east_side');
        $('#add_new_article').on('click', function(){
            App.eventAggregator.trigger('add:article');
        });
        return this;
    },
    renderArticle: function(article){
        var adminEditArticleView = new AdminEditArticleView({
            model: article
        });
        $('.east_side').append(adminEditArticleView.render().el);
    }
});
module.exports = AdminMainView;