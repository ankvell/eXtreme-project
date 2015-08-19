var $ = require('jquery'),
    Backbone = require('backbone'),
    template = require('./templates/sidebar.html'),
    ArticleInListView = require('./ArticleInListView');

var ListView = Backbone.View.extend({
    el: $('.content'),
    template: template,
    initialize: function() {
        this.listenTo(this.collection, 'change', this.render);
        this.render();
    },
    render: function() {
        this.$el.empty();
        this.$el.append('<div class="east_side"></div>');
        if (this.collection.length > 0){
            this.collection.forEach((function(article) {
                this.renderArticle(article);
            }).bind(this));
            this.$el.append(this.template({}));
        } else {
            var noResultsTemplate = '<div class="article-container"><h2 class="article-title">За результатами вашого пошуку нічого не знайдено</h2></div>';
            this.$el.append(noResultsTemplate);
        }
        return this;
    },
    renderArticle: function(article) {
        this.shortenDescription(article, 700);
        var articleInListView = new ArticleInListView({
            model: article
        });
        this.$el.find('.east_side').append(articleInListView.render().el);
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