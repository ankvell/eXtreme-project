var _ = require('underscore'),
    Backbone = require('backbone');

var Filter = Backbone.Model.extend({
    defaults: {
        searchString: ''
    },
    initialize: function(options){
        this.collection = options.collection;
        this.searchString = options.searchString.toLowerCase();
        this.filtered = new Backbone.Collection(options.collection.models);
        this.filter();
    },
    filter: function(){
        var filteredArticles;
        if (this.searchString===''){
            filteredArticles = this.collection.models;
        } else{
            filteredArticles = this.collection.filter((function(article){
                return _.some(_.values(article.pick(['title', 'route', 'description'])), (function(value){
                    return (value.toLowerCase().indexOf(this.searchString)) != -1;
                }).bind(this));
            }).bind(this));
        }
        this.filtered.reset(filteredArticles);
    }
});
module.exports = Filter;