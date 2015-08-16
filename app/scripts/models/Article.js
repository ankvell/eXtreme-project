var Backbone = require('backbone');

var Article = Backbone.Model.extend({
    defaults: {
        title: '',
        route: '',
        description: '',
        date: '',
        map: '',
        shapes: '',
        difficulty: '',
        duration: '',
        creationDate: '',
        type: 'news'
    }
});
module.exports = Article;