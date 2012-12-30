/*global console, Math, setTimeout, Modus*/

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
    },
    
    random: function () {
      return Math.random() * 1000;
    }
  };
  
  
  var $ = new Modus.Namespace();
  
  $.imports('log').as('out')
   .imports('timer').from('test');
   
  $.out('Hello, world');
  $.timer(2000);
  
  
  Modus.namespace(function ( ns ) {
    
    ns.imports('log').as('out');
    ns.imports('random', 'timer').from('test');
    ns.timer(1000);
    ns.out(ns.random());
    
  });
    
}());