(function(C) {

	C.Controls = function(api, config) {
		this.api = api;
		this.config = config;

		this.el = $.parseHTML(config.template)[0];
		$(this.el).on('click', $.proxy(this.click, this));

		api.on('play pause volume fullscreen', $.proxy(this.render, this));
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
					this.api[matches[1]]($(e.target).data('state'));
				}
			}
		},

		render: function() {
			$('.pict-play').data('state', !this.api.video.paused);
			$('.pict-mute').data('state', this.api.video.muted);
			$('.pict-fullscreen').data('state', this.api.isFullscreen());
		}
	};

})(pict);
