
module.exports = function waiter() {
  var args = [].slice.call(arguments);
  var cb = args.pop();
  var results = {};
  var flags = {};

  args.forEach(function(flagName) {
    flags[flagName] = false;
  });

  var hasCallbackBackWithError = false;

  var collect = function() {
    var hasTriggered = true;
    args.forEach(function(flagName) {
      hasTriggered = hasTriggered && flags[flagName];
    });

    if (hasTriggered) {
      cb(null, results);
    }
  };

  var createCallback = function(flagName) {
    return function(err) {
      if (hasCallbackBackWithError) return;
      else if (err) return hasCallbackBackWithError = true, cb(err);
      
      var args = [].slice.call(arguments, 1);

      flags[flagName] = true;
      results[flagName] = args.length == 1 ? args[0] : args;

      collect();
    };
  };

  return createCallback;
};
