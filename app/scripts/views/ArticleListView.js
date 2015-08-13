var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone');

var ArticleListView = Backbone.View.extend({
    events: {
        'click': function(){
            App.eventAggregator.trigger('article:selected', this.model);
        }
    },
    render: function(){
        var tmpl = _.template($('.article-list-template').html());
        this.$el.html(tmpl(this.model.attributes));
        if (this.model.attributes.map){
            this.$el.find('.article-container').append($('<img/>').attr({
                src: 'http://sinomobi.ru/packages/img/thumbnails/1437595775-googleMaps_transito.jpg',
                width: '200px',
                height: '100px'
            }));
        }
        return this;
    }
});
module.exports = ArticleListView;