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
        imgs: [],
        creationDate: '',
        type: 'news'
    },
    validate: function(attrs){
        var errors = [];
        if (!attrs.title.length) {
            errors.push({name: 'title', message: 'Заповніть заголовок статті'});
        }
        if (!attrs.description.length){
            errors.push({name: 'description', message: 'Заповніть опис статті'});
        }
        return errors.length > 0 ? errors : false;
    }
});
module.exports = Article;