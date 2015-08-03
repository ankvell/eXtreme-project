var $ = require('jquery'),
    Backbone = require('backbone');

var MapView = Backbone.View.extend({
    el: $('#map'),
    initialize: function() {
        this.model.map = new google.maps.Map(this.el, this.model.attributes.mapOptions);
    }
});
module.exports = MapView;