var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    ListView = require('../views/ListView'),
    ArticleView = require('../views/ArticleView'),
    AdminEditListView = require('../views/AdminEditListView'),
    Filter = require('../models/Filter'),
    AdminEditView = require('../views/AdminEditView'),
    AdminView = require('../views/AdminView'),
    SearchView = require('../views/SearchView');

var Router = Backbone.Router.extend({
        initialize: function(options){
            this.articleCollection = options.articleCollection;
        },
        routes: {
            '': 'showArticleList',
            'articles': 'showArticleList',
            'admin': 'showAdminEditListView',
            'view/:title': 'viewArticle',
            'search/:searchItem': 'viewSearchResult',
            'admin/edit/:title': 'editArticle',
            'admin/add': 'addArticle'
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
            var searchView = new SearchView();
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
        showAdminEditListView: function(){
            var adminEditListView = new AdminEditListView({
                collection: this.articleCollection
            })
        },
        viewSearchResult: function(searchItem){
            var filter = new Filter({collection: this.articleCollection, searchString: searchItem});
            var listView = new ListView({collection: filter.filtered});
        },
        editArticle: function(id){
            var selectedArticle = _(this.articleCollection.models).find(function(article) {
                return article.get('id') === id;
            });
            var adminEditView = new AdminEditView({
                model: selectedArticle
            });
        },
        addArticle: function(){
            var adminView = new AdminView({collection: this.articleCollection});
        }
    });
module.exports = Router;