var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone');

var SearchView = Backbone.View.extend({
    el: $('.search'),
    initialize: function() {
        _.bindAll(this, 'search');
        $('.search_cont').on('click', this.search, this.toggteSearch);
        $('#search_field').on('keyup', _.throttle(function(e) {
            if (e.currentTarget.value && e.keyCode == 13) {
                App.eventAggregator.trigger('search:results', e.currentTarget.value);
            }
        }, 200));
    },
    search: function() {
        if ($('#search_field').val()) {
            App.eventAggregator.trigger('search:results', $('#search_field').val());
        }
    },
    toggteSearch: function() {
        $('#search_field').toggleClass('active');
    }
});
module.exports = SearchView;