(function(C, document) {

	C.Slider = function(api, config, options) {
		this.api = api;

		var _this = this;
		var down = false;

		this.el = C.$(options.el)[0];

		this.div = document.createElement('div');
		this.el.appendChild(this.div);

		var p = document.createElement('p');
		this.el.appendChild(p);

		var onMouse = function(e) {
			down = e.type === 'mousedown';
			onMove(e);
		};
		p.onmousedown = onMouse;
		C.$(document).on('mouseup', onMouse);

		var onMove = function(e) {
			if (down) {
				if (e.preventDefault) e.preventDefault();
				var x = e.pageX - getOffset(p).left;
				if (typeof options.change === 'function') {
					options.change.call(this, x / p.clientWidth * 100);
				}
				return false;
			}
		};
		C.$(document).on('mousemove', onMove);

		this.a = document.createElement('a');
		if (options.handle) {
			this.el.appendChild(this.a);
			this.a.onmousedown = onMouse;
		}

		var getOffset = function(el) {
			var x = 0, y = 0;
			do {
				x += el.offsetLeft - el.scrollLeft;
				y += el.offsetTop - el.scrollTop;
			}
			while ((el = el.offsetParent));
			return { "left": x, "top": y };
		};
	};

	C.Slider.prototype = {

		val: function(percent) {
			this.div.style.width = percent + '%';
			this.a.style.left = (this.div.clientWidth - this.a.clientWidth * percent / 100) + 'px';
		}
	};

})(pict, document);
