/**
 * Module exports
 */

var times = {},
	disabled = false;

module.exports = {
	disable: function() {
		disabled = true;
	},
	start: function (label) {
		if (disabled) return;
		times[label] = {
			time:  process.hrtime(),
			total: process.hrtime(),
			steps: []
		};
	},
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
	_round: function (value) {
		return Math.round(value/10000)/100;
	}
};