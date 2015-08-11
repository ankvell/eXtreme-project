var $ = require('jquery'),
    _ = require('underscore'),
    Article = require('../models/Article'),
    Backbone = require('backbone'),
    Map = require('../models/Map'),
    MapView = require('./MapView'),
    LocationView = require('./LocationView'),
    DrawingView = require('./DrawingView'),
    RockView = require('./RockView');

AddArticleView = Backbone.View.extend({
    el: $('.east_side'),
    events: {
        'click #add_map': 'loadMap',
        'click #add_rock': 'loadRock'
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
        $('#rock_container').hide();
        $('#canvas').hide();
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
        if (document.querySelector('input[name="difficulty"]:checked')){
            var difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        }
        var duration = $('#duration').val();
        var creationDate = this.getCurrentDate();
        var article = new Article({
            title: title,
            route: route,
            description: description,
            difficulty: difficulty,
            duration: duration,
            creationDate: creationDate
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
    getCurrentDate: function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10){
            dd = '0' + dd;
        }
        if (mm < 10){
            mm='0' + mm;
        }
        return dd + '-' + mm + '-' + yyyy;
    },
    loadRock: function(){
        $('#rock_container').show();

        $('#load_rock_image').on('click', function(){
            if (document.getElementById('url').checkValidity() && $('#url').val()){
                var imageUrl = $('#url').val();
                $('#choose_url').hide();
                $('#canvas').show();
                var rockView = new RockView({
                    imageUrl: imageUrl
                });
            } else{
                $('#error').text('Please enter valid url');
            }
        });
    }
});
module.exports = AddArticleView;