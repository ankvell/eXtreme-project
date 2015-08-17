var $ = require('jquery'),
    Backbone = require('backbone');

var MapView = Backbone.View.extend({
    initialize: function(options) {
        var shapes = this.model.attributes.shapes;
        this.model.map = new google.maps.Map(options.mapContainer, this.model.map.attributes.mapOptions);
        this.readShapes(shapes);
    },
    readShapes: function(shapes) {
        var marker, rectangle, circle, polyline, polygon;
        this.latLngBounds = new google.maps.LatLngBounds();
        shapes.forEach((function(shape, index) {
            switch (shape.type) {
                case 'marker':
                    marker = this.readMarker(shape);
                    break;
                case 'rectangle':
                    rectangle = this.readRectangle(shape);
                    break;
                case 'circle':
                    circle = this.readCircle(shape);
                    break;
                case 'polyline':
                    polyline = this.readPolyline(shape);
                    break;
                case 'polygon':
                    polygon = this.readPolygon(shape);
                    break;
                default:
                    throw new Error('Shape type is incorrect');
            }
        }).bind(this));
        this.model.map.fitBounds(this.latLngBounds);
    },
    readMarker: function(markerData) {
        var position, markerOptions, marker;
        position = new google.maps.LatLng(markerData.position.lat, markerData.position.lon);
        markerOptions = {
            position: position,
            editable: false,
            label: markerData.label,
            map: this.model.map
        };
        marker = new google.maps.Marker(markerOptions);
        this.latLngBounds.extend(position);
        return marker;
    },
    readRectangle: function(rectangleData) {
        var southWest, northEast, bounds, rectangleOptions, rectangle;
        southWest = new google.maps.LatLng(rectangleData.bounds.southWest.lat, rectangleData.bounds.southWest.lon);
        northEast = new google.maps.LatLng(rectangleData.bounds.northEast.lat, rectangleData.bounds.northEast.lon);
        bounds = new google.maps.LatLngBounds(southWest, northEast);
        rectangleOptions = {
            strokeWeight: 0,
            bounds: bounds,
            editable: false,
            fillColor: rectangleData.color,
            fillOpacity: 0.4,
            map: this.model.map
        };
        rectangle = new google.maps.Rectangle(rectangleOptions);
        this.latLngBounds.extend(southWest);
        this.latLngBounds.extend(northEast);
        return rectangle;
    },
    readCircle: function(circleData) {
        var center, circleOptions, circle;
        center = new google.maps.LatLng(circleData.center.lat, circleData.center.lon);
        circleOptions = {
            strokeWeight: 0,
            center: center,
            radius: parseFloat(circleData.radius),
            editable: false,
            fillColor: circleData.color,
            fillOpacity: 0.5,
            map: this.model.map
        };
        circle = new google.maps.Circle(circleOptions);
        this.latLngBounds.union(circle.getBounds());
        return circle;
    },
    readPolyline: function(polylineData) {
        var path, polylineOptions, polyline;
        path = this.readPath(polylineData);
        polylineOptions = {
            path: path,
            editable: false,
            strokeColor: polylineData.color,
            map: this.model.map
        };
        polyline = new google.maps.Polyline(polylineOptions);
        path.forEach((function(el) {
            this.latLngBounds.extend(new google.maps.LatLng(el.G, el.K));
        }).bind(this));
        return polyline;
    },
    readPolygon: function(polygonData) {
        var paths, polygonOptions, polygon;
        paths = new google.maps.MVCArray();
        polygonData.paths.forEach((function(path) {
            paths.push(this.readPath(path));
        }).bind(this));
        polygonOptions = {
            strokeWeight: 0,
            paths: paths,
            editable: false,
            fillColor: polygonData.color,
            fillOpacity: 0.5,
            map: this.model.map
        };
        polygon = new google.maps.Polygon(polygonOptions);
        polygon.getPath().forEach((function(el) {
            this.latLngBounds.extend(el);
        }).bind(this));
        return polygon;
    },
    readPath: function(pathData) {
        var path = new google.maps.MVCArray();
        pathData.path.forEach((function(el) {
            path.push(new google.maps.LatLng(el.lat, el.lon));
        }).bind(this));
        return path;
    }
});
module.exports = MapView;