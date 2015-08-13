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
        _.bindAll(this, 'updateArticle');
        $('#submit').on('click', this.updateArticle);
    },
    render: function(){
        $('#addForm').hide();
        var tmpl = _.template($('.admin').html());
        this.$el.html(tmpl({}));
        $('.east_side').prepend(this.el);
        CKEDITOR.replace('description');
        this.titleEl = $('#caption');
        this.routeEl = $('#route_description');
        this.durationEl = $('#duration');
        this.editor = CKEDITOR.instances['description'];
        this.mapAutocompleteField = $('#autocomplete');
        this.mapContainer = $('#map_container');
        this.rockContainer = $('#rock_container');
        this.urlField = $('choose_url');
        this.canvasEl = $('#canvas');
        this.mapContainer.hide();
        this.mapVisible = false;
        this.rockContainer.hide();
        this.rockVisible = false;
        this.canvasEl.hide();
        this.populateForm();
    },
    populateForm: function(){
        this.titleEl.val(this.model.attributes.title);
        this.routeEl.val(this.model.attributes.route);
        this.editor.setData(this.model.attributes.description);
        this.durationEl.val(this.model.attributes.duration);
        if (this.model.attributes.map){
            this.mapContainer.show();
            this.mapVisible = true;
            this.mapAutocompleteField.hide();
            this.model.map = new Map({'lat': this.model.attributes.map.lat, 'lng': this.model.attributes.map.lon});
            var shapesView = new ShapesView({model: this.model, mapContainer: $('#map')[0]});
        }
        $('#radio' + this.model.attributes.difficulty).prop('checked',true);
    },
    updateArticle: function(){
        this.model.attributes.title = this.titleEl.val();
        this.model.attributes.route = this.routeEl.val();
        this.model.attributes.description = this.editor.getData();
        this.model.attributes.duration = this.durationEl.val();
        this.model.attributes.creationDate = this.getCurrentDate();
        if (this.mapVisible){
            var drawingData = JSON.parse(localStorage.getItem('shapesData'));
            if (drawingData && drawingData.shapes.length > 0){
                this.model.attributes.shapes = drawingData.shapes;
                this.model.attributes.map = drawingData.map;
            }
        }
        if (this.$el.find('input[name=difficulty]:checked')){
            this.model.attributes.difficulty = this.$el.find('input[name=difficulty]:checked').val()
        }
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
        App.eventAggregator.trigger('show:list');
    },
    loadMap: function(){
        if (this.rockVisible){
            this.rockContainer.hide();
            this.rockVisible = false;
        }
        this.mapAutocompleteField.show();
        this.mapContainer.show();
        this.mapVisible = true;
        this.clearData();
        var map = new Map();
        var mapView = new MapView({model: map});
        var locationView = new LocationView({model: map});
        var drawingView = new DrawingView({model: map});
    },
    loadRock: function(){
        if (this.mapVisible){
            this.mapContainer.hide();
            this.mapVisible = false;
        }
        this.urlField.show();
        this.clearData();
        $('#load_rock_image').on('click', function(){
            if ($('#url')[0].checkValidity() && $('#url').val()){
                this.urlField.hide();
                this.rockContainer.show();
                this.rockVisible = true;
                this.canvasEl.show();
                var rockView = new RockView({
                    imageUrl: $('#url').val()
                });
            } else{
                $('#error').text('Invalid url');
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