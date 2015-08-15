var $ = require('jquery'),
    _ = require('underscore'),
    Article = require('../models/Article'),
    Backbone = require('backbone'),
    Map = require('../models/Map'),
    MapView = require('./MapView'),
    LocationView = require('./LocationView'),
    DrawingView = require('./DrawingView'),
    RockView = require('./RockView'),
    AdminEditListView = require('./AdminEditListView'),
    template = require('./templates/adminTemplate.html');

var AdminView = Backbone.View.extend({
    template: template,
    id: 'addForm',
    events: {
        'click #add_map': 'loadMap',
        'click #add_rock': 'loadRock',
        'click #load': 'loadImages'
    },
    initialize: function() {
        this.render();
        _.bindAll(this, 'saveArticle');
        $('#submit').on('click', this.saveArticle);
    },
    render: function() {
        $('.east_side').empty();
        this.$el.html(this.template({}));
        $('.east_side').append(this.el);
        CKEDITOR.replace('description');
        this.titleEl = $('#caption');
        this.routeEl = $('#route_description');
        this.durationEl = $('#duration');
        this.editor = CKEDITOR.instances['description'];
        this.mapContainer = $('#map_container');
        this.rockContainer = $('#rock_container');
        this.urlField = $('#choose_url');
        this.canvasEl = $('#canvas');
        this.imgs = [];
        this.mapContainer.hide();
        this.mapVisible = false;
        this.rockContainer.hide();
        this.rockVisible = false;
        this.canvasEl.hide();
        this.urlField.hide();
    },
    saveArticle: function() {
        var article = new Article({
            title: this.titleEl.val(),
            route: this.routeEl.val(),
            description: this.editor.getData(),
            duration: this.durationEl.val(),
            creationDate: this.getCurrentDate()
        });
        if (this.mapVisible) {
            var drawingData = JSON.parse(localStorage.getItem('shapesData'));
            if (drawingData && drawingData.shapes.length > 0) {
                article.set({
                    shapes: drawingData.shapes,
                    map: drawingData.map
                });
            }
        }
        if (this.rockVisible) {
            var canvasDrawing = this.rockView.serialize();
            var canvasData = localStorage.setItem('tracks', JSON.stringify(canvasDrawing));
            if (canvasDrawing) {
                article.set({
                    imgUrl: canvasDrawing.imageUrl,
                    tracks: canvasDrawing.paths
                });
            }
        }
        if (this.$el.find('input[name=difficulty]:checked')) {
            article.set({
                difficulty: this.$el.find('input[name=difficulty]:checked').val()
            });
        }
        this.collection.create(article, {
            silent: true
        });
        article.save();
        this.clearData();
        App.eventAggregator.trigger('admin:main');
    },
    loadMap: function() {
        if (this.rockVisible) {
            this.rockContainer.hide();
            this.rockVisible = false;
        }
        this.mapContainer.show();
        this.mapVisible = true;
        this.clearData();
        var map = new Map();
        var mapView = new MapView({
            model: map
        });
        var locationView = new LocationView({
            model: map
        });
        var drawingView = new DrawingView({
            model: map
        });
    },
    getCurrentDate: function() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return dd + '-' + mm + '-' + yyyy;
    },
    loadRock: function() {
        if (this.mapVisible) {
            this.mapContainer.hide();
            this.mapVisible = false;
        }
        this.urlField.show();
        // this.urlField.focus();
        this.clearData();
        $('#load_rock_image').on('click', (function() {
            if ($('#url')[0].checkValidity() && $('#url').val()) {
                this.urlField.hide();
                this.rockContainer.show();
                this.rockVisible = true;
                this.canvasEl.show();
                this.rockView = new RockView({
                    imageUrl: $('#url').val()
                });
            } else {
                $('#error').text('Invalid url');
            }
        }).bind(this));
    },
    loadImages: function() {
            imgURL = $('#imgs_url').val();
            if(imgURL) {
                this.imgs.push(imgURL);
            }
            $('#imgs_url').val('');
    },
    clearData: function() {
        if (localStorage.getItem('shapesData') != null) {
            localStorage.removeItem('shapesData');
        }
        if (localStorage.getItem('tracks') != null) {
            localStorage.removeItem('tracks');
        }
    }
});
module.exports = AdminView;