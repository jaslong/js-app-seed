const build = require('./build');
const fs = require('fs');

let lastResult = null;

function watch() {
  console.log('watch: Building...');
  fs.watch('main', {recursive: true}, listener);
  build().then((result) => {
    console.log('watch: Building success.')
    lastResult = result;
  }).catch((reason) => {
    console.log('watch: Building failure: ' + reason);
  });
}

function listener(eventType, filename) {
  console.log(`watch: Rebuilding because a ${eventType} occured on ${filename}...`);
  build(lastResult).then(() => {
    console.log('watch: Rebuilding success.')
  }).catch((reason) => {
    console.log('watch: Rebuilding failure: ' + reason);
  });
}

watch();
