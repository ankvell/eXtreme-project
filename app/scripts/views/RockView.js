var $ = require('jquery'),
    Backbone = require('backbone'),
    Path = require('../models/RockPath'),
    RockPathesCollection = require('../collections/RockPathesCollection');

var RockView = Backbone.View.extend({
    el: '#canvas',
    initialize: function(options){
        this.imageUrl = options.imageUrl;
        this.pathesCollection = new RockPathesCollection();
        this.context = this.el.getContext('2d');
        this.render();
    },
    render: function(){
        this.draw = false;
        var imageObj = new Image();
        imageObj.src = this.imageUrl;
        imageObj.addEventListener('load', (function(){
            var width = document.getElementById('rock_container').offsetWidth;
            var height = document.getElementById('rock_container').offsetHeight;
            this.el.width = width;
            this.el.height = height;
            this.context.drawImage(imageObj, 0, 0, width, height);
        }).bind(this));
        return this;
    },
    events: {
        'click': 'drawTrack',
        'dblclick': 'saveTrack'
    },
    drawTrack: function(event){
        var x = event.offsetX;
        var y = event.offsetY;
        if (!this.draw){
            this.startNewTrack();
        }
        this.position(x, y);
        var previousTrack = this.path.get('track');
        this.posCoords.push({"x": x, "y": y});
        this.path.set('track', previousTrack.concat({"x": x, "y": y}));
        this.connection();
    },
    startNewTrack: function(){
        this.path = new Path({});
        this.pathesCollection.add(this.path);
        this.posCoords = [];
        this.draw = true;
    },
    position: function(x, y){
        this.context.beginPath();
        this.context.arc(x, y, 3, 0, 2 * Math.PI);
        this.context.fill();
        this.context.restore();
    },
    connection: function(){
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.lineTo(this.posCoords[this.posCoords.length - 2].x, this.posCoords[this.posCoords.length - 2].y);
        this.context.lineTo(this.posCoords[this.posCoords.length - 1].x, this.posCoords[this.posCoords.length - 1].y);
        this.context.stroke();
        this.context.closePath();
    },
    saveTrack: function(){
        this.draw = false;
        localStorage.setItem('tracks', JSON.stringify(this.pathesCollection.models));
    },
});
module.exports = RockView;