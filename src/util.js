
var $ = function(selector, context) {
	return new $.fn.init(selector, context);
};

$.fn = $.prototype = {

	length: 0,
	calls: [],

	init: function(selector, context) {
		context = context || document;
		if (typeof selector === 'string') {
			[].push.apply(this, context.querySelectorAll(selector));
		} else if (selector.nodeType) {
			[].push.apply(this, [selector]);
		}
	},

	each: function(fn) {
		return $.each(this, fn, this);
	},

	attr: function(name, value) {
		return value === undefined ?
			this[0].getAttribute(name) :
			this.each(function(el) {
				el.setAttribute(name, ''+value);
			});
	},

	removeAttr: function(names) {
		names = names.split(' ');
		return this.each(function(el) {
			for (var i = 0; i < names.length; i++) {
				el.removeAttribute(names[i]);
			}
		});
	},

	css: function(styles) {
		return typeof styles === 'string' ?
			this[0].style[styles] || window.getComputedStyle(this[0])[styles] :
			this.each(function(el) {
				for (var key in styles) {
					var value = styles[key];
					if (!isNaN(value) && !'zIndex,opacity'.match(key)) {
						value += 'px';
					}
					el.style[key] = value;
				}
			});
	},

	on: function(events, fn) {
		events = events.split(' ');
		fn.guid = fn.guid || $.guid++;
		for (var i = 0; i < events.length; i++) {
			var event = events[i];
			var addEvent = function(el) {
				var wrap = function(e) {
					//todo handle IE
					fn.call(el, e);
				};
				if (el.addEventListener) {
					el.addEventListener(event, wrap, false);
				} else if (el.attachEvent) {
					el.attachEvent('on'+event, wrap);
				}
				return {
					type: event,
					el: el,
					fn: fn,
					wrap: wrap,
					guid: fn.guid
				};
			};
			[].push.apply($.fn.calls, $.map(this, addEvent, this));
		}
		return this;
	},

	off: function(events, fn) {
		var calls = $.fn.calls;
		events = events.split(' ');
		for (var i = 0; i < events.length; i++) {
			var event = events[i];
			var removeEvent = function(el) {
				for (var i = 0; i < calls.length; i++) {
					var obj = calls[i];
					if ((obj.el === el) &&
						(obj.type === event || !event) &&
						(obj.guid === fn.guid || !fn)) {
						if (el.removeEventListener) {
							el.removeEventListener(obj.type, obj.wrap, false);
						} else if (el.detachEvent) {
							el.detachEvent('on'+obj.type, obj.wrap);
						}
						calls.splice(i, 1);
						i -= 1;
					}
				}
			};
			this.each(removeEvent);
		}
		return this;
	},

	html: function(content) {
		return this.each(function(el) {
			el.innerHTML = content;
		});
	}
};

$.fn.init.prototype = $.fn;

$.extend = function(target) {
	var args = [].slice.call(arguments, 1);
	for (var i = 0; i < args.length; i++) {
		for (var key in args[i]) target[key] = args[i][key];
	}
	return target;
};

$.extend($, {

	guid: 1,

	each: function(obj, iterator, context) {
		if (obj == null) return;
		if (obj.forEach) obj.forEach(iterator, context);
		else if (obj.length === +obj.length) {
			for (var i = 0, length = obj.length; i < length; i++) {
				iterator.call(context, obj[i], i, obj);
			}
		} else {
			for (var key in obj) {
				iterator.call(context, obj[key], key, obj);
			}
		}
		return obj;
	},

	map: function(obj, iterator, context) {
		var results = [];
		if (obj == null) return results;
		if (obj.map) return obj.map(iterator, context);
		$.each(obj, function(value, index, list) {
			results.push(iterator.call(context, value, index, list));
		});
		return results;
	},

	proxy: function(fn, context) {
		var args = [].slice.call(arguments, 2);
		var proxy = function() {
			return fn.apply(context || this, args.concat([].slice.call(arguments)));
		};
		proxy.guid = fn.guid = fn.guid || $.guid++;
		return proxy;
	},

	parseHTML: function(content) {
		var temp = document.createElement('div');
		temp.innerHTML = content;
		return temp.childNodes;
	},

	formatTime: function(secs) {
		var h = parseInt(secs / 3600, 10);
		var m = parseInt((secs % 3600) / 60, 10);
		var s = parseInt((secs % 3600) % 60, 10);
		return (h === 0 ? '' : (h < 10 ? '0'+h+':' : h+':')) +
				(m < 10 ? '0'+m : ''+m) + ':' +
				(s < 10 ? '0'+s : ''+s);
	},

	throttle: function(func, wait, options) {
		var context, args, result;
		var timeout = null;
		var previous = 0;
		options = options || {};
		var later = function() {
			previous = options.leading === false ? 0 : new Date();
			timeout = null;
			result = func.apply(context, args);
		};
		return function() {
			var now = new Date();
			if (!previous && options.leading === false) previous = now;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0) {
				clearTimeout(timeout);
				timeout = null;
				previous = now;
				result = func.apply(context, args);
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	}
});
