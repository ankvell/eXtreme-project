var Backbone = require('backbone'),
    template = require('./templates/startPageTemplate.html');

var StartPageView = Backbone.View.extend({
    el: '.content',
    template: template,
    initialize: function() {
        this.render();
    },
    render: function() {
        this.$el.html(this.template());
    }
});
module.exports = StartPageView;