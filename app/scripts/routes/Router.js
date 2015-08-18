var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),

    HeaderView = require('../views/HeaderView'),
    Filter = require('../models/Filter'),
    ListView = require('../views/ListView'),
    ArticleView = require('../views/ArticleView'),
    AdminMainView = require('../views/AdminMainView'),
    AdminEditFormView = require('../views/AdminEditFormView'),
    AdminAddFormView = require('../views/AdminAddFormView'),
    StartPageView = require('../views/StartPageView'),
    NavigationView = require('../views/NavigationView'),
    SearchView = require('../views/SearchView');

var Router = Backbone.Router.extend({
    initialize: function(options) {
        var headerView = new HeaderView();
        this.articleCollection = options.articleCollection;
    },
    routes: {
        '': 'showStartPage',
        'articles': 'showArticleList',
        'admin': 'showAdminMainView',
        'view/:title': 'viewArticle',
        'search/:searchItem': 'viewSearchResult',
        'admin/edit/:id': 'editArticle',
        'admin/add': 'addArticle',
        'all': 'showArticleList',
        'news': 'showNews',
        'routs': 'showRouts',
        'rocks': 'showRocks'
    },
    showStartPage: function() {
        var startPageView = new StartPageView();
        var navigationView = new NavigationView();
        var searchView = new SearchView();

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
    showNews: function() {
        var newsView = new ListView({
            collection: this.articleCollection.byType('news')
        });
    },
    showRouts: function() {
        var routsView = new ListView({
            collection: this.articleCollection.byType('routs')
        });
    },
    showRocks: function() {
        var rocksView = new ListView({
            collection: this.articleCollection.byType('rocks')
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
    showAdminMainView: function() {

        document.getElementsByTagName('header')[0].style.background = '#222';
        var adminMainView = new AdminMainView({
            collection: this.articleCollection
        });
    },
    viewSearchResult: function(searchItem) {
        var filter = new Filter({
            collection: this.articleCollection,
            searchString: searchItem
        });
        var listView = new ListView({
            collection: filter.filtered
        });
    },
    editArticle: function(id) {
        var selectedArticle = _.find(this.articleCollection.models, function(article) {
            return article.get('id') === id;
        });
        var adminEditFormView = new AdminEditFormView({
            model: selectedArticle
        });
    },
    addArticle: function() {
        var adminAddFormView = new AdminAddFormView({
            collection: this.articleCollection
        });
    },
    showNews: function() {
        var newsView = new ListView({
            collection: this.articleCollection.byType('news')
        });
    },
    showRouts: function() {
        var routsView = new ListView({
            collection: this.articleCollection.byType('routs')
        });
    },
    showRocks: function() {
        var rocksView = new ListView({
            collection: this.articleCollection.byType('rocks')
        });
    }
});
module.exports = Router;