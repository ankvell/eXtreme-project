var Backbone = require('backbone');

var RockPath = Backbone.Model.extend({
    defaults: {
        track: [],
        complexity: '',
        description: ''
    }
});
module.exports = RockPath;