var Backbone = require('backbone'),
    Path = require('../models/RockPath');

var RockPathesCollection = Backbone.Collection.extend({
    model: Path,
    addNewPath: function() {
        this.add({});
    },
    setCoords: function(x, y) {
        this.last().set({
            'track': this.last().get('track').concat({
                x: x,
                y: y
            })
        });
    }
});

module.exports = RockPathesCollection;