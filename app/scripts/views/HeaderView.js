var $ = require('jquery'),
    Backbone = require('backbone');

var HeaderView = Backbone.View.extend({
  el: '.header_cont',

  events: {
    'click': 'toggleSidebar',
    // 'blur .header_cont': 'toggleSidebar'
  },
  initialize: function() {
    // $(document).click(function(e){
    //     var noactive = $('.user_sidebar');
    //     if(!$('body').hasClass('toggle_sidebar')) {
    //         if(!$(e.target).closest('.user_sidebar')) {
    //            $('body').removeClass('toggle_sidebar');
    //            return false;
    //             alert('pizdets');
    //         }
    //     }
    // });
  },
  toggleSidebar: function() {
    $('body').toggleClass('toggle_sidebar');
  }
});
module.exports = HeaderView;