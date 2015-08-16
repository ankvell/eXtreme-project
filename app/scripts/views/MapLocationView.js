var $ = require('jquery'),
    Backbone = require('backbone'),
    MarkerView = require('./MarkerView'),
    MapInfoView = require('./MapInfoView');

var MapLocationView = Backbone.View.extend({
    initialize: function() {
        var markerView, mapInfoView;
        var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'));
        autocomplete.setTypes(['geocode']);
        google.maps.event.addListener(autocomplete, 'place_changed', (function() {
            this.model.place = autocomplete.getPlace();
            this.model.map.setCenter(this.model.place.geometry.location);
            markerView = new MarkerView({
                model: this.model
            });
            mapInfoView = new MapInfoView({
                model: this.model
            });
        }).bind(this));
    }
});
module.exports = MapLocationView;