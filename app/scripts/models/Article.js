var Backbone = require('backbone');

var Article = Backbone.Model.extend({
    defaults: {
        title: '',
        route: '',
        description: '',
        map: '',
        shapes: '',
        rockImgUrl: '',
        tracks: '',
        difficulty: '',
        duration: '',
        creationDate: '',
        type: 'news'
    }
});
module.exports = Article;