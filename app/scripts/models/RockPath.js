var Backbone = require('backbone');

var RockPath = Backbone.Model.extend({
    defaults: {
        track: [],
        complexity: '',
        description: '',
        trackColor: '#DE5635'
    }
});
module.exports = RockPath;