var Backbone = require('backbone');

var Article = Backbone.Model.extend({
    defaults: {
        title: '',
        route: '',
        description: '',
        date: '',
        map: '',
        difficulty: '',
        duration: '',
        creationDate: ''
    }
});
module.exports = Article;