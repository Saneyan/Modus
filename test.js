/*global console, setTimeout, Modus*/

(function () {

  "use strict";
  
  Modus.modules.log = function (message) {
    console.log(message);
  };  
  
  
  Modus.modules.test = {
    timer: function (delay) {
      setTimeout(function () {
        console.log('Timeout!');
      }, delay);
    }
  };
  
  
  var $ = new Modus.Namespace();
  
  $.imports('log').as('out')
   .imports('timer').from('test');
   
  $.out('Hello, world');
  $.timer(2000);
    
}());