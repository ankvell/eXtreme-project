var $ = require('jquery'),
    _ = require('underscore'),
    Article = require('../models/Article'),
    Backbone = require('backbone'),
    Map = require('../models/Map'),
    MapView = require('./MapView'),
    LocationView = require('./LocationView'),
    DrawingView = require('./DrawingView'),
    RockView = require('./RockView'),
    AdminEditListView = require('./AdminEditListView');

var AdminView = Backbone.View.extend({
    id: 'addForm',
    events: {
        'click #add_map': 'loadMap',
        'click #add_rock': 'loadRock',
        'click #showArticlesTable': 'showAdminEditListView'
    },
    initialize: function(){
        this.render();
        $('#submit').on('click', this.saveArticle.bind(this));
    },
    render: function(){
        $('.east_side').empty();
        var tmpl = _.template($('.admin').html());
        this.$el.html(tmpl({}));
        $('.east_side').append(this.el);
        CKEDITOR.replace('description');
        $('#map_container').hide();
        $('#choose_url').hide();
        $('#rock_container').hide();
        $('#canvas').hide();
    },
    saveArticle: function(){
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
    loadMap: function(){
        if ($('#rock_container').is(':visible')){
            $('#rock_container').hide();
        }
        $('#map_container').show();
        this.clearData();
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
        if ($('#map_container').is(':visible')){
            $('#map_container').hide();
        }
        $('#choose_url').show();
        this.clearData();
        $('#load_rock_image').on('click', function(){
            if (document.getElementById('url').checkValidity() && $('#url').val()){
                var imageUrl = $('#url').val();
                $('#choose_url').hide();
                $('#rock_container').show();
                $('#canvas').show();
                var rockView = new RockView({
                    imageUrl: imageUrl
                });
            } else{
                $('#error').text('Please enter valid url');
            }
        });
    },
    clearData: function(){
        if (localStorage.getItem('shapesData') != null){
            localStorage.removeItem('shapesData');
        }
        if (localStorage.getItem('tracks') != null){
            localStorage.removeItem('tracks');
        }
    },
    showAdminEditListView: function(){
        var adminEditListView = new AdminEditListView({collection: this.collection});
    }
});
module.exports = AdminView;
