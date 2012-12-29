/*global window, Modus*/

(function () {

  "use strict";
  
  Modus.modules.log = function (message) {
    window.console.log(message);
  };  
  
  var $ = new Modus.Namespace();
  
  $.import('log').as('out');
  $.out('Hello, world');
    
}());