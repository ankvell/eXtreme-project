var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('Backbone');

var ArticleListView = Backbone.View.extend({
    render: function(){
        var tmpl = _.template($('.article-list-template').html());
        this.$el.html(tmpl(this.model.toJSON()));
        if (this.model.attributes.mapData){
            this.$el.find('.article-container').append($('<img/>').attr({
                src: "http://sinomobi.ru/packages/img/thumbnails/1437595775-googleMaps_transito.jpg",
                width: "200px",
                height: "100px"
            }));
        }
        return this;
    }
});
module.exports = ArticleListView;