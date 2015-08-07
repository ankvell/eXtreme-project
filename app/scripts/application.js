require('./textTruncate');
var $ = require('jquery'),
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
    ListView = require('./views/ListView'),
    data = require('../../data.js');

$(document).ready(function() {
    var article = data[0];
    var articleView = new ArticleView({model: article});
    setTimeout(function(){
        article = data[1];
        articleView = new ArticleView({model: article});
    }, 10000);
    setTimeout(function(){
        article = data[2];
        articleView = new ArticleView({model: article});
    }, 20000);



    // var map = new Map({
    //     lat: 48.161526,
    //     lng: 24.501073
    // });
    // var mapView = new MapView({
    //     model: map
    // });
    // var locationView = new LocationView({
    //     model: map
    // });
    // var drawingView = new DrawingView({
    //     model: map
    // });
    // $('#load').on('click', function() {
    //     drawingView.remove();
    //     locationView.remove();
    //     shapesView = new ShapesView({
    //         model: map
    //     });
    // });

    var articleCollection = new ArticleCollection(data);
    var articleListView = new ArticleListViewTable({
        model: articleCollection
    });
    $('.add-event').on('click', function() {
        var article = new Article({
            title: $('.title-input').val(),
            date: $('.date-input').val(),
            description: $('.description-input').val()
        });
        var articleView = new ArticleView({model: article.attributes});
        $('.title-input').val('');
        $('.date-input').val('');
        $('.description-input').val('');
        articleCollection.add(article);
    });

    $('#showList').on('click', function(){
        var listView = new ListView({collection: articleCollection});
        $('.short-description').textTruncate({ellipsis: "Читати далі"});
    });
});