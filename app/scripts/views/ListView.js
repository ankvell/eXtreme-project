var $ = require('jquery'),
    Backbone = require('backbone'),
    ArticleListView = require('./ArticleListView');

var ListView = Backbone.View.extend({
    el: $('.east_side'),
    initialize: function(){
        this.listenTo(this.collection, 'add', this.renderArticle);
        this.listenTo(this.collection, 'change', this.render);
        this.render();
    },
    render: function(){
        this.$el.empty();
        this.collection.forEach((function(article){
            this.renderArticle(article);
        }).bind(this));
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