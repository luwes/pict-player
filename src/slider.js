
var Slider = function(options) {
	var _this = this;
	var down = false;

	this.el = $(options.el)[0];

	this.div = document.createElement('div');
	this.el.appendChild(this.div);

	var p = document.createElement('p');
	this.el.appendChild(p);

	var onMouse = function(e) {
		down = e.type === 'mousedown';
		onMove(e);
	};
	$(p).on('mousedown', onMouse);
	$(document).on('mouseup', onMouse);

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
	$(document).on('mousemove', $.throttle(onMove, 33));

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
		return { 'left': x, 'top': y };
	};
};

Slider.prototype = {

	val: function(percent) {
		this.div.style.width = percent + '%';
		this.a.style.left = percent + '%';
		this.a.style.marginLeft = (-this.a.clientWidth * percent / 100) + 'px';
	}
};
