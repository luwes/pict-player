(function(C) {

	C.Controls = function(api, config) {
		this.api = api;
		this.config = config;

		this.el = C.$.parseHTML(config.template)[0];
		api.inner.appendChild(this.el);

		this.progressBar = new C.Slider(api, config, {
			el: '.pict-progress'
		});
		this.positionBar = new C.Slider(api, config, {
			el: '.pict-position',
			handle: true,
			change: C.$.proxy(this.change, this)
		});

		C.$(this.el).on('click', C.$.proxy(this.click, this));
		api.on('play pause volume fullscreen', C.$.proxy(this.render, this));
		api.on('loadedmetadata timeupdate', C.$.proxy(this.position, this));
		api.on('progress', C.$.proxy(this.progress, this));
	};

	C.Controls.prototype = {

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
			C.$('.pict-play').attr('data-state', !this.api.video.paused);
			C.$('.pict-mute').attr('data-state', this.api.video.muted);
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
