var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone');

var SearchView = Backbone.View.extend({
    el: $('.search'),
    events: {
        'click .search_cont': 'togleSearch',
        'keyup #search_field': _.throttle(function(e) {
            if (e.currentTarget.value && e.keyCode == 13) {
                App.eventAggregator.trigger('search:results', e.currentTarget.value);
            }
        }, 200)
    },
    togleSearch: function() {
        var toggleWidth = $("#search_field").width() == 0 ? "300px" : "0px";
        $("#search_field").focus();
        $('#search_field').animate({
            width: toggleWidth
        });
    }
});
module.exports = SearchView;