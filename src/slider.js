(function(C, document) {

	C.Slider = function(api, config, options) {
		this.api = api;
		this.options = this.options;

		var _this = this;
		var down = false;

		this.el = document.querySelector(options.el);
		this.el.style.width = '100%';
		var width = this.el.clientWidth;
		this.el.style.width = 0;

		var mouseBar = document.createElement('div');
		mouseBar.style.width = width + 'px';
		this.el.appendChild(mouseBar);

		var onMouse = function(e) {
			down = e.type === 'mousedown';
			onMove(e);
		};
		mouseBar.onmousedown = onMouse;
		document.onmouseup = onMouse;

		var onMove = function(e) {
			if (down) {
				if (e.preventDefault) e.preventDefault();
				var x = e.pageX - getOffset(mouseBar).left;
				if (typeof options.change === 'function') {
					options.change.call(this, x / width * 100);
				}
				return false;
			}
		};
		document.onmousemove = onMove;

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
			this.el.style.width = percent + '%';
			this.a.style.left = (this.el.clientWidth - this.a.clientWidth * percent / 100) + 'px';
		}
	};

})(pict, document);
