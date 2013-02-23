# collect

Collect waits for a bunch of [streams](#collect) to end and then calls back, 
like some kind of magical stream catcher. You can also [await](#await) a 
bunch of functions to call back.

<img src="http://i.imgur.com/gZjQ1.jpg" height="200"/>

## install

```
npm install collect
```

## modules

* [collect](#collect) — `require('collect')` wait for a bunch of streams to 
  finish 
* [awaiter](#await) — `require('collect').awaiter` waiter for a bunch of 
  functions to call back

<a name="collect"/>
## usage - collect (streams)

```javascript
var fs = require('fs');
var potatoStream = fs.createWriteStream('potato.txt');
var carrotStream = fs.createWriteStream('carrot.txt');
var bananaStream = fs.createWriteStream('banana.txt');

var collect = require('collect');

collect([potatoStream, carrotStream, bananaStream], function() {
  // All streams have finished writing! yay!
});
```

or alternatively with a staggered syntax so you can add streams over time and
collect them whenever you want:

```javascript
var fs = require('fs');
var potatoStream = fs.createWriteStream('potato.txt');
var carrotStream = fs.createWriteStream('carrot.txt');
var bananaStream = fs.createWriteStream('banana.txt');

var collection = require('collect').collection;

var magicalStreamCatcher = collection();

magicalStreamCatcher.push(potatoStream);

process.nextTick(function() {
  // later on
  magicalStreamCatcher.push(carrotStream);
  magicalStreamCatcher.push(bananaStream);

  magicalStreamCatcher.collect(function() {
    // called when all the streams have closed
  });
});
```

<a name="await"/>
## usage - awaiter (callbacks)

*Stuff you need to know*: `results` is an object containing the returned
value(s) from the callback. If the callback returned nothing, the value will be
an empty array. If one of the callback returns an error, the await callback is
called immediately, without the results, and only once. This is in line with 
how [async](http://www.github.com/caolan/async) works. 

```javascript
var await = awaiter('data', 'stuff', function(err, results) {
  assert(results.data == 'potato');
  assert(results.stuff[0] == 'cabbage');
});

longRunningFunction(await('data')); //await('data') returns a callback for you to pass
otherLongRunningFunctionThatReturnsMoreThanOneArg(await('stuff'));
```

alternatively there's a more staggered syntax that can make sense if you want
your callback to be below the function calls, by using `await.then`. like this:

```javascript
var await = awaiter('data', 'stuff');

longRunningFunction(await('data')); 
otherLongRunningFunctionThatReturnsMoreThanOneArg(await('stuff'));

await.then(function(err, results) {
  assert(results.data == 'potato');
  assert(results.stuff[0] == 'cabbage');
});
```
