var $ = require('jquery'),
    Backbone = require('backbone'),
    template = require('./templates/articleListTemplate.html');

var ArticleInListView = Backbone.View.extend({
    template: template,
    events: {
        'click': function() {
            App.eventAggregator.trigger('article:selected', this.model.attributes.title);
        }
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        if (this.model.attributes.map) {
            this.$el.find('.article-container').append($('<img class="google-icon"/>').attr({
                src: '../images/Google_Maps_Icon.png',
                width: '30px',
                height: '30px'
            }));
        }
        return this;
    }
});
module.exports = ArticleInListView;