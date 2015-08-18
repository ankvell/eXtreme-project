var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Path = require('../models/RockPath'),
    RockPathesCollection = require('../collections/RockPathesCollection'),
    template = require('./templates/canvasDraw.html');

var canvasWidth = 800;
var canvasHeight = 540;

var DrawCanvasView = Backbone.View.extend({
    className: 'rock_edit_container',
    initialize: function(options) {
        this.pathesCollection = new RockPathesCollection();
        this.imageUrl = options.imageUrl;
        this.render();
    },
    events: {
        'click #save_track': 'saveTrack',
        'click #alter_track': 'undoTrack',
        'click canvas': 'drawTrack',
        'click .color-button': 'setColor'
    },
    serialize: function() {
        return {
            imageUrl: this.imageUrl,
            paths: this.pathesCollection.toJSON()
        };
    },
    render: function() {
        this.$el.html(template());
        this.context = this.$el.find('canvas')[0].getContext('2d');

        this.draw = false;
        var imageObj = new Image();
        imageObj.onload = function() {
            this.context.drawImage(imageObj, 0, 0, canvasWidth, canvasHeight);
        }.bind(this);
        imageObj.src = this.imageUrl;

        this.checkColor();
        return this;
    },
    drawTrack: function(event) {
        var x = event.offsetX;
        var y = event.offsetY;
        if (!this.draw) {
            this.startNewTrack();
        }
        this.position(x, y);
        var previousTrack = this.path.get('track');
        this.posCoords.push({
            'x': x,
            'y': y
        });
        this.path.set('track', previousTrack.concat({
            'x': x,
            'y': y
        }));
        this.connection();
    },
    startNewTrack: function() {
        this.path = new Path({});
        this.pathesCollection.add(this.path);
        this.posCoords = [];
        this.draw = true;
    },
    position: function(x, y) {
        this.path.set('trackColor', this.color);
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(x, y, 3, 0, 2 * Math.PI);
        this.context.fill();
        this.context.restore();
    },
    connection: function() {
        this.context.lineWidth = 2;
        this.context.beginPath();
        if (this.posCoords.length > 1) {
            this.context.strokeStyle = this.color;
            this.context.moveTo(this.posCoords[this.posCoords.length - 2].x, this.posCoords[this.posCoords.length - 2].y);
            this.context.lineTo(this.posCoords[this.posCoords.length - 1].x, this.posCoords[this.posCoords.length - 1].y);
        }
        this.context.stroke();
        this.context.closePath();
    },
    saveTrack: function() {
        this.draw = false;
        this.tracksDetails();
        this.$el.find('#trackComplexity').val('');
        this.$el.find('#trackDescription').val('');
    },
    undoTrack: function() {
        var imageObj = new Image();
        imageObj.onload = (function() {
            this.context.drawImage(imageObj, 0, 0, canvasWidth, canvasHeight);
            var allCoords = this.pathesCollection.models;
            allCoords.pop();
            allCoords.forEach(function(el) {
                var toPoints = el.attributes.track;
                this.drawColor = el.attributes.trackColor;
                toPoints.forEach(function(elem) {
                    this.context.beginPath();
                    this.context.fillStyle = this.drawColor;
                    this.context.arc(elem.x, elem.y, 3, 0, 2 * Math.PI);
                    this.context.fill();
                    this.context.restore();
                }.bind(this));
                this.context.beginPath();
                toPoints.forEach(function(elem) {
                    this.context.strokeStyle = this.drawColor;
                    this.context.lineWidth = 2;
                    this.context.lineTo(elem.x, elem.y);
                }.bind(this));
                this.context.stroke();
                this.context.closePath();
            }.bind(this));
        }).bind(this);
        imageObj.src = this.imageUrl;
    },
    tracksDetails: function() {
        this.tracksComplexity = this.$el.find('#trackComplexity').val();
        this.path.set('complexity', this.tracksComplexity);
        this.tracksDescription = this.$el.find('#trackDescription').val();
        this.path.set('description', this.tracksDescription);
    },
    checkColor: function() {
        var colors = ['#026871', '#EC5F3E', '#F9CB3E', '#464646', '#FF6600', '#C7D70E', '#91A30E', '#524656', '#D14643', '#C10000', '#3A000D', '#01151A', '#003A48', '#007892', '#357D25', '#6FAF0B', '#455A64', '##009688'];
        this.$el.find('.color_panel');
        colors.forEach(function(color) {
            var button = $('<div class="color-button"></div>');
            button.css('background-color', color);
            this.$el.find('.color_panel').append(button);
        }.bind(this));
    },
    setColor: function(e) {
         this.color = e.target.style.backgroundColor;
    }
});
module.exports = DrawCanvasView;