var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone');

var PanelInfoView = Backbone.View.extend({
    tagName: 'form',
    id: 'tracksInfo',
    template: _.template($('.trackInfoPanel').html()),
    events: {
        'click #complexity': 'setComplexity',
    },

    initialize: function() {
        this.render();
    },
    render: function() {
        this.$el.html(this.template);
    },
    setComplexity: function() {

    }
});

module.exports = PanelInfoView;