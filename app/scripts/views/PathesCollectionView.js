var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    RockPathesCollection = require('../collections/RockPathesCollection'),
    SinglePathView = require('./SinglePathView');

var PathesCollectionView = Backbone.View.extend({
    initialize: function(options) {
        this.options = options;
        this.collection.on('add', this.onChange, this);
    },
    render: function() {

        this.collection.forEach(function(model) {
            this.newPath = new SinglePathView({
                model: model
            }).render();
        }.bind(this));

        this.$el.append(this.newPath);
        return this;
    },
    onChange: function(model) {
        this.render();
    }
});

module.exports = PathesCollectionView;