
var Controlbar = function(api, options) {
	this.api = api;
	this.id = 0;

	var defaults = {
		template:
			'<div class="pict-controls">' +
				'<div class="pict-left">' +
					'<a class="pict-play"></a>' +
				'</div>' +
				'<div class="pict-right">' +
					'<span class="pict-time">00:00</span>' +
					'<a class="pict-mute"></a>' +
					'<a class="pict-fullscreen"></a>' +
				'</div>' +
				'<div class="pict-center">' +
					'<div class="pict-bar">' +
						'<div class="pict-progress"></div>' +
						'<div class="pict-position"></div>' +
					'</div>' +
				'</div>' +
			'</div>',
		delay: 1000
	};
	
	this.config = $.extend(defaults, options);

	this.el = $.parseHTML(this.config.template)[0];
	this.$el = $(this.el);
	api.inner.appendChild(this.el);

	this.progressBar = new Slider({
		el: '.pict-progress'
	});
	this.positionBar = new Slider({
		el: '.pict-position',
		handle: true,
		change: $.proxy(this.change, this)
	});

	this.listenTo($(api.el), 'mousemove', $.throttle(this.delayedHide, this.config.delay-10));

	this.listenTo(this.$el, 'click', this.click);
	this.listenTo(this.$el, 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', this.hideEnd);

	this.listenTo(api, 'play pause volume fullscreen', this.render);
	this.listenTo(api, 'loadedmetadata timeupdate', this.position);
	this.listenTo(api, 'progress', this.progress);

	this.events = {
		show: new Signal(),
		hide: new Signal()
	};
};

Controlbar.prototype = {

	listenTo: function(obj, event, fn) {
		obj.on(event, $.proxy(fn, this));
	},

	on: function(event, fn) {
		this.events[event].on(fn);
	},

	off: function(event, fn) {
		this.events[event].off(fn);
	},

	delayedHide: function() {
		this.show();
		if (!this.api.video.paused) {
			this.id = setTimeout($.proxy(this.hide, this), this.config.delay);
		}
	},

	show: function() {
		clearTimeout(this.id);
		if (this.$el.css('opacity') == 0) {
			this.$el.css({ visibility: 'visible', opacity: 1 });
			this.events.show.trigger();
		}
	},

	hide: function() {
		if (this.$el.css('opacity') == 1) {
			this.$el.css({ opacity: 0 });
			this.events.hide.trigger();
		}
	},

	hideEnd: function() {
		if (this.$el.css('opacity') == 0) {
			this.$el.css({ visibility: 'hidden' });
		}
	},

	click: function(e) {
		if (e.preventDefault) e.preventDefault();
		if (e.target.nodeName == 'A') {
			this.action(e);
		}
	},

	action: function(e) {
		var matches = e.target.className.match(/pict-([^\s]*)/);
		if (matches) {
			if ('play,mute,fullscreen'.match(matches[1])) {
				this.api[matches[1]]($(e.target).attr('data-state') === 'true');
			}
		}
	},

	change: function(percent) {
		this.api.video.currentTime = this.api.video.duration * percent / 100;
	},

	render: function() {
		var v = this.api.video;

		this.delayedHide();

		$('.pict-play').attr('data-state', !v.paused);
		$('.pict-mute').attr('data-state', v.muted);
		$('.pict-fullscreen').attr('data-state', this.api.isFullscreen());
	},

	position: function() {
		var v = this.api.video;
		var value = v.currentTime || v.duration;
		$('.pict-time').html($.formatTime(value));
		this.positionBar.val(v.currentTime / v.duration * 100);
	},

	progress: function() {
		var v = this.api.video;
		if (v.buffered.length > 0) {
			this.progressBar.val(v.buffered.end(v.buffered.length-1) / v.duration * 100);
		}
	}
};
