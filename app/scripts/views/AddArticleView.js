var $ = require('jquery'),
    _ = require('underscore'),
    Article = require('../models/Article'),
    Backbone = require('backbone');

AddArticleView = Backbone.View.extend({
    el: $('.east_side'),
    events: {
        'click #submit': 'saveArticle'
    },
    initialize: function(){
        this.render();
    },
    render: function(){
        this.$el.empty();
        var tmpl = _.template($('.admin').html());
        this.$el.html(tmpl({}));
        CKEDITOR.replace('description');
    },
    saveArticle: function(e){
        e.preventDefault();
        var id = this.generateId();
        var title = $('#caption').val();
        var route = $('#route_description').val();
        var description = CKEDITOR.instances['description'].getData();
        var article = new Article({
            title: title,
            route: route,
            description: description
        });
        this.collection.create(article);
        article.save();
        App.eventAggregator.trigger('show:list');
    },
    generateId: function(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
});
module.exports = AddArticleView;