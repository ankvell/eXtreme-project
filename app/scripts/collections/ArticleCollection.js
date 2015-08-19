var Backbone = require('backbone'),
    Article = require('../models/Article');

var ArticleCollection = Backbone.Collection.extend({
    model: Article,
    comparator: function(article){
        var date = article.get('creationDate').split('-');
        var value = new Date(date[2], date[1], date[0]);
        return -value;
    },
    byType: function(type) {
        var filtered = this.filter(function(article) {
            return article.get('type') === type;
        });
        return new ArticleCollection(filtered);
    }
});
module.exports = ArticleCollection;