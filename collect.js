var async = require('async');

module.exports = function collection() {
  var collection = [];
  return {
    push: collection.push.bind(collection),
    collection: collection,
    collect: function(cb) {
      async.waiters(collection.map(function(stream) {
        var waiter = false;
        stream.on('end', function() {
          if (typeof waiter == 'function') waiter();
          else waiter = true;
        });
        var cb = function(cb) { 
          if (waiter === true) cb();
          else waiter = cb;
        };
      }), cb);
    };
  }
};
