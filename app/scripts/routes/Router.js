var _ = require('underscore'),
    Backbone = require('backbone'),
    ListView = require('../views/ListView'),
    ArticleView = require('../views/ArticleView'),
    AdminView = require('../views/AdminView');

var Router = Backbone.Router.extend({
        initialize: function(options){
            this.articleCollection = options.articleCollection;
        },
        routes: {
            '': 'showArticleList',
            'articles': 'showArticleList',
            'admin': 'showAdminView',
            'view/:title': 'viewArticle'
        },
        showArticleList: function() {
            // api.getArticles(function(data) {
            //     new ListView({
            //         collection: new ArticleCollection(data)
            //     });
            // });
            var listView = new ListView({
                collection: this.articleCollection
            });
        },
        viewArticle: function(title) {
            // api.getArticle(title, function(article) {
            //     new ArticleView({model: new Article(article)});
            // });
            var selectedArticle = _(this.articleCollection.models).find(function(article) {
                return article.get('title') === title;
            });
            var articleView = new ArticleView({
                model: selectedArticle
            });
        },
        showAdminView: function(){
            var adminView = new AdminView({
                collection: this.articleCollection
            })
        }
    });
module.exports = Router;