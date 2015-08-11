var $ = require('jquery'),
    _ = require('underscore'),
    Article = require('../models/Article'),
    Backbone = require('backbone'),
    Map = require('../models/Map'),
    MapView = require('./MapView'),
    LocationView = require('./LocationView'),
    DrawingView = require('./DrawingView'),
    MainCanvasView = require('./MainCanvasView');

AddArticleView = Backbone.View.extend({
    el: $('.east_side'),
    events: {
        //'click #submit': 'saveArticle',
        'click #add_map': 'loadMap',
        'click #add_rock': 'loadRocks'
    },
    initialize: function(){
        this.render();
        $('#submit').on('click', this.saveArticle.bind(this));
    },
    render: function(){
        this.$el.empty();
        var tmpl = _.template($('.admin').html());
        this.$el.html(tmpl({}));
        CKEDITOR.replace('description');
        $('#map_container').hide();
        $('#render-canvas').hide();
    },
    saveArticle: function(){
        var id = this.generateId();
        var title = $('#caption').val();
        var route = $('#route_description').val();
        var description = CKEDITOR.instances['description'].getData();
        if ($('#map_container').is(':visible')){
            var drawingData = JSON.parse(localStorage.getItem('shapesData'));
            if (drawingData && drawingData.shapes.length > 0){
                var shapesData = JSON.stringify(drawingData.shapes);
                var mapData = JSON.stringify(drawingData.map);
            }
        }
        var article = new Article({
            title: title,
            route: route,
            description: description
        });
        if (typeof shapesData !== "undefined"){
            article.set({
                shapes: JSON.parse(shapesData),
                map: JSON.parse(mapData)
            });
        }
        this.collection.create(article, {silent: true});
        localStorage.removeItem('shapesData');
        article.save();
        App.eventAggregator.trigger('show:list');
        return false;
    },
    generateId: function(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    loadMap: function(){
        $('#map_container').show();
        var map = new Map();
        var mapView = new MapView({model: map});
        var locationView = new LocationView({model: map});
        var drawingView = new DrawingView({model: map});
    },
    loadRocks: function() {
        $('#render-canvas').show();
        new MainCanvasView().render();
    }
});
module.exports = AddArticleView;