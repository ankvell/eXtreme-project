var $ = require('jquery'),
    Backbone = require('backbone'),
    template = require('./templates/mainAdminTemplate.html');

var AdminEditArticleView = Backbone.View.extend({
    tagName: 'tr',
    className: 'row',
    template: template,
    initialize: function() {
        for (var key in localStorage) {
            if (key !== 'articleData' && localStorage.getItem(key)) {
                var obj = JSON.parse(localStorage.getItem(key));
                if (obj.id === this.model.attributes.id) {
                    this.keyInDb = key;
                }
            }
        }
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
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
    editArticle: function() {
        App.eventAggregator.trigger('edit:article', this.model.attributes.id);
    }
});
module.exports = AdminEditArticleView;