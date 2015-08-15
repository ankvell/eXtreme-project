var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Path = require('../models/RockPath'),
    RockPathesCollection = require('../collections/RockPathesCollection');

var RockView = Backbone.View.extend({
    el: '#canvas',
    initialize: function(options) {
        this.imageUrl = options.imageUrl;
        this.pathesCollection = new RockPathesCollection();
        this.context = this.el.getContext('2d');
        this.render();
        this.checkColor();

        _.bindAll(this, 'saveTrack', 'undoTrack');
        $('#save_track').on('click', this.saveTrack);
        $('#alter_track').on('click', function(){
            setTimeout(function() {
                this.undoTrack();
            }.bind(this))
        }.bind(this));



        $('.color-button').click(function(e) {
            this.color = e.target.style.backgroundColor;
        }.bind(this));
    },
    serialize: function() {
        return {
            imageUrl: this.imageUrl,
            paths: this.pathesCollection.toJSON()
        };
    },
    render: function() {
        this.draw = false;
        var imageObj = new Image();
        imageObj.src = this.imageUrl;
        imageObj.addEventListener('load', (function() {
            var width = document.getElementById('rock_container').offsetWidth;
            var height = document.getElementById('rock_container').offsetHeight;
            this.el.width = width;
            this.el.height = height;
            // this.context.drawImage(imageObj, 0, 0, width, height);
            this.context.drawImage(imageObj, 0, 0, 800, 540);
        }).bind(this));
        return this;
    },
    events: {
        'click': 'drawTrack'
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

        // this.color = this.path.get('trackColor');
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

        this.$el.next().find('#trackComplexity').val('');
        this.$el.next().find('#trackDescription').val('');
    },
    undoTrack: function() {
        this.render();

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
    },
    tracksDetails: function() {
        this.tracksComplexity = this.$el.next().find('#trackComplexity').val();
        this.path.set('complexity', this.tracksComplexity);

        this.tracksDescription = this.$el.next().find('#trackDescription').val();
        this.path.set('description', this.tracksDescription);
    },
    checkColor: function() {
        var colors = ['#026871', '#EC5F3E', '#F9CB3E', '#464646', '#FF6600', '#C7D70E', '#91A30E', '#524656', '#D14643', '#C10000', '#3A000D', '#01151A', '#003A48', '#007892', '#357D25', '#6FAF0B', '#455A64', '##009688'];

        colors.forEach(function(color) {
            var button = $('<div class="color-button"></div>');
            button.css('background-color', color);
            this.$el.next().find('.color_panel').append(button);
        }.bind(this));
    }
});
module.exports = RockView;