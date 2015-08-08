var connector = require('./localStorageConnector');
connector.populateTestData();

module.exports = {
    getArticles: function(next) {
      connector.getArticles(next);
    },
    getArticle: function(id, next) {
      connector.getArticle(id, next);
    },
    addArticle: function(article) {
      connector.addArticle(article);
    }
};
