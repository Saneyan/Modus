//
// This script includes a part of the Modus concept that uses ECMAScript's
// module system as a reference. These specifications will be subject to change
// while Modus is under development.
//
// Author: Saneyuki Tadokoro <post@saneyuki.gfunction.com>
// Copyright: 2012, Saneyuki Tadokoro
//

// Configuring module paths and setting Modus modules.
Modus.configure({
    paths: {
        stdlib: 'http://www.example.com/js/lib/stdlib.js'
    }
    
  , modules: {
        window: window
      , Math: Math
    }
});


// Defining a module named 'concept'. The module method analyzes whether or not
// a callback uses import method. If it uses, Modus readies necessary modules
// before calling the callback. On the basis of path's configuration, Modus may
// load necessary scripts asynchronously in the preparations. After the
// preparations, the module method calls the callback with assigning a namespace
// object.
Modus.module( 'concept', function( $ ){
  
  // Binding a module's exports to object's property.
  $.import( 'Timer', 'out' ).from( 'stdlib' );
  //$.import( 'Timer', 'out' ).from( 'http://www.example.com/js/lib/stdlib.js');
  
  
  // The 'Timer' constructor and 'out' method have been bound to the namespace
  // object.
  var timer = new $.Timer( function(){
    $.out( 'Timeout!' );
  });
  
  // After 2000ms, this timer outputs a text message "Timeout!"
  timer.start( 2000 );
  
  
  // Defining and binding a module named 'model'. After defining a module, it
  // can be used instantly.
  $.module( 'model', function( model ){
    
    // Nested module definition.
    model.module( 'action', function( action ){
      // Binding and renaming one of module's exports.
      action.import({ XMLHTTPRequest: 'XHR' }).from( 'window' );
      // Exporting a method named 'send' to action module.
      action.export( 'send', function(){
        
        var xhr = new $$.XHR();
        
        xhr.onreadystatechange = function(){
          if( xhr.readyState === 4 ){
            if( xhr.status === 200 )
              $.out( 'Success :)' );
            else
              $.out( 'An error occured :(' );
          }
        };
        
        xhr.open( 'GET', 'test.php' );
        xhr.send( null );
      });
    });
    
  });
  
  
  $.module( 'utility', function( $$ ){
    
    // Re-exporting another exports using wildcard.
    $$.export( '*' ).from( 'Math' );
    // Re-exporting one of the module's exports.
    $$.export( 'document' ).from( 'window' );
    
  });
  
  
  $.module( 'random', function( $$ ){
    
    // Binding an external module to object's property.
    $$.import( 'utility' ).as( 'util' );
    // Exporting a single dynamic value.
    $$.export = function(){
      var number = $$.util.random() * 1000;  
      $$.util.getElementById( 'result' ).innerHTML = number;
    };
    
  });
  
  
  $.export( 'start', function(){
    
    // Binding one of the nested module's exports.
    $.import( 'send' ).from( 'model/action' );
    $.import( 'random' ).as( 'random' );
    
    $.send(); // It should output "Success :)" or "An error occured :("
    $.random(); // xxxx (Four-digit number)
    
  });

});


// The namespace method provies a namespace object for a callback. This behavior
// is similar to the module method but not define a module.
Modus.namespace( function( $ ){
  
  $.import( 'start' ).from( 'concept' );
  $.start();
  
  // Even if the namespace method cannot define method, the export and module
  // method is available.
  $.export( 'A', function(){ /*...*/ });
  $.module( 'B', function(){ /*...*/ });
  
})