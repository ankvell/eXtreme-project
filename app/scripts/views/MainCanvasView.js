var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),

    RockPath = require('../models/RockPath'),
    RockPathesCollection = require('../collections/RockPathesCollection'),
    PanelInfoView = require('./PanelInfoView'),
    PathesCollectionView = require('./PathesCollectionView');

var MainCanvasView = Backbone.View.extend({
    el: '#render-canvas',
    template: _.template($('.drawCanvasTemplate').html()),
    events: {
        'click #newPath': 'addTtack',
        'click #saveTrack': 'saveTrack',
        'click #demo': 'drawTrack'
    },

    initialize: function(options) {
        this.countPathesCollection = new RockPathesCollection();
    },
    render: function() {
        var pathesCollectionView = new PathesCollectionView({
            collection: this.countPathesCollection
        });
        this.$el.append(pathesCollectionView.render().el);
        this.$el.html(this.template);

        // info-panel for description and complexity level of the track
        this.panelInfoView = new PanelInfoView({
            model: RockPath
        });
        this.$el.append(this.panelInfoView.el);

        // loaded image into canvas element or conversely
        this.canvas = this.$el.find("#demo")[0];
        this.context = this.canvas.getContext('2d');
        var imageObj = new Image();
        imageObj.src = event.target.currentSrc;

        this.canvas.width = imageObj.width;
        this.canvas.height = imageObj.height;
        this.context.drawImage(imageObj, 0, 0);

        this.draw = false;
        return this;
    },
    addTtack: function() {
        this.countPathesCollection.addNewPath();

        this.posCoords = [];
        this.draw = true;
        this.fixCoords = false;
    },
    saveTrack: function() {
        this.fixCoords = true;

        this.countPathesCollection.serialize();

        localStorage.setItem('tracks', JSON.stringify(this.countPathesCollection.models));

    },
    drawTrack: function(event) {

        if (!this.fixCoords && this.draw) {
            var x = event.offsetX;
            var y = event.offsetY;

            this.position(x, y);
            this.countPathesCollection.setCoords(x, y);

            // TODO: get coords from model
            this.posCoords.push({
                x: x,
                y: y
            });
            this.connection(this.posCoords);
        }
    },
    position: function(x, y) {
        this.color = $('#colorInput').val();

        // draw squares
        // this.context.strokeStyle = this.color;
        // this.context.strokeRect(x, y, 5, 5);

        // draw points
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(x, y, 3, 0, 2 * Math.PI);
        this.context.fill();
        this.context.restore();

        console.log('x: ' + x + ' y: ' + y);
    },
    connection: function(posCoords) {

        this.context.lineWidth = 3;
        this.context.strokeStyle = this.color;
        this.context.beginPath();
        // posCoords.forEach(function(el) {
        //     this.context.lineTo(el.x + pos_x / 2, el.y + pos_y / 2);
        // });
        for (var i = 0; i < posCoords.length; i++) {
            // this.context.lineTo(posCoords[i].x + 2.5, posCoords[i].y + 2.5);
            this.context.lineTo(posCoords[i].x, posCoords[i].y);
        }
        this.context.stroke();
        this.context.closePath();
    }
});

module.exports = MainCanvasView;