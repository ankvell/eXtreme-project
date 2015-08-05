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
    ArticleCollection = require('./collections/ArticleCollection'),
    ArticleListView = require('./views/ArticleListView');

$(document).ready(function() {
    var map = new Map({
        lat: 48.161526,
        lng: 24.501073
    });
    var mapView = new MapView({
        model: map
    });
    var locationView = new LocationView({
        model: map
    });
    var drawingView = new DrawingView({
        model: map
    });
    $('#load').on('click', function() {
        drawingView.remove();
        locationView.remove();
        shapesView = new ShapesView({
            model: map
        });
    });

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