var Backbone = require('backbone'),
    Path = require('../models/RockPath');

var RockPathesCollection = Backbone.Collection.extend({
    model: Path
});
module.exports = RockPathesCollection;