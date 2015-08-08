var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Map = require('../models/Map'),
    ShapesView = require('./ShapesView');

var ArticleView = Backbone.View.extend({
    el: $('.east_side'),
    initialize: function(){
        if(this.model.attributes.mapData){
            this.model.map = new Map({'lat': this.model.attributes.mapData.lat, 'lng': this.model.attributes.mapData.lon, 'zoom': 12});
        }
        this.render();
    },
    render: function(){
        this.$el.empty();
        var tmpl = _.template($('.article-template').html());
        this.$el.html(tmpl(this.model.toJSON()));
        if (this.model.attributes.mapData){
            var shapesView = new ShapesView({model: this.model});
        } else {
            this.$el.find('.itinerary').hide();
        }
    }
});
module.exports = ArticleView;