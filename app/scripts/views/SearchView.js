var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone');

var SearchView = Backbone.View.extend({
    el: $('.search'),
    events: {
        'keyup #search_field': _.throttle(function(e){
            if (e.currentTarget.value && e.keyCode == 13){
                App.eventAggregator.trigger('search:results', e.currentTarget.value);
            }
        }, 200)
    }
});
module.exports = SearchView;