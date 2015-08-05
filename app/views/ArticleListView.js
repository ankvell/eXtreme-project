var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    ArticleView = require('./ArticleView');

var ArticleListView = Backbone.View.extend({
    el: $('.events-list'),
    initialize: function() {
        this.model.on('add', this.render, this);
        this.model.on('change', function() {
            setTimeout((function() {
                this.render();
            }).bind(this), 30);
        }, this);
        this.model.on('remove', this.render, this);
    },
    render: function() {
        this.$el.html('');
        _.each(this.model.toArray(), (function(article) {
            this.renderArticle(article);
        }).bind(this));
        return this;
    },
    renderArticle: function(article){
        var articleView = new ArticleView({
            model: article
        });
        this.$el.append(articleView.render().el);
    }
});
module.exports = ArticleListView;