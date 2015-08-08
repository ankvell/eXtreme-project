var ListView = require('../views/ListView'),
    _ = require('underscore'),
    Backbone = require('Backbone'),
    ArticleView = require('../views/ArticleView');

module.exports = function(articleCollection) {
    var ArticleRouter = Backbone.Router.extend({
        routes: {
            '': 'showArticleList',
            'articles': 'showArticleList',
            'view/:title': 'viewArticle'
        },
        showArticleList: function() {
            console.log('Hello');
            var listView = new ListView({
                collection: articleCollection
            });
        },
        viewArticle: function(title){
            console.log('Hello2');
            var selectedArticle = _(articleCollection).find(function(article){
                return article.get('title') === title;
            });
            var articleView = new ArticleView({model: selectedArticle});
        }
    });
    return ArticleRouter;
}