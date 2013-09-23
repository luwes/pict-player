/**
 * Sub JavaScript library v0.2
 * Very limited substitute for jQuery to include
 * in small projects so you have no dependencies
 * Browser support IE8+
 *
 * Includes code snippets from
 * http://jquery.com/
 * http://underscorejs.org/
 *
 * Copyright (c) 2013 anyone
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 */
(function(window) {

	var push = [].push,
		slice = [].slice;

	window.Sub = function(selector, context) {
		return new Sub.fn.init(selector, context);
	};
	
	if (!window.$) window.$ = window.Sub;

	Sub.fn = Sub.prototype = {

		length: 0,
		calls: [],

		init: function(selector, context) {
			context = context || document;
			if (typeof selector === 'string') {
				push.apply(this, context.querySelectorAll(selector));
			} else if (selector.nodeType) {
				push.apply(this, [selector]);
			}
		},

		each: function(fn) {
			return Sub.each(this, fn, this);
		},

		data: function(key, value) {
			var data = this.attr('data-'+key, value);
			return data === 'true' ? true :
				data === 'false' ? false :
				data === 'null' ? null :
				+data+"" === data ? +data : data;
		},

		attr: function(name, value) {
			return value === undefined ?
				this[0].getAttribute(name) :
				this.each(function(el) {
					el.setAttribute(name, ""+value);
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
				this[0].style[styles] :
				this.each(function(el) {
					for (var key in styles) {
						var value = styles[key];
						if (!isNaN(parseFloat(value)) &&
							!'zIndex,opacity'.match(key)) {
							value += "px";
						}
						el.style[key] = value;
					}
				});
		},

		addClass: function(classes) {
			return this.each(function(el) {
				el.className += ' ' + classes;
			});
		},

		removeClass: function(classes) {
			if (classes) classes = classes.split(' ');
			return this.each(function(el) {
				if (!classes) el.className = "";
				else {
					for (var i = 0; i < classes.length; i++) {
						el.className = el.className.replace(classes[i], '');
					}
				}
			});
		},

		on: function(events, fn) {
			events = events.split(' ');
			fn.guid = fn.guid || Sub.guid++;
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
				push.apply(Sub.fn.calls, Sub.map(this, addEvent, this));
			}
			return this;
		},

		off: function(events, fn) {
			var calls = Sub.fn.calls;
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
		}
	};

	Sub.fn.init.prototype = Sub.fn;

	Sub.extend = function(target) {
		var args = slice.call(arguments, 1);
		for (var i = 0; i < args.length; i++) {
			for (var key in args[i]) target[key] = args[i][key];
		}
		return target;
	};

	Sub.extend(Sub, {

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
			Sub.each(obj, function(value, index, list) {
				results.push(iterator.call(context, value, index, list));
			});
			return results;
		},

		proxy: function(fn, context) {
			var args = slice.call(arguments, 2);
			var proxy = function() {
				return fn.apply(context || this, args.concat(slice.call(arguments)));
			};
			proxy.guid = fn.guid = fn.guid || Sub.guid++;
			return proxy;
		},

		parseHTML: function(content) {
			var temp = document.createElement('div');
			temp.innerHTML = content;
			return temp.childNodes;
		}
	});

})(window);
