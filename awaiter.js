function awaiter() {
  var args = [].slice.call(arguments);
  var cb = args.pop();
  if (typeof cb != 'function') args.push(cb), cb = function(){};
  var results = {};
  var flags = {};

  args.forEach(function(flagName) {
    flags[flagName] = false;
  });

  var hasCalledBackWithError = false;

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
      if (hasCalledBackWithError) return;
      else if (err) return hasCalledBackWithError = true, cb(err);
      
      var args = [].slice.call(arguments, 1);

      flags[flagName] = true;
      results[flagName] = args.length == 1 ? args[0] : args;

      collect();
    };
  };

  createCallback.then = function(newCb) { cb = newCb; };

  return createCallback;
};

awaiter.num = function(count, cb) {
  var nums = [], i = 0;
  while (++i <= count) nums.push(i);

  nums.push(function(err, res) {
    if (err) cb && cb(err);
    var i = 0;
    var resArr = [];
    while (++i <= count) resArr.push(res[i]);
    cb(null, resArr);
  });
  var awaiterInst = awaiter.apply(this, nums);

  i = 0;
  var createNumberedCallback = function() {
    return awaiterInst(++i);
  };

  createNumberedCallback.then = function(newCb) { cb = newCb };

  return createNumberedCallback;
};

module.exports = awaiter;
