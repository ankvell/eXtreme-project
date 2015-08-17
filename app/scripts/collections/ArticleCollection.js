var Backbone = require('backbone'),
    Article = require('../models/Article');

Backbone.LocalStorage = require('backbone.localstorage');

var ArticleCollection = Backbone.Collection.extend({
    model: Article,
    byType: function(type) {
        var filtered = this.filter(function(article) {
            return article.get('type') === type;
        });
        return new ArticleCollection(filtered);
    },
    localStorage: new Backbone.LocalStorage('articleData')
});
module.exports = ArticleCollection;