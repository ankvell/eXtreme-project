var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var AppModel = require('../models/mainModel');

// var tmpl = require('text!templates/rockClimbApp');

var pubSub = {};
_.extend(pubSub, Backbone.Events);

/* ------------------------- */

module.exports = Backbone.View.extend({
    el: '#renderCanvas',
    template: '<button id="clear">Clear All</button><button id="add">Add new route</button><canvas id="demo" width="800" height="520"></canvas>',
    events: {
        'mousedown #demo': 'coordinates',
        'click #add': 'addNewRoute'
    },

    initialize: function() {
        alert('view init');

        this.allCoords = [];
        this.pos_x = 5;
        this.pos_y = 5;
        this.render();
    },
    render: function() {
        this.$el.html(this.template);
        this.canvas = this.$el.find("#demo")[0];
        this.context = this.canvas.getContext('2d');
        return this;
    },

    coordinates: function(event) {

        var x = event.offsetX;
        var y = event.offsetY;

        this.drawPosition(x, y);
        this.drawConnection(this.allCoords);

        this.model.set({
            'routeCoords': this.allCoords
        });

        console.log(this.model.get('routeCoords'));
    },
    drawPosition: function(x, y) {

        this.context.strokeStyle = 'red';
        this.context.strokeRect(x, y, this.pos_x, this.pos_y);

        this.allCoords.push({
            x: x,
            y: y
        });
        console.log('x: ' + x + ' y: ' + y);
    },
    drawConnection: function(coords) {

        this.context.beginPath();

        coords.forEach(function(el) {
            this.context.lineTo(el.x + this.pos_x / 2, el.y + this.pos_y / 2);

        }.bind(this));

        this.context.stroke();
        this.context.closePath();
    },
    addNewRoute: function() {
        this.routeModel = new AppModel();
        // alert(this.routeModel.get('routeCoords'));
    },
    clear: function() {
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        /**
         * undo last point
         * need redraw
         */

        // var removeLast = this.allCoords.pop();
        // this.drawConnection(this.allCoords);

    }
});