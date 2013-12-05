
var Signal = function() {
	var callbacks = [];

	this.on = function(fn, c) {
		callbacks.push({fn: fn, c: c});
		return this;
	};

	this.trigger = function() {
		var args = [].slice.call(arguments);
		for (var i = 0; i < callbacks.length; i++) {
			callbacks[i].fn.apply(callbacks[i].c || this, args);
		}
		return this;
	};

	this.off = function(fn) {
		if (fn) {
			for (var i = 0; i < callbacks.length; i++) {
				if (callbacks[i] === fn) {
					callbacks.splice(i, 1);
					i--;
				}
			}
		} else {
			callbacks = [];
		}
		return this;
	};
};
