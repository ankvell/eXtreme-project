var $ = require('jquery'),
    Backbone = require('backbone');

var RenderCanvasView = Backbone.View.extend({
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

            // draw point
            for (var jj = 0; jj < allCoords.length; jj++) {
                var toPoints = allCoords[jj].track;
                var pointColor = allCoords[jj].trackColor;
                for (var yy = 0; yy < toPoints.length; yy++) {
                    context.beginPath();
                    context.fillStyle = pointColor;
                    context.arc(toPoints[yy].x, toPoints[yy].y, 3, 0, 2 * Math.PI);
                    context.fill();
                    context.restore();
                }
            }
            // draw paths
            for (var ii = 0; ii < allCoords.length; ii++) {
                var toPaths = allCoords[ii].track;
                var lineColor = allCoords[ii].trackColor;
                context.beginPath();
                for (var kk = 0; kk < toPaths.length; kk++) {
                    context.strokeStyle = lineColor;
                    context.lineWidth = 2;
                    context.lineTo(toPaths[kk].x, toPaths[kk].y);
                }
                context.stroke();
                context.closePath();
            }
        }).bind(this));
        // canvas.width =  200 + 'px';//parseInt(imageObj.width); //imageObj.width;
        // canvas.height = 200 + 'px'; //parseInt(imageObj.height); //imageObj.height;
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

module.exports = RenderCanvasView;