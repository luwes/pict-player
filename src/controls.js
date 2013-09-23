(function(C) {

	C.Controls = function(api, config) {
		this.api = api;
		this.config = config;

		this.el = C.$.parseHTML(config.template)[0];
		C.$(this.el).on('click', C.$.proxy(this.click, this));

		api.on('play pause volume fullscreen', C.$.proxy(this.render, this));
		api.on('loadedmetadata timeupdate', C.$.proxy(this.position, this));
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

		render: function() {
			C.$('.pict-play').attr('data-state', !this.api.video.paused);
			C.$('.pict-mute').attr('data-state', this.api.video.muted);
			C.$('.pict-fullscreen').attr('data-state', this.api.isFullscreen());
		},

		position: function() {
			var value = this.api.video.currentTime || this.api.video.duration;
			C.$('.pict-time').html(C.$.formatTime(value));
		}
	};

})(pict);
