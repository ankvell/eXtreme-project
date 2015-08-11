var $ = require('jquery'),
    Backbone = require('backbone'),
    ArticleListView = require('./ArticleListView');

var ListView = Backbone.View.extend({
    el: $('.east_side'),
    initialize: function(){
        this.listenTo(this.collection, 'change', this.render);
        this.render();
    },
    render: function(){
        this.$el.empty();
        this.collection.models.forEach((function(article){
            this.renderArticle(article);
        }).bind(this));
        return this;
    },
    renderArticle: function(article){
        this.shortenDescription(article, 700);
        var articleListView = new ArticleListView({
            model: article
        });
        this.$el.append(articleListView.render().el);
        if (article.attributes.difficulty){
            $('.difficulty span').show();
        }
        if (article.attributes.duration){
            $('.duration span').show();
        }
    },
    shortenDescription: function(article, maxLength){
        var shortened = article.attributes.description;
        var index;
        if (shortened.length > maxLength){
            index = shortened.lastIndexOf(' ', maxLength - 3);
            shortened = shortened.substr(0, index) + '...';
        }
        article.set({
            shortDescription: shortened
        }, {silent: true});
    }
});
module.exports = ListView;