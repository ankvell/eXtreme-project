var $ = require('jquery'),
    Backbone = require('backbone');

var MapView = Backbone.View.extend({
    initialize: function() {
        $('#map').empty();
        this.model.map = new google.maps.Map(document.getElementById('map'), this.model.attributes.mapOptions);
    }
});
module.exports = MapView;