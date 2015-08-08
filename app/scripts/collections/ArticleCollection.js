var Backbone = require('backbone'),
    Article = require('../models/Article');

Backbone.LocalStorage = require('backbone.localstorage');
var ArticleCollection = Backbone.Collection.extend({
    model: Article,
    localStorage: new Backbone.LocalStorage('articleData')
});
module.exports = ArticleCollection;