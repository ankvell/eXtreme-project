var Backbone = require('backbone');

var Article = Backbone.Model.extend({
    defaults: {
        title: '',
        description: '',
        date: ''
    }
});
module.exports = Article;