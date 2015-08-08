var Backbone = require('backbone');

var Article = Backbone.Model.extend({
    defaults: {
        title: '',
        route: '',
        description: '',
        date: '',
        map: ''
    }
});
module.exports = Article;