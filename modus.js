/**
 *                      Modus version 0.0.1-pre
 * 
 * @author    Saneyuki Tadokoro <post@saneyuki.gfunction.com>
 * @copyright 2012, Saneyuki Tadokoro
*/

"use strict";

void function( global ){
  
  var Modus = global.Modus = {}; 
  var modules = Modus.modules = {};
  
  
  var Namespace = Modus.Namespace = function(){
  };
  
  
  _extend( Namespace.prototype, {
    
      import: function( object ){
        var selector = [];
        
        if( typeof object === 'object' ){
          for( var key in object )
            selector.push( key );
        }
        else{
          for( var val, i = 0; val = arguments[ i++ ]; )
            selector.push( val );
        }
        
        return _import( selector, this );
      }
  });
  
  
  function _import( selector, namespace ){
    return {
        from: function( moduleName ){
          var module;
          
          if( module = modules[ moduleName ] ){
            for( var key, i = 0; key = selector[ i++ ]; ){
              namespace[ key ] = module[ key ];
            }
          }
          
          return namespace;
        }
        
      , as: function( name ){
          var module;
          
          if( module = modules[ selector[ 0 ] ] )
            namespace[ name ] = module;
          
          return namespace;
        }
    };
  };
  
  
  function _extend( destination, source ){
    for( var key in source ){
      if( source.hasOwnProperty( key ) )
        destination[ key ] = source[ key ];
    }
    
    return destination;
  };
  
}( this );