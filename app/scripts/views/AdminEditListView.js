var $ = require('jquery'),
    Backbone = require('backbone'),
    AdminEditArticleView = require('./AdminEditArticleView');

var AdminEditListView = Backbone.View.extend({
    initialize: function(){
        this.listenTo(this.collection, 'add', this.renderContact);
        this.listenTo(this.collection, 'change', this.render);
        this.render();
    },
    render: function(){
        $('#articles_table').empty();
        this.collection.forEach(function(article){
            this.renderArticle(article);
        }, this);
        return this;
    },
    renderArticle: function(article){
        var adminEditArticleView = new AdminEditArticleView({
            model: article
        });
        $('.east_side').append(adminEditArticleView.render().el);
    }
});
module.exports = AdminEditListView;