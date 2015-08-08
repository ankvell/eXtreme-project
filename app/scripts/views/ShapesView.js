var $ = require('jquery'),
    Backbone = require('backbone');

var ShapesView = Backbone.View.extend({
    initialize: function(){
        var json = this.model.attributes;
        //var json = JSON.parse(localStorage.getItem('shapesData'));
        //this.model.map.setCenter(new google.maps.LatLng(json.map.lat, json.map.lon));
        this.model.map = new google.maps.Map(document.getElementsByClassName('itinerary_cont')[0], this.model.map.attributes.mapOptions);
        this.jsonRead(json);
    },
    jsonRead: function(json){
        var marker, rectangle, circle, polyline, polygon;
        json.shapes.forEach((function(shape, index){
            switch (shape.type) {
            case 'marker':
                marker = this.jsonReadMarker(shape);
                break;
            case 'rectangle':
                rectangle = this.jsonReadRectangle(shape);
                break;
            case 'circle':
                circle = this.jsonReadCircle(shape);
                break;
            case 'polyline':
                polyline = this.jsonReadPolyline(shape);
                break;
            case 'polygon':
                polygon = this.jsonReadPolygon(shape);
                break;
            }
        }).bind(this));
    },
    jsonReadMarker: function(jsonMarker){
        var position, markerOptions, marker;
        position = new google.maps.LatLng(jsonMarker.position.lat, jsonMarker.position.lon);
        markerOptions = {
            position: position,
            editable: false,
            label: jsonMarker.label,
            map: this.model.map
        };
        marker = new google.maps.Marker(markerOptions);
        return marker;
    },
    jsonReadRectangle: function(jsonRectangle){
        var southWest, northEast, bounds, rectangleOptions;
        southWest = new google.maps.LatLng(jsonRectangle.bounds.southWest.lat, jsonRectangle.bounds.southWest.lon);
        northEast = new google.maps.LatLng(jsonRectangle.bounds.northEast.lat, jsonRectangle.bounds.northEast.lon);
        bounds = new google.maps.LatLngBounds(southWest, northEast);
        rectangleOptions = {
            strokeWeight: 0,
            bounds: bounds,
            editable: false,
            fillColor: jsonRectangle.color,
            fillOpacity: 0.5,
            map: this.model.map
        };
        rectangle = new google.maps.Rectangle(rectangleOptions);
        return rectangle;
    },
    jsonReadCircle: function(jsonCircle){
        var center, circleOptions, circle;
        center = new google.maps.LatLng(jsonCircle.center.lat, jsonCircle.center.lon);
        circleOptions = {
            strokeWeight: 0,
            center: center,
            radius: parseFloat(jsonCircle.radius),
            editable: false,
            fillColor: jsonCircle.color,
            fillOpacity: 0.5,
            map: this.model.map
        };
        circle = new google.maps.Circle(circleOptions);
        return circle;
    },
    jsonReadPolyline: function(jsonPolyline){
        var path, polylineOptions, polyline;
        path = this.jsonReadPath(jsonPolyline);
        polylineOptions = {
            path: path,
            editable: false,
            strokeColor: jsonPolyline.color,
            map: this.model.map
        };
        polyline = new google.maps.Polyline(polylineOptions);
        return polyline;
    },
    jsonReadPolygon: function(jsonPolygon){
        var paths, polygonOptions, polygon;
        paths = new google.maps.MVCArray();
        jsonPolygon.paths.forEach((function(path){
            paths.push(this.jsonReadPath(path));
        }).bind(this));
        polygonOptions = {
            strokeWeight: 0,
            paths: paths,
            editable: false,
            fillColor: jsonPolygon.color,
            fillOpacity: 0.5,
            map: this.model.map
        };
        polygon = new google.maps.Polygon(polygonOptions);
        return polygon;
    },
    jsonReadPath: function(jsonPath){
        var path = new google.maps.MVCArray();
        jsonPath.path.forEach(function(el){
            path.push(new google.maps.LatLng(el.lat, el.lon));
        });
        return path;
    }
});
module.exports = ShapesView;