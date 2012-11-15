# collect

Collect waits for a bunch of streams to end and then calls back. Easy.

## install

```
npm install collect
```

## usage

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
