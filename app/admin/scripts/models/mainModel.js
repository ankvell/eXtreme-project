var Backbone = require('backbone');


module.exports = Backbone.Model.extend({
    defaults: {
      routeCoords: [],
      complexity: ''
    },
    initialize: function() {
      alert('model init');
    }
});
