var $ = require('jquery'),
    Backbone = require('backbone'),
    MarkerView = require('./MarkerView'),
    InfoView = require('./InfoView');

var LocationView = Backbone.View.extend({
    el: $('#autocomplete'),
    initialize: function() {
        var markerView, infoView;
        var autocomplete = new google.maps.places.Autocomplete(this.el);
        autocomplete.setTypes(['geocode']);
        google.maps.event.addListener(autocomplete, 'place_changed', (function() {
            this.model.place = autocomplete.getPlace();
            this.model.map.setCenter(this.model.place.geometry.location);
            markerView = new MarkerView({
                model: this.model
            });
            infoView = new InfoView({
                model: this.model
            });
        }).bind(this));
    }
});
module.exports = LocationView;