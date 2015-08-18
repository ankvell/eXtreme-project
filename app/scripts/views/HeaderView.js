var $ = require('jquery'),
      _ = require('underscore'),
      Backbone = require('backbone');

var HeaderView = Backbone.View.extend({
  el: '.header_cont',

  events: {
    'click': 'toggleSidebar'
  },
  toggleSidebar: function() {
    $('body').toggleClass('toggle_sidebar');
  }
});

module.exports = HeaderView;