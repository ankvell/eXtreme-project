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
        'click #add_gps_track': 'loadMap',
        'click #add_rock': 'loadRock',
        'change #gps_file': 'loadGPSTrack'
    },
    initialize: function(){
        api.eachArticle((function(key){
            var obj = JSON.parse(api.getArticle(key));
            if (obj.id === this.model.attributes.id) {
                this.keyInDb = key;
            }
        }).bind(this));
        this.render();
        _.bindAll(this, 'updateArticle');
        $('#submit').on('click', this.updateArticle);
    },
    render: function(){
        $('.content').empty();
        this.$el.html(this.template(this.model.toJSON()));
        $('.content').prepend(this.el);
        CKEDITOR.replace('description');
        this.titleEl = $('#caption');
        this.routeEl = $('#route_description');
        this.durationEl = $('#duration');
        this.editor = CKEDITOR.instances['description'];
        this.mapAutocompleteField = $('#autocomplete');
        this.mapContainer = $('#map_container');
        this.rockContainer = $('#rock_container');
        this.urlField = $('#choose_url');
        this.canvasEl = $('#canvas');
            this.rockContainer.hide();
            this.mapContainer.hide();
            this.urlField.hide();
            this.mapVisible = false;
            this.rockVisible = false;
            this.canvasEl.hide();
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
            if (this.mapVisible) {
                var mapDrawing = this.drawMapView.serialize();
                if (mapDrawing.shapes.length > 0) {
                    this.model.attributes.shapes = mapDrawing.shapes;
                    this.model.attributes.map = mapDrawing.map;
                    this.model.attributes.type = 'routs';
                }
            }

            if (this.rockVisible) {
                var canvasDraving = this.drawCanvasView.serialize();
                if (canvasDraving) {
                    this.model.attributes.tracks = canvasDraving.tracks;
                    this.model.attributes.type = 'rocks';
                }
            }

            if (this.$el.find('input[name=difficulty]:checked')) {
                this.model.attributes.difficulty = this.$el.find('input[name=difficulty]:checked').val();
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
                map: this.model.attributes.map,
                type: this.model.attributes.type
            });
            localStorage.setItem(this.keyInDb, updatedData);
            App.eventAggregator.trigger('admin:main');
        },
        loadMap: function() {
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
            $('.itinerary_rock').empty();
            if(this.rockVisible) {
                this.rockContainer.hide();
                this.urlField.show();
            }
            $('#load_rock_image').on('click', (function() {
                if ($('#url')[0].checkValidity() && $('#url').val()) {
                    this.urlField.hide();
                    this.rockContainer.show();
                    this.rockVisible = true;
                    // this.canvasEl.show();
                    this.drawCanvasView = new DrawCanvasView({
                        imageUrl: $('#url').val()
                    });
                } else {
                    $('#error').text('Invalid url');
                }
            }).bind(this));
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
    });
    module.exports = AdminEditFormView;
