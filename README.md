# hrtime-measure
This module measures the execution time of javascript operations.

## Example
This example starts the measurement in the app.js file.

```javascript
var measure = require('hrtime-measure');

// start measurement
measure.start('init');

// set the first steps
measure.step('init', 'app.js:http_io');
measure.step('init', 'app.js:middleware()');
```

And continues the measurement in the middleware.

```javascript
var measure = require('hrtime-measure');

// next steps in the middleware
measure.step('init', 'middleware.js:initNumeral');

// stop measurement
measure.end('init', 'middleware.js:end', true);
```

### Console Output

```bash
Total execution time "init": ~ 0s 83.52 ms
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
