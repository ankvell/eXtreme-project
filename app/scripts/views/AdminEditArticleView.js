var $ = require('jquery'),
    Backbone = require('backbone'),
    api = require('../configs/api')
    template = require('./templates/mainAdminTemplate.html');

var AdminEditArticleView = Backbone.View.extend({
    tagName: 'tr',
    className: 'row',
    template: template,
    initialize: function() {
        api.eachArticle((function(key){
            var obj = JSON.parse(api.getArticle(key));
            if (obj.id === this.model.attributes.id) {
                this.keyInDb = key;
            }
        }).bind(this));
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
        api.removeArticle(this.keyInDb);
        this.model.destroy();
        this.remove();
    },
    editArticle: function() {
        App.eventAggregator.trigger('edit:article', this.model.attributes.id);
    }
});
module.exports = AdminEditArticleView;