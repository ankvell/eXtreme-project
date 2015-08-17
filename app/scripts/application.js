var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Router = require('./routes/Router'),
    Article = require('./models/Article'),
    ArticleCollection = require('./collections/ArticleCollection'),
    data = require('../../data.js');
    //api = require('./configs/api'),

$(document).ready(function() {
    var article;
    var articleCollection = new ArticleCollection();
    if (!localStorage.length) {
        data.forEach(function(el) {
            article = new Article(el);
            articleCollection.add(article);
            localStorage.setItem(_.uniqueId('articleData'), JSON.stringify(article));
        });
    } else {
        for (var key in localStorage) {
            if (key !== 'articleData' && key != 'shapesData' && key != 'tracks' && localStorage.getItem(key)) {
                var obj = JSON.parse(localStorage.getItem(key));
                article = new Article(obj);
                articleCollection.add(article);
            }
        }
    }
    var router = new Router({
        articleCollection: articleCollection
    });
    Backbone.history.start();
    //Creating an application level event aggregator
    window.App = {};
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
    App.eventAggregator.on('search:results', function(searchString) {
        var urlPath = 'search/' + searchString;
        router.navigate(urlPath, {
            trigger: true
        });
    });
    App.eventAggregator.on('edit:article', function(id) {
        var urlPath = 'admin/edit/' + id;
        router.navigate(urlPath, {
            trigger: true
        });
    });
    App.eventAggregator.on('add:article', function() {
        var urlPath = 'admin/add';
        router.navigate(urlPath, {
            trigger: true
        });
    });
    App.eventAggregator.on('admin:main', function() {
        router.navigate('admin', {
            trigger: true
        });
    });
});