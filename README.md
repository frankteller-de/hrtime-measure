# hrtime-measure [![NPM version](https://badge.fury.io/js/hrtime-measure.svg)](http://badge.fury.io/js/hrtime-measure)

[![NPM](https://nodei.co/npm/hrtime-measure.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/hrtime-measure/)

This module measures the execution time of javascript operations.

## Example
This example starts the measurement in the app.js file.

```javascript
const measure = require('hrtime-measure');

// start measurement
measure.start('AnyName');
```

And continues the measurement in the middleware.js file.

```javascript
const measure = require('hrtime-measure');

// set the steps by measure name and step title.
measure.step('AnyName', 'app.js:http_io');
measure.step('AnyName', 'app.js:middleware()');
measure.step('AnyName', 'middleware.js:initNumeral');

// stop measurement measure name.
measure.end('AnyName', 'middleware.js:end', true);
```

### Console Output  

```bash
Total execution time "AnyName": ~ 0s 83.52 ms
1. 0s 0.09 ms		app.js:http_io
2. 0s 13.13 ms		app.js:middleware()
3. 0s 70.11 ms		middleware.js:initNumeral
4. 0s 0.19 ms		middleware.js:return
```

## Install
```bash
npm install hrtime-measure --save
```

## API

### start(label)
Start the measurement and give the name for the new timer. This will identify the timer; use the same name when calling measure.end() to stop the timer.

### step(label,[title])
Step set a timesplit by `label` with any optional `title`.

### end(label,[title],[print])
Stop the measurement and return the ouput as a string. If the optional parameter `print` is set to true, the time will output to the console.

### disable()
With this function, the measurement can be turned off in production.
