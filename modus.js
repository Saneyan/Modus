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
  
  
  function _bind(toBind, thisObject /* [, args... ] */){
    var arg, Nop, bound;
    
    if (Function.prototype.bind) {
      arg = [].slice.call(arguments, 1);
      
      return Function.prototype.bind.apply(toBind, arg);
      
    } else { // Using compatible bind method from MDN
      arg = [].slice.call(arguments, 2);
      
      Nop = function () {};
      
      bound = function () {
        var thisArg, args;
        
        thisArg = this instanceof Nop && thisObject ? this : thisObject;
        args = arg.concat([].slice.call(arguments));
        
        return toBind.apply(thisArg, args);
      };
      
      Nop.prototype = toBind.prototype;
      bound.prototype = new Nop();
      
      return bound;
    }
  }
  
  
  function _clone(object) {
    var i, clone;
    
    if (object instanceof Array) {
      clone = [];
      
      for(i = 0; object[i]; i++){
        clone[i] = object[i];
      }
    }
    
    return clone;
  }
  
  
  function _isMatch(obj1, obj2) {
    if(!obj1 || !obj2)
      return;
      
    if (obj1.constructor === obj2) {
      return true;
    } else {
      return false;
    }
  }
  
  
  var _overload = {
    
    def: function () {
      var temp,
          args = [].slice.call(arguments),
          method = args.pop();
          
      if(typeof method !== 'function' || args.length <= 0){
        return this;
      }
      
      temp = this._temp || (this._temp = []);
      temp.push({ types: args, method: method });
      
      return this;
    },
    
    
    end: function () {
      var clone = _clone(this._temp);
      
      delete this._temp;
      
      return function () {
        var i, j, match, candidate, type, types, method, ptr, nptr, object;
        
        for (i = 0; clone[i]; i++) {
          candidate = clone[i];
          types = candidate.types;
          method = candidate.method;
          ptr = nptr = 0;
          
          while (ptr < arguments.length) {
            type = types[nptr];
            
            if (type instanceof Array) {
              for (j = 0; type[j]; j++) {
                object = arguments[ptr++];
                
                if (!_isMatch(object, type[j])) {
                  match = false;
                  break;
                }
              }
              
              nptr++;
              
            } else {
              object = arguments[ptr++];
              
              if (!_isMatch(object, type)) {
                match = false;
              }
            }
            
            if (match === false) {
              break;
            }
          }
          
          if (match !== false) {
            return method.apply(this, arguments);
          } else {
            match = undefined;
          }
        }
      };
    }
  };
  

  Namespace = Modus.Namespace = function () {};

  Namespace.prototype = {
    
    as: function (name, rename) {
      var module = modules[name]
      
      if (module) {
        this[rename] = module;
      }
      
      return this;
    },
    
    
    from: function (hash, moduleName) {
      var key, module = modules[moduleName];
      
      if (module) {
        for (key in hash) {
          this[hash[key]] = module[key];
        }
      }
      
      
      return this;
    },
    
    
    imports: _overload.
    
      def([Object], function (hash) {
        return {
          from: _bind(this.from, this, hash)
        };    
      }).
      
      
      def(String, function () {
        var i, selector, hash = {};
        
        for (i = 0; arguments[i]; i++) {
          selector = arguments[i];
          hash[selector] = selector;
        }
        
        return {
          as:   _bind(this.as, this, arguments[0]),
          from: _bind(this.from, this, hash)
        };    
      }).
      
    end(),
    
    
    _exports: _overload.
    
      def([String], function () {
      }).
      
      
      def(String, function () {
      }).
      
      
      def([Object], function () {
      }).
      
      
      def([String, Function], function () {
      }).
      
    end(),
    
    
    __exports__: {}
  };
  
  
  Namespace.prototype.__defineSetter__('exports', function (value) {
    this.__exports__ = this._exports = value;
  });
  
  
  Namespace.prototype.__defineGetter__('exports', function (value) {
    return this._exports;
  });
  
  
  Modus.namespace = function (factory) {
    var ns = new Namespace();
    factory(ns);
  };
  
}());