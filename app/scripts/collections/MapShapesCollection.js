var Backbone = require('backbone'),
    Shape = require('../models/MapShape');

var MapShapesCollection = Backbone.Collection.extend({
    model: Shape
});
module.exports = MapShapesCollection;;