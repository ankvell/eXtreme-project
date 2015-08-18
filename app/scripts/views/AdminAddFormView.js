var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Article = require('../models/Article'),
    Map = require('../models/Map'),
    MapLocationView = require('./MapLocationView'),
    DrawMapView = require('./DrawMapView'),
    DrawCanvasView = require('./DrawCanvasView'),
    api = require('../configs/api'),
    template = require('./templates/articleFormTemplate.html');

var AdminAddFormView = Backbone.View.extend({
    template: template,
    id: 'addForm',
    events: {
        'click #add_map': 'loadMap',
        'click #add_rock': 'loadRock',
        'click .add_gps_track': 'loadMap',
        'change #gps_file': 'loadGPSTrack',
        'click .add_images': 'loadImages',
        'click #load': 'loadImages'
    },
    initialize: function() {
        this.render();
        _.bindAll(this, 'saveArticle');
        $('#submit').on('click', this.saveArticle);
    },
    render: function() {
        $('.content').empty();
        this.$el.html(this.template({}));
        $('.content').append(this.el);
        CKEDITOR.replace('description');
        this.titleEl = $('#caption');
        this.routeEl = $('#route_description');
        this.durationEl = $('#duration');
        this.editor = CKEDITOR.instances['description'];
        this.mapContainer = $('#map_container');
        this.rockContainer = $('#rock_container');
        this.urlField = $('#choose_url');
        this.canvasEl = $('#canvas');
        this.loadImgContainer = $('#carousel_imgs');
        this.imgs = [];
        this.mapContainer.hide();
        this.mapVisible = false;
        this.rockContainer.hide();
        this.rockVisible = false;
        this.loadImgContainer.hide();
        this.canvasEl.hide();
        this.urlField.hide();
    },
    saveArticle: function() {
        var article = new Article();
        this.setValidation(article);
        article.set({
            id : this.generateId(),
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
        if (article.isValid()){
            this.collection.add(article, {
                silent: true
            });
            api.addArticle(_.uniqueId('articleData'), JSON.stringify(article));
            App.eventAggregator.trigger('admin:main');
        }
    },
    setValidation: function(article){
        article.on('invalid', (function (model, errors) {
            errors.forEach((function(error){
                if (error.name == 'title'){
                    this.titleEl.addClass('error');
                } else if (error.name == 'description'){
                    $('<div class="error" style="height: 1px"><div>').insertAfter('#description');
                }
            }).bind(this));
        }).bind(this));
        this.titleEl.on('keyup', (function(){
            this.titleEl.removeClass('error');
        }).bind(this));
        this.editor.on('change', function(){
            $('div.error').remove();
        });
    },
    loadMap: function(e) {
        if (e.target.id === 'add_map'){
            $('.track-gps').hide();
        } else {
            $('.track-gps').show();
        }
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
        this.loadImgContainer.show();
        imgURL = $('#imgs_url').val();
        if (imgURL) {
            this.imgs.push(imgURL);
        }
        $('#imgs_url').val('');

    },
    generateId: function(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
});
module.exports = AdminAddFormView;
