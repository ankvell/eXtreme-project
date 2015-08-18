var Backbone = require('backbone'),
    Article = require('../models/Article');

var ArticleCollection = Backbone.Collection.extend({
    model: Article,
    byType: function(type) {
        var filtered = this.filter(function(article) {
            return article.get('type') === type;
        });
        return new ArticleCollection(filtered);
    }
});
module.exports = ArticleCollection;