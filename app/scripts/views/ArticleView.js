var $ = require('jquery'),
    Backbone = require('backbone'),
    Map = require('../models/Map'),
    ShapesView = require('./ShapesView');

var ArticleView = Backbone.View.extend({
    el: $('.east_side'),
    initialize: function(){
        if(this.model.mapData){
            this.model.map = new Map({'lat': this.model.mapData.lat, 'lng': this.model.mapData.lon, 'zoom': 13});
        }
        this.render();
    },
    render: function(){
        this.clearContent();
        this.$el.find('.h1').html(this.model.title);
        this.$el.find('.descr_info').html(this.model.description);
        if (this.model.map){
            this.$el.find('.itinerary').show();
            var shapesView = new ShapesView({model: this.model});
        }
    },
    clearContent: function(){
        this.$el.find('.h1').empty();
        this.$el.find('.descr_info').empty();
        this.$el.find('.itinerary_cont').empty();
        this.$el.find('.itinerary').hide();
    }
});
module.exports = ArticleView;