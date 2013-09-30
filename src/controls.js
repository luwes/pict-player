(function(C) {

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

	C.Controls = function(api) {
		this.api = api;
		this.id = 0;
		this.config = C.$.extend(defaults, api.config.controls);

		this.el = C.$.parseHTML(this.config.template)[0];
		this.$el = C.$(this.el);
		api.inner.appendChild(this.el);

		this.progressBar = new C.Slider({
			el: '.pict-progress'
		});
		this.positionBar = new C.Slider({
			el: '.pict-position',
			handle: true,
			change: C.$.proxy(this.change, this)
		});

		C.$(api.el).on('mousemove', C.$.proxy(this.show, this));

		this.$el.on('click', C.$.proxy(this.click, this));
		this.$el.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', C.$.proxy(this.display, this));

		api.on('play pause volume fullscreen', C.$.proxy(this.render, this));
		api.on('loadedmetadata timeupdate', C.$.proxy(this.position, this));
		api.on('progress', C.$.proxy(this.progress, this));
	};

	C.Controls.prototype = {

		show: function() {
			this.$el.css({ visibility: 'visible', opacity: 1 });
			clearTimeout(this.id);
			if (!this.api.video.paused) {
				this.id = setTimeout(C.$.proxy(this.hide, this), this.config.delay);
			}
		},

		hide: function() {
			this.$el.css({ opacity: 0 });
		},

		display: function() {
			if (this.$el.css('opacity') == 0) {
				this.$el.css({ visibility: 'hidden' });
			}
		},

		click: function(e) {
			e.preventDefault();
			if (e.target.nodeName == "A") {
				this.action(e);
			}
		},

		action: function(e) {
			var matches = e.target.className.match(/pict-([^\s]*)/);
			if (matches) {
				if ('play,mute,fullscreen'.match(matches[1])) {
					this.api[matches[1]](C.$(e.target).attr('data-state') === "true");
				}
			}
		},

		change: function(percent) {
			this.api.video.currentTime = this.api.video.duration * percent / 100;
		},

		render: function() {
			var v = this.api.video;

			this.show();

			C.$('.pict-play').attr('data-state', !v.paused);
			C.$('.pict-mute').attr('data-state', v.muted);
			C.$('.pict-fullscreen').attr('data-state', this.api.isFullscreen());
		},

		position: function() {
			var v = this.api.video;
			var value = v.currentTime || v.duration;
			C.$('.pict-time').html(C.$.formatTime(value));
			this.positionBar.val(v.currentTime / v.duration * 100);
		},

		progress: function() {
			var v = this.api.video;
			if (v.buffered.length > 0) {
				this.progressBar.val(v.buffered.end(v.buffered.length-1) / v.duration * 100);
			}
		}
	};

})(pict);
