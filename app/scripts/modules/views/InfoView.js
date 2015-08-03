var Backbone = require('backbone');

var InfoView = Backbone.View.extend({
    initialize: function() {
        var infoWindow, infoStr, address;
        infoWindow = new google.maps.InfoWindow();
        address = this.model.place.formatted_address || '';
        infoStr = '<div><strong>' + this.model.place.name + '</strong><br>' + address;
        this.getElevation(infoWindow, infoStr);
        google.maps.event.addListener(this.model.marker, 'click', (function() {
            infoWindow.open(this.model.map, this.model.marker);
            this.model.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout((function() {
                this.model.marker.setAnimation(null);
            }).bind(this), 2000);
        }).bind(this));
    },
    getElevation: function(infoWindow, infoStr) {
        var elevator = new google.maps.ElevationService();
        elevator.getElevationForLocations({
            'locations': [{
                lat: this.model.place.geometry.location.G,
                lng: this.model.place.geometry.location.K
            }]
        }, function(result) {
            if (result[0]) {
                infoWindow.setContent(infoStr + '<br>Висота: ' + result[0].elevation.toFixed(2) + ' м');
            } else {
                infoWindow.setContent(infoStr);
            }
        });
    }
});
module.exports = InfoView;