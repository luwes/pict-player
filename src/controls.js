(function(C) {

	C.Controls = function(api, config) {
		this.api = api;
		this.id = 0;

		this.el = C.$.parseHTML(config.template)[0];
		this.$el = C.$(this.el);
		api.inner.appendChild(this.el);

		this.progressBar = new C.Slider(api, config, {
			el: '.pict-progress'
		});
		this.positionBar = new C.Slider(api, config, {
			el: '.pict-position',
			handle: true,
			change: C.$.proxy(this.change, this)
		});

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
				this.id = setTimeout(C.$.proxy(this.hide, this), 1000);
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
