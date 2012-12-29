/**
 * Modus - A JavaScript Module Manager and Loader
 * 
 * global Modus
 * 
 * @version   0.0.1-pre
 * @author    Saneyuki Tadokoro <post@saneyuki.gfunction.com>
 * @preserve  Copyright 2012 Saneyuki Tadokoro
*/

var Modus = {};

(function () {
  
  "use strict";

  var modules, Namespace;
  modules = Modus.modules = {};

  
  function _extend(destination, source) {
    var key;

    for (key in source) {
      if (source.hasOwnProperty(key)) {
        destination[key] = source[key];
      }
    }

    return destination;
  }


  Namespace = Modus.Namespace = function () {};


  _extend(Namespace.prototype, {

    import: function (object) {
      var i, key, selector = [];

      if (typeof object === 'object') {
        for (key in object) {
          if (object.hasOwnProperty(key)) {
            selector.push(key);
          }
        }
      } else {
        for (i = 0; arguments[i]; i++) {
          selector.push(arguments[i]);
        }
      }
  
      return this._import(selector);
    },
  
  
    _import: function (selector) {
      var namespace = this;
  
      return {
        from: function (moduleName) {
          var i, key, module = modules[moduleName];
          
          if (module) {
            for (i = 0; selector[i]; i++) {
              key = selector[i];
              namespace[key] = module[key];
            }
          }
          
          return namespace;
        },
          
        as: function (name) {
          var module = modules[selector[0]];
          
          if (module) {
            namespace[name] = module;
          }
          
          return namespace;
        }
      };
    }
  });
  
}());