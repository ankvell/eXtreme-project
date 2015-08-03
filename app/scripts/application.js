var $ = require('jquery'),
    Backbone = require('backbone'),
    Map = require('./modules/models/Map'),
    MapView = require('./modules/views/MapView'),
    DrawingView = require('./modules/views/DrawingView'),
    MarkerView = require('./modules/views/MarkerView'),
    InfoView = require('./modules/views/InfoView'),
    LocationView = require('./modules/views/LocationView'),
    ShapesView = require('./modules/views/ShapesView');

var map = new Map({lat: 48.161526, lng: 24.501073});
var mapView = new MapView({model: map});
var locationView = new LocationView({model: map});
var drawingView = new DrawingView({model: map});

$('#load').on('click', function(){
    drawingView.remove();
    locationView.remove();
    shapesView = new ShapesView({model: map});
})