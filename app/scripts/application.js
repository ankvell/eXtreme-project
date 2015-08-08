require('./textTruncate');
var $ = require('jquery'),
    _ = require('underscore'),
    api = require('./configs/api'),
    Backbone = require('backbone'),
    Map = require('./models/Map'),
    MapView = require('./views/MapView'),
    DrawingView = require('./views/DrawingView'),
    MarkerView = require('./views/MarkerView'),
    InfoView = require('./views/InfoView'),
    LocationView = require('./views/LocationView'),
    ShapesView = require('./views/ShapesView'),
    Article = require('./models/Article'),
    ArticleView = require('./views/ArticleView'),
    ArticleCollection = require('./collections/ArticleCollection'),
    ArticleListViewTable = require('./views/ArticleListViewTable'),
    ListView = require('./views/ListView');

$(document).ready(function() {
    window.App = {};
    App.eventAggregator = _.extend({}, Backbone.Events);
    App.eventAggregator.on('article:selected', function(article) {
        var urlPath = 'view/' + article.get('title');
        router.navigate(urlPath, {
            trigger: true
        });
    });
    var ArticleRouter = Backbone.Router.extend({
        routes: {
            '': 'showArticleList',
            'articles': 'showArticleList',
            'view/:title': 'viewArticle'
        },
        showArticleList: function() {
            api.getArticles(function(data) {
                new ListView({
                    collection: new ArticleCollection(data)
                });
            });
        },
        viewArticle: function(title){
            api.getArticle(title, function(article) {
                new ArticleView({model: new Article(article)});
            });
        }
    });
    var router = new ArticleRouter();
    Backbone.history.start();
    // Backbone.history.start();
    // var eventAggregator = require('./routes/eventAggregator')(router);
    // router.navigate('articles', {trigger:true});
});