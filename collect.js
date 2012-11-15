var async = require('async');

module.exports = function collection() {
  var collection = [];
  return {
    push: collection.push.bind(collection),
    collection: collection,
    collect: function(cb) {
      async.parallel(collection.map(function(stream) {
        var waiter = false;

        var finished = function() {
          if (typeof waiter == 'function') waiter();
          else waiter = true;
        };

        stream.on('close', finished);
        stream.on('end', finished);

        var cb = function(cb) { 
          if (waiter === true) cb();
          else waiter = cb;
        };

        return cb;
      }), cb);
    }
  }
};
