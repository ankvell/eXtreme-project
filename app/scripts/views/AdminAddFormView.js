var $ = require('jquery'),
    _ = require('underscore'),
    Article = require('../models/Article'),
    Backbone = require('backbone'),
    Map = require('../models/Map'),
    MapLocationView = require('./MapLocationView'),
    DrawMapView = require('./DrawMapView'),
    DrawCanvasView = require('./DrawCanvasView'),
    template = require('./templates/articleFormTemplate.html');

var AdminAddFormView = Backbone.View.extend({
    template: template,
    id: 'addForm',
    events: {
        'click #add_map': 'loadMap',
        'click #add_rock': 'loadRock',
        'click #load': 'loadImages',
        'change #gps_file': 'loadGPSTrack'
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
            var mapDrawing = this.drawMapView.serialize();
            if (mapDrawing.shapes.length > 0) {
                article.set({
                    shapes: mapDrawing.shapes,
                    map: mapDrawing.map,
                    type: 'routs'
                });
            }
        }
        if (this.rockVisible) {
            var canvasDrawing = this.drawCanvasView.serialize();
            if (canvasDrawing) {
                article.set({
                    rockImgUrl: canvasDrawing.imageUrl,
                    tracks: canvasDrawing.paths,
                    type: 'rocks'
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
        App.eventAggregator.trigger('admin:main');
    },
    loadMap: function() {
        if (this.rockVisible) {
            this.rockContainer.hide();
            this.rockVisible = false;
        }
        this.mapContainer.show();
        this.mapVisible = true;
        var map = new Map();
        $('#map').empty();
        map.map = new google.maps.Map(document.getElementById('map'), map.attributes.mapOptions);
        var mapLocationView = new MapLocationView({
            model: map
        });
        this.drawMapView = new DrawMapView({
            model: map
        });
    },
    loadGPSTrack: function(e){
        var file = e.target.files[0];
        var reader = new FileReader();
        var lines, coordinatesArray, singlePoint;
        reader.onload = (function(e){
            lines = e.target.result.split('\n').splice(6);
            lines.pop();
            coordinatesArray = [];
            lines.forEach(function(line){
                singlePoint = {
                    lat: parseFloat(line.split(',')[0]),
                    lng: parseFloat(line.split(',')[1])
                }
                coordinatesArray.push(singlePoint);
            });
            this.drawMapView.drawGPSTrack(coordinatesArray);
        }).bind(this);
        reader.readAsText(file);
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
        $('#load_rock_image').on('click', (function() {
            if ($('#url')[0].checkValidity() && $('#url').val()) {
                this.urlField.hide();
                this.rockContainer.show();
                this.rockVisible = true;
                this.canvasEl.show();
                this.drawCanvasView = new DrawCanvasView({
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
    }
});
module.exports = AdminAddFormView;
