"use strict";

Modus.modules.log = function( message ){
  window.console.log( message );
};  


void function( $ ){
  
  $.import( 'log' ).as( 'out' );
  $.out( 'Hello, world' );
  
}( new Modus.Namespace() );