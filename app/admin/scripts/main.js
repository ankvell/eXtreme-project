var $ = require('jquery');
var Backbone = require('backbone');

var AppView = require('./views/mainView');
var AppModel = require('./models/mainModel');

$('#rock-climbing').on('click', function() {
    var app = new AppView({
      model: new AppModel()
    });
});