# collect

Collect waits for a bunch of streams to end and then calls back. Easy.

## install

```
npm install collect
```

## usage

```javascript
var fs = require('fs');
var Collection = require('collect');

var potatoStream = fs.createWriteStream('potato.txt');
var carrotStream = fs.createWriteStream('carrot.txt');
var bananaStream = fs.createWriteStream('banana.txt');

var collection = Collection([potatoStream, carrotStream]);
collection.push(bananaStream);

collection.collect(function() {
  // All streams have finished writing! yay!
});
```
