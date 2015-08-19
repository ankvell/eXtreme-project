var $ = require('jquery'),
    Backbone = require('backbone'),
    Map = require('../models/Map'),
    MapView = require('./MapView'),
    CanvasView = require('./CanvasView'),
    bxSlider = require('../carousel/bx-slider'),
    sidebarTemplate = require('./templates/sidebar.html'),
    template = require('./templates/articleTemplate.html');

var ArticleView = Backbone.View.extend({
    el: $('.content'),
    template: template,
    initialize: function() {
        if (this.model.attributes.map) {
            this.model.map = new Map({
                'lat': this.model.attributes.map.lat,
                'lng': this.model.attributes.map.lon,
                'zoom': 14
            });
        }
        this.render();
    },
    render: function() {
        this.$el.empty();
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.append(sidebarTemplate({}));
        if (this.model.attributes.map) {
            var mapContainer = document.getElementsByClassName('itinerary_cont')[0];
            var mapView = new MapView({
                model: this.model,
                mapContainer: mapContainer
            });
        }
        if (this.model.attributes.rockImgUrl && this.model.attributes.tracks) {
            this.canvasView = new CanvasView({
                model: this.model
            });
        }
        $('.bxslider').bxSlider({
            mode: 'fade',
            captions: true,
            adaptiveHeight: true,
            controls: false
        });
    }
});
module.exports = ArticleView;