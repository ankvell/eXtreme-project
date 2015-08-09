var $ = require('jquery'),
    _ = require('underscore'),
    Article = require('../models/Article'),
    Backbone = require('backbone'),
    Map = require('../models/Map'),
    MapView = require('./MapView'),
    LocationView = require('./LocationView'),
    DrawingView = require('./DrawingView');

AddArticleView = Backbone.View.extend({
    el: $('.east_side'),
    events: {
        'click #submit': 'saveArticle',
        'click #add_map': 'loadMap'
    },
    initialize: function(){
        this.render();
    },
    render: function(){
        this.$el.empty();
        var tmpl = _.template($('.admin').html());
        this.$el.html(tmpl({}));
        CKEDITOR.replace('description');
        $('#map_container').hide();
    },
    saveArticle: function(e){
        e.preventDefault();
        var id = this.generateId();
        var title = $('#caption').val();
        var route = $('#route_description').val();
        var description = CKEDITOR.instances['description'].getData();
        if ($('#map_container').is(':visible') && localStorage.getItem('shapesData' !== null)){
            var drawingData = JSON.parse(localStorage.getItem('shapesData'));
            var shapesData = JSON.stringify(drawingData.shapes);
            var mapData = JSON.stringify(drawingData.map);
        }
        var article = new Article({
            title: title,
            route: route,
            description: description,
            //FIX PROBLEM WITH EMPTY MAP NOT BEING SAVED
            shapes: JSON.parse(shapesData) || '',
            map: JSON.parse(mapData) || ''
        });
        this.collection.create(article);
        localStorage.removeItem('shapesData');
        article.save();
        App.eventAggregator.trigger('show:list');
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
    }
});
module.exports = AddArticleView;