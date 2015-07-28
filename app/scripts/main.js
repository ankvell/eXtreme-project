var getMessage = require('./modules/message');
var date = require('./modules/date');

window.onload = function(){
  alert(date.today());
  alert(getMessage());
};
