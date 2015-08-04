var $ = require('jquery'),
    Backbone = require('backbone'),
    Map = require('./models/Map'),
    MapView = require('./views/MapView'),
    DrawingView = require('./views/DrawingView'),
    MarkerView = require('./views/MarkerView'),
    InfoView = require('./views/InfoView'),
    LocationView = require('./views/LocationView'),
    ShapesView = require('./views/ShapesView');

var map = new Map({lat: 48.161526, lng: 24.501073});
var mapView = new MapView({model: map});
var locationView = new LocationView({model: map});
var drawingView = new DrawingView({model: map});

$('#load').on('click', function(){
    drawingView.remove();
    locationView.remove();
    shapesView = new ShapesView({model: map});
});