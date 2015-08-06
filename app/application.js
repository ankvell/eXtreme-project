var $ = require('jquery'),
    Backbone = require('backbone'),
    // Map = require('./scripts/models/Map'),
    MapView = require('./scripts/views/MapView'),
    DrawingView = require('./scripts/views/DrawingView'),
    MarkerView = require('./scripts/views/MarkerView'),
    InfoView = require('./scripts/views/InfoView'),
    LocationView = require('./scripts/views/LocationView'),
    ShapesView = require('./scripts/views/ShapesView'),
    Article = require('./scripts/models/Article'),
    ArticleCollection = require('./scripts/collections/ArticleCollection'),
    ArticleListView = require('./scripts/views/ArticleListView');

$(document).ready(function() {
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

    var articleCollection = new ArticleCollection();
    var articleListView = new ArticleListView({
        model: articleCollection
    });
    $('.add-event').on('click', function() {
        var article = new Article({
            title: $('.title-input').val(),
            date: $('.date-input').val(),
            description: $('.description-input').val()
        });
        $('.title-input').val('');
        $('.date-input').val('');
        $('.description-input').val('');
        articleCollection.add(article);
    });
});