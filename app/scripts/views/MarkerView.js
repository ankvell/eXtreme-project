var Backbone = require('backbone');

var MarkerView = Backbone.View.extend({
    initialize: function() {
        this.model.marker = new google.maps.Marker({
            map: this.model.map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            anchorPoint: new google.maps.Point(0, -29)
        });
        this.model.marker.setIcon(({
            url: 'https://cdn3.iconfinder.com/data/icons/shopping-and-market/512/pin_marker_location_mark_navigation_flat_icon-512.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34),
            scaledSize: new google.maps.Size(30, 30)
        }));
        this.model.marker.setPosition(this.model.place.geometry.location);
    }
});
module.exports = MarkerView;