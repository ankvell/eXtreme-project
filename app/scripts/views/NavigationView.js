var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    template = require('./templates/navigationTemplate.html');


var NavigationView = Backbone.View.extend({
    el: '.backside',
    template: template,
    initialize: function() {
      this.render();
    },
    render: function() {
      this.$el.append(this.template());
    }
});

module.exports = NavigationView;