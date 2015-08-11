var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    RockPath = require('../models/RockPath');

var SinglePathView = Backbone.View.extend({
    render: function() {
        this.getCoords = this.model.get('track');
        console.log(this.getCoords);
        return this;
    }
});

module.exports = SinglePathView;