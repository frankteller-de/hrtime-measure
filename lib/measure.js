'use strict';

var columnify = require('columnify');

var times = {};
var groupSteps = false;
var disabled = false;

/**
 * Module exports
 */

module.exports = {
	addHrtime: function(a, b) {
	    const ms = a[1] + b[1];
	    const div = Math.floor(ms / 1e9);
	    const rem = ms % 1e9;

	    return [
	        a[0] + b[0] + div,
	        rem
	    ];
	},
    /**
     * With this function, the measurement can be turned off in production.
     */
    disable: function() {
        disabled = true;
    },
    /**
     * Start the measurement and give the name for the new timer. This will identify
     * the timer; use the same name when calling measure.end() to stop the timer.
     *
     * @param label   A string that identifies the timer
     */
    start: function(label, group) {
        if (disabled) return;

        // group the steps by title
        groupSteps = group || false;

        times[label] = {
            time: process.hrtime(),
            total: process.hrtime(),
            steps: []
        };
    },
    /**
     * Step set a timesplit by `label` with any optional `title`.
     *
     * @param label   A string that identifies the timer
     * @param title   An optional title
     */
    step: function(label, title) {
        if (disabled) return;
        title = title || '';

        if (typeof times[label] === 'undefined')
            return this.start(label);

		times[label].steps.push({
            time: process.hrtime(times[label].time),
            title: title
        });
        times[label].time = process.hrtime();
    },
    /**
     * Stop the measurement and return the ouput as a string. If the optional parameter
     * `print` is set to true, the time will output to the console.
     *
     * @param label   A string that identifies the timer
     * @param title   An optional title
     * @param print   A boolean that change the output version
     */
    end: function(label, title, print) {
        if (disabled) return;
		var self = this;
        self.step(label, title);

        title = title || '';
        print = print || false;

		if (groupSteps) {
			// create a group dummy
			times[label].grouped = {};

			// calc the groups
			times[label].steps.forEach(function(step) {
				var groups = times[label].grouped;
				if (typeof groups[step.title] === 'undefined') {
					times[label].grouped[step.title] = step.time;
				} else {
					times[label].grouped[step.title] = self.addHrtime(times[label].grouped[step.title], step.time);
				}
			});

			// reset steps
			times[label].steps = [];

			// write grouped steps
			for (var key in times[label].grouped) {
				times[label].steps.push({
					time: times[label].grouped[key],
					title: key
				});
			}
		}

        var total = process.hrtime(times[label].total);
        var title = 'Total execution time "' + label + '": ~ ' + total[0] + 's ' + this._round(total[1]) + ' ms';
		var data = [];

        for (var i = 0; i < times[label].steps.length; i++) {
            var step = times[label].steps[i];
            //out += '\n' + (i + 1) + '. ' + step.time[0] + 's ' + this._round(step.time[1]) + ' ms\t\t' + step.title;

			data.push({
				'#': (i + 1) + '.',
				'|': '|',
				's': step.time[0] + 's ',
				'time': this._round(step.time[1]) + 'ms',
				'Description': step.title
			});
        }

		var out = columnify(data, {
			columns: ['#', '|', 's', 'time', 'Description'],
		    config: {
		        '#': {
		            align: 'center'
		        },
		        's': {
		            align: 'right',
		            showHeaders: false
		        },
		        'time': {
		            align: 'right',
		            headingTransform: function(heading) {
		                return heading.toUpperCase() + ' | ';
		            },
		            dataTransform: function(data) {
		                return data + ' | ';
		            }
		        }
		    }
		});
		out = '\n' + title + '\n' + out;

        delete times[label];
        return print ? console.log(out) : out;
    },
    /**
     * round to two decimal places
     *
     * @param value   A value in milliseconds
     */
    _round: function(value) {
        return Math.round(value / 10000) / 100;
    }
};
