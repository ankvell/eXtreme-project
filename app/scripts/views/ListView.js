var $ = require('jquery'),
    Backbone = require('backbone'),
    ArticleInListView = require('./ArticleInListView');

var ListView = Backbone.View.extend({
    el: $('.content'),
    initialize: function() {
        this.listenTo(this.collection, 'change', this.render);
        this.render();
    },
    render: function() {
        this.$el.empty();
        this.collection.forEach((function(article) {
            this.renderArticle(article);
        }).bind(this));
        return this;
    },
    renderArticle: function(article) {
        this.shortenDescription(article, 700);
        var articleInListView = new ArticleInListView({
            model: article
        });
        this.$el.append(articleInListView.render().el);
        if (article.attributes.difficulty) {
            $('.difficulty span').show();
        }
        if (article.attributes.duration) {
            $('.duration span').show();
        }
    },
    shortenDescription: function(article, maxLength) {
        var shortened = article.attributes.description;
        var index;
        if (shortened.length > maxLength) {
            index = shortened.lastIndexOf(' ', maxLength - 3);
            shortened = shortened.substr(0, index) + '...';
        }
        article.set({
            shortDescription: shortened
        }, {
            silent: true
        });
    }
});
module.exports = ListView;