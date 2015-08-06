var Backbone = require('backbone'),
    Article = require('../models/Article');

var ArticleCollection = Backbone.Collection.extend({
    model: Article
});
module.exports = ArticleCollection;