var times = {},
	disabled = false;

/**
 * Module exports
 */

module.exports = {
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
	start: function (label) {
		if (disabled) return;
		times[label] = {
			time:  process.hrtime(),
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
	step: function (label, title) {
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
	end: function (label, title, print) {
		if (disabled) return;
		this.step(label, title);

		title = title || '';
		print = print || false;

		var total = process.hrtime(times[label].total);
		var out = 'Total execution time "' + label + '": ~ ' + total[0] + 's ' + this._round(total[1]) + ' ms';

		for (var i = 0; i < times[label].steps.length; i++) {
			var step = times[label].steps[i];
			out += '\n' + (i+1) + '. ' + step.time[0] + 's ' + this._round(step.time[1]) + ' ms\t\t' + step.title;
		}

		delete times[label];
		return print ? console.log(out) : out;
	},
	/**
	 * round to two decimal places
	 *
     * @param value   A value in milliseconds	 
	 */
	_round: function (value) {
		return Math.round(value/10000)/100;
	}
};