var $ = require('jquery'),
    _ = require('underscore'),
    //api = require('./configs/api'),
    Backbone = require('backbone'),
    Article = require('./models/Article'),
    ArticleView = require('./views/ArticleView'),
    ArticleCollection = require('./collections/ArticleCollection'),
    ListView = require('./views/ListView'),
    AdminView = require('./views/AdminView'),
    data = require('../../data.js');

$(document).ready(function() {
    window.App = {};
    var articleCollection = new ArticleCollection();
    articleCollection.fetch();
    if (!localStorage.getItem('articleData')){
        data.forEach(function(el){
        var article = new Article(el);
        articleCollection.add(article);
    });
    }
    var idArray = [];
    for (var key in localStorage){
        if (key !== 'articleData' && key != 'shapesData' && key != 'tracks'){
            var obj = JSON.parse(localStorage.getItem(key));
            if (obj.id) {
                idArray.push(obj.id);
            }
            var found = false;
            articleCollection.models.forEach(function(el, index) {
                if (el.id === obj.id) {
                    found = true;
                }
            });
            if (!found) {
                var article = new Article(obj);
                articleCollection.add(article);
            }
        }
    }
    articleCollection.models.forEach(function(el, index){
        console.log(articleCollection);
        if (el.id != undefined && idArray.indexOf(el.id) === -1){
            el.save();
        }
    });
    App.eventAggregator = _.extend({}, Backbone.Events);
    App.eventAggregator.on('article:selected', function(article) {
        var urlPath = 'view/' + article.get('title');
        router.navigate(urlPath, {
            trigger: true
        });
    });
    App.eventAggregator.on('show:list', function() {
        var urlPath = 'articles';
        router.navigate(urlPath, {
            trigger: true
        });
    });
    var ArticleRouter = Backbone.Router.extend({
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
                collection: articleCollection
            });
        },
        viewArticle: function(title) {
            // api.getArticle(title, function(article) {
            //     new ArticleView({model: new Article(article)});
            // });
            var selectedArticle = _(articleCollection.models).find(function(article) {
                return article.get('title') === title;
            });
            var articleView = new ArticleView({
                model: selectedArticle
            });
        },
        showAddArticleView: function() {
            var addArticleView = new AddArticleView({
                collection: articleCollection
            });
        }
    });
    var router = new ArticleRouter();
    Backbone.history.start();
});