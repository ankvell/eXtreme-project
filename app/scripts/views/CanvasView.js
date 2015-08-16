var $ = require('jquery'),
    Backbone = require('backbone');

var CanvasView = Backbone.View.extend({
    el: '.itinerary_rock',
    template: '<canvas class="rocks"></canvas>',

    initialize: function() {
        this.render();
        this.tracksComplement();
    },
    render: function() {
        this.$el.append(this.template);

        var canvas = this.$el.find(".rocks")[0],
            context = canvas.getContext('2d'),
            imageObj = new Image(),
            allCoords = this.model.attributes.tracks;

        imageObj.src = this.model.attributes.imgUrl;
        imageObj.addEventListener('load', (function() {
            canvas.width = 800;
            canvas.height = 540;
            context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

            allCoords.forEach(function(el) {
                var paths = el.track;
                this.drawColor = el.trackColor;
                paths.forEach(function(elem) {
                    context.beginPath();
                    context.fillStyle = this.drawColor;
                    context.arc(elem.x, elem.y, 3, 0, 2 * Math.PI);
                    context.fill();
                    context.restore();
                });

                context.beginPath();
                paths.forEach(function(elem) {
                    context.strokeStyle = this.drawColor;
                    context.lineWidth = 2;
                    context.lineTo(elem.x, elem.y);
                });
                context.stroke();
                context.closePath();
            });
        }));

        return this;
    },
    tracksComplement: function() {
        var sidePanel = this.$el.find('.track_complement');
        var counter = 1;
        for (var ll = 0; ll < this.model.attributes.tracks.length; ll++) {
            var currentColor = this.model.attributes.tracks[ll].trackColor;
            sidePanel.append('<p class="color_marker" style="background-color:' + currentColor + '">' + counter + '</p>')
            sidePanel.append('<p class="complexity_hold">' + this.model.attributes.tracks[ll].complexity + '</p>');
            sidePanel.append('<p class="description_hold">' + this.model.attributes.tracks[ll].description + '</p>');
            counter++;
        }
    }
});

module.exports = CanvasView;