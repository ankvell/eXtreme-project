var $ = require('jquery'),
    Backbone = require('backbone'),
    ArticleListView = require('./ArticleListView'),
    textTruncate = require('../textTruncate');

var ListView = Backbone.View.extend({
    el: $('.east_side'),
    initialize: function(){
        this.listenTo(this.collection, 'add', this.render);
        this.listenTo(this.collection, 'change', this.render);
        this.render();
    },
    render: function(){
        this.$el.empty();
        this.collection.models.forEach((function(article){
            this.renderArticle(article);
        }).bind(this));
        $('.short-description').textTruncate();
        return this;
    },
    renderArticle: function(article){
        var articleListView = new ArticleListView({
            model: article
        });
        this.$el.append(articleListView.render().el);
    }
});
module.exports = ListView;