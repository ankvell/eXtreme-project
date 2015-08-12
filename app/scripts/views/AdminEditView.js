var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Map = require('../models/Map'),
    MapView = require('./MapView'),
    LocationView = require('./LocationView'),
    DrawingView = require('./DrawingView'),
    ShapesView = require('./ShapesView'),
    RockView = require('./RockView');

var AdminEditView = Backbone.View.extend({
    id: 'editForm',
    events: {
        'click #add_map': 'loadMap',
        'click #add_rock': 'loadRock'
    },
    initialize: function(options){
        this.keyInDb = options.keyInDb;
        this.render();
        $('#submit').on('click', this.updateArticle.bind(this));
    },
    render: function(){
        $('#addForm').hide();
        var tmpl = _.template($('.admin').html());
        this.$el.html(tmpl({}));
        $('.east_side').prepend(this.el);
        $('#map_container').hide();
        $('#rock_container').hide();
        $('#canvas').hide();
        $('#caption').val(this.model.attributes.title);
        $('#route_description').val(this.model.attributes.route);
        CKEDITOR.replace('description');
        CKEDITOR.instances['description'].setData(this.model.attributes.description);
        if (this.model.attributes.map != undefined){
            $('#map_container').show();
            $('#autocomplete').hide();
            this.model.map = new Map({'lat': this.model.attributes.map.lat, 'lng': this.model.attributes.map.lon});
            var shapesView = new ShapesView({model: this.model, mapContainer: $('#map')[0]});
        }
        $('#radio' + this.model.attributes.difficulty).prop('checked',true);
        $('#duration').val(this.model.attributes.duration);
    },
    updateArticle: function(){
        this.model.attributes.title = $('#caption').val();
        this.model.attributes.route = $('#route_description').val();
        this.model.attributes.description = CKEDITOR.instances['description'].getData();
        if ($('#map_container').is(':visible')){
            var drawingData = JSON.parse(localStorage.getItem('shapesData'));
            if (drawingData && drawingData.shapes.length > 0){
                console.log(drawingData);
                this.model.attributes.shapes = drawingData.shapes;
                this.model.attributes.map = drawingData.map;
            }
        }
        if (document.querySelector('input[name="difficulty"]:checked')){
            this.model.attributes.difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        }
        this.model.attributes.duration = $('#duration').val();
        this.model.attributes.creationDate = this.getCurrentDate();
        localStorage.removeItem(this.keyInDb);
        var updatedData = JSON.stringify({
            id: this.model.attributes.id,
            title: this.model.attributes.title,
            route: this.model.attributes.route,
            description: this.model.attributes.description,
            difficulty: this.model.attributes.difficulty,
            duration: this.model.attributes.duration,
            creationDate: this.model.attributes.creationDate,
            shapes: this.model.attributes.shapes,
            map: this.model.attributes.map
        });
        localStorage.setItem(this.keyInDb, updatedData);
    },
    loadMap: function(){
        if ($('#rock_container').is(':visible')){
            $('#rock_container').hide();
        }
        $('#map_container').show();
        this.clearData();
        if (localStorage.getItem('shapesData') != null){
            localStorage.removeItem('shapesData');
        }
        var map = new Map();
        var mapView = new MapView({model: map});
        var locationView = new LocationView({model: map});
        var drawingView = new DrawingView({model: map});
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
});
module.exports = AdminEditView;