var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Map = require('../models/Map'),
    MapLocationView = require('./MapLocationView'),
    DrawMapView = require('./DrawMapView'),
    MapView = require('./MapView'),
    CanvasView = require('./CanvasView'),
    DrawCanvasView = require('./DrawCanvasView'),
    api = require('../configs/api'),
    template = require('./templates/articleFormTemplate.html');

var AdminEditFormView = Backbone.View.extend({
    id: 'editForm',
    template: template,
    events: {
        'click #add_map': 'loadMap',
        'click .add_gps_track': 'loadMap',
        'click #add_rock': 'loadRock',
        'change #gps_file': 'loadGPSTrack',
        'click .add_images': 'loadImages',
        'click #load': 'loadImages'
    },
    initialize: function() {
        api.eachArticle(function(key) {
            var obj = JSON.parse(api.getArticle(key));
            if (obj.id === this.model.get('id')) {
                this.keyInDb = key;
            }
        }.bind(this));
        this.render();
        _.bindAll(this, 'updateArticle', 'initCanvas');
        this.$el.on('click', '#load_rock_image', this.initCanvas);
        //Providing simple data validation
        $('#submit').on('click', (function() {
            if (!this.titleEl.val()) {
                this.titleEl.addClass('error');
                this.titleEl.on('keyup', (function() {
                    this.titleEl.removeClass('error');
                }).bind(this));
            }
            if (!this.editor.getData()) {
                $('<div class="error" style="height: 1px"><div>').insertAfter('#description');
                this.editor.on('change', function() {
                    $('div.error').remove();
                });
            }
            if (this.titleEl.val() && this.editor.getData()) {
                this.updateArticle();
            }
        }).bind(this));
    },
    render: function() {
        $('.content').empty();
        this.$el.html(this.template(this.model.toJSON()));
        $('.content').prepend(this.el);
        CKEDITOR.replace('description');
        this.titleEl = $('#caption');
        this.routeEl = $('#route_description');
        this.durationEl = $('#duration');
        this.editor = CKEDITOR.instances.description;
        this.mapAutocompleteField = $('#autocomplete');
        this.mapContainer = $('#map_container');
        this.rockContainer = $('#rock_container');
        this.urlField = $('#choose_url');
        this.canvasEl = $('#canvas');
        this.loadImgContainer = $('#carousel_imgs');
        this.imgs = this.model.attributes.imgs;
        this.rockContainer.hide();
        this.mapContainer.hide();
        this.urlField.hide();
        this.mapVisible = false;
        this.rockVisible = false;
        this.canvasEl.hide();
        this.loadImgContainer.hide();
        this.populateForm();
    },
    populateForm: function() {
        this.titleEl.val(this.model.attributes.title);
        this.routeEl.val(this.model.attributes.route);
        this.editor.setData(this.model.attributes.description);
        this.durationEl.val(this.model.attributes.duration);
        if (this.model.attributes.map) {
            this.mapContainer.show();
            this.mapVisible = true;
            this.mapAutocompleteField.hide();
            $('.track-gps').hide();
            this.model.map = new Map({
                'lat': this.model.attributes.map.lat,
                'lng': this.model.attributes.map.lon
            });
            var mapView = new MapView({
                model: this.model,
                mapContainer: $('#map')[0]
            });
        }
        if (this.model.attributes.tracks) {
            this.rockContainer.show();
            this.rockVisible = true;
            this.canvasView = new CanvasView({
                model: this.model
            });
        }
        $('#radio' + this.model.attributes.difficulty).prop('checked', true);
    },
    updateArticle: function() {
        this.model.attributes.title = this.titleEl.val();
        this.model.attributes.route = this.routeEl.val();
        this.model.attributes.description = this.editor.getData();
        this.model.attributes.duration = this.durationEl.val();
        this.model.attributes.creationDate = this.getCurrentDate();
        if (this.drawMapView) {
            var mapDrawing = this.drawMapView.serialize();
            if (mapDrawing.shapes.length > 0) {
                this.model.attributes.shapes = mapDrawing.shapes;
                this.model.attributes.map = mapDrawing.map;
                this.model.attributes.type = 'routs';
                this.model.attributes.rockImgUrl = '';
                this.model.attributes.tracks = '';
            }
        }
        if (this.drawCanvasView) {
            var canvasDrawing = this.drawCanvasView.serialize();
            if (canvasDrawing) {
                this.model.attributes.rockImgUrl = canvasDrawing.imageUrl;
                this.model.attributes.tracks = canvasDrawing.paths;
                this.model.attributes.type = 'rocks';
                this.model.attributes.map = '';
                this.model.attributes.shapes = '';
            }
        }
        if (this.$el.find('input[name=difficulty]:checked')) {
            this.model.attributes.difficulty = this.$el.find('input[name=difficulty]:checked').val();
        }
        api.removeArticle(this.keyInDb);
        var updatedData = JSON.stringify({
            id: this.model.attributes.id,
            title: this.model.attributes.title,
            route: this.model.attributes.route,
            description: this.model.attributes.description,
            difficulty: this.model.attributes.difficulty,
            duration: this.model.attributes.duration,
            creationDate: this.model.attributes.creationDate,
            shapes: this.model.attributes.shapes,
            map: this.model.attributes.map,
            type: this.model.attributes.type,
            rockImgUrl: this.model.attributes.rockImgUrl,
            tracks: this.model.attributes.tracks,
            imgs: this.imgs
        });
        api.addArticle(this.keyInDb, updatedData);
        App.eventAggregator.trigger('admin:main');
    },
    loadMap: function(e) {
        if (e.target.id === 'add_map') {
            $('.track-gps').hide();
        } else {
            $('.track-gps').show();
        }
        if (this.rockVisible) {
            this.rockContainer.hide();
            this.rockVisible = false;
        }
        this.mapAutocompleteField.show();
        this.mapContainer.show();
        this.mapVisible = true;
        var map = new Map();
        $('#map').empty();
        this.model.map = new google.maps.Map(document.getElementById('map'), map.attributes.mapOptions);
        var mapLocationView = new MapLocationView({
            model: this.model
        });
        this.drawMapView = new DrawMapView({
            model: this.model
        });
    },
    loadGPSTrack: function(e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        var lines, coordinatesArray, singlePoint;
        reader.onload = (function(e) {
            lines = e.target.result.split('\n').splice(6);
            lines.pop();
            coordinatesArray = [];
            lines.forEach(function(line) {
                singlePoint = {
                    lat: parseFloat(line.split(',')[0]),
                    lng: parseFloat(line.split(',')[1])
                };
                coordinatesArray.push(singlePoint);
            });
            this.drawMapView.drawGPSTrack(coordinatesArray);
        }).bind(this);
        reader.readAsText(file);
    },
    loadRock: function() {
        if (this.mapVisible) {
            this.mapContainer.hide();
            this.mapVisible = false;
        }
        this.rockContainer.hide();
        this.urlField.show();
    },
    loadImages: function() {
        this.loadImgContainer.show();
        imgURL = $('#imgs_url').val();
        if (imgURL) {
            this.imgs.push(imgURL);
        }
        $('#imgs_url').val('');
    },
    initCanvas: function() {
        var imageUrlInput = $('#url')[0];
        var url = imageUrlInput.value;
        if (imageUrlInput.checkValidity() && url) {
            this.urlField.hide();
            this.rockContainer.show();
            this.rockVisible = true;
            this.drawCanvasView = new DrawCanvasView({
                imageUrl: url
            });
            this.rockContainer.html(this.drawCanvasView.el);
        } else {
            $('#error').text('Invalid url');
        }
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
    }
});
module.exports = AdminEditFormView;