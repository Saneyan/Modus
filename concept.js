/**
 * This script includes a part of the Modus concept that uses ECMAScript's
 * module system as a reference. These specifications will be subject to change
 * while Modus is under development.
 * 
 * global Modus, window, Math
 * 
 * @version   0.0.2
 * @author    Saneyuki Tadokoro <post@saneyuki.gfunction.com>
 * @preserve  Copyright 2012 Saneyuki Tadokoro
*/

// Configuring module paths and setting Modus modules.
Modus.configure({
  paths: {
    stdlib: 'http://www.example.com/js/lib/stdlib.js'
  },
  modules: {
    window: window,
    Math: Math
  }
});


// Defining a module named 'concept'. The module method analyzes whether or not
// a callback uses imports method. If it uses, Modus readies necessary modules
// before calling the callback. On the basis of path's configuration, Modus may
// load necessary scripts asynchronously in the preparations. After the
// preparations, the module method calls the callback with assigning a namespace
// object.
Modus.module('concept', function (concept) {
  
  "use strict";
  
  var timer;
  
  // Binding a module's exports to object's property.
  concept.imports('Timer', 'out').from('stdlib');
  //$.import( 'Timer', 'out' ).from( 'http://www.example.com/js/lib/stdlib.js');
  
  
  // The 'Timer' constructor and 'out' method have been bound to the namespace
  // object.
  timer = new concept.Timer(function () {
    concept.out('Timeout!');
  });
  
  // After 2000ms, this timer outputs a text message "Timeout!"
  timer.start(2000);
  
  
  // Defining and binding a module named 'model'. After defining a module, it
  // can be used instantly.
  concept.module('model', function (model) {
    
    // Nested module definition.
    model.module('action', function (action) {
      // Binding and renaming one of module's exports.
      action.imports({ XMLHTTPRequest: 'XHR' }).from('window');
      // Exporting a method named 'send' to action module.
      action.exports('send', function () {
        
        var xhr = new action.XHR();
        
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              concept.out('Success :)');
            } else {
              concept.out('An error occured :(');
            }
          }
        };
        
        xhr.open('GET', 'test.php');
        xhr.send(null);
      });
    });
    
  });
  
  
  concept.module('utility', function (utility) {
    
    // Re-exporting another exports using wildcard.
    utility.exports('*').from('Math');
    // Re-exporting and renaming one of module's exports.
    utility.exports({ setInterval: 'interval' }).from('window');
    utility.exports({ clearInterval: 'clear' }).from('window');
    
  });
  
  
  concept.module('random', function (random) {
    
    // Binding an external module to object's property.
    random.imports('utility').as('util');
    // Exporting a single dynamic value.
    random.exports = function (count, delay) {
      
      var id = random.util.interval(function () {
          
        var number = random.util.random() * 1000;  
        concept.out(number);
        
        count--;
        if (count <= 0) {
          random.util.clear(id);
        }
        
      }, delay);
      
    };
    
  });
  
  
  concept.exports('start', function () {
    
    // Binding one of the nested module's exports.
    concept.imports('send').from('model/action');
    concept.imports('random').as('random');
    
    concept.send(); // It should output "Success :)" or "An error occured :("
    concept.random(3, 1000); // x ~ xxx (Random numbers, three times)
    
  });

});


// The namespace method provies a namespace object for a callback. This behavior
// is similar to the module method but not define a module.
Modus.namespace(function (ns) {
  
  "use strict";
  
  ns.imports('start').from('concept');
  ns.start();
  
  // Even if the namespace method cannot define method, the export and module
  // method is available.
  ns.exports('A', function () { /*...*/ });
  ns.module('B', function () { /*...*/ });
  
});