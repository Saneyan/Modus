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
  
  
  var ns = new Modus.Namespace();
  
  ns.imports('random', 'timer').from('test')
    .imports({ random: 'r', timer: 't' }).from('test')
    .imports('log').as('out');
  
  ns.timer(3000);
  ns.t(3000);
  ns.out(ns.random());
  ns.out(ns.r());
  
  
  Modus.namespace(function ( ns ) {
    
    ns.imports('log').as('out');
    ns.imports('random', 'timer').from('test');
    ns.timer(1000);
    ns.out(ns.random());
    
  });
    
}());