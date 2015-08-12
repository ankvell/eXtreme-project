var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    AdminEditView = require('./AdminEditView');

var AdminEditArticleView = Backbone.View.extend({
    tagName: 'tr',
    initialize: function() {
        for (var key in localStorage) {
            if (key !== 'articleData' && key != 'shapesData' && key != 'tracks') {
                var obj = JSON.parse(localStorage.getItem(key));
                if (obj.id === this.model.attributes.id) {
                    this.keyInDb = key;
                }
            }
        }
    },
    render: function() {
        var tmpl = _.template($('#editable_article').html());
        this.$el.html(tmpl(this.model.toJSON()));
        return this;
    },
    events: {
        'click .edit': 'editArticle',
        'click .delete': 'deleteArticle'
    },
    deleteArticle: function() {
        localStorage.removeItem(this.keyInDb);
        this.model.destroy();
        this.remove();
    },
    editArticle: function(){
        var adminEditView = new AdminEditView({
            model: this.model,
            keyInDb: this.keyInDb
        });
    }
});
module.exports = AdminEditArticleView;