(function(C, document) {

	C.Api = function(id) {
		this.id = id;
		this.$video = $('#'+id);
		this.video = this.$video[0];
	};

	C.Api.prototype = {

		setup: function(options) {

			var defaults = {
				template:
					'<div class="pict-controls">' +
						'<div class="pict-left">' +
							'<a href="#" class="pict-play"></a>' +
						'</div>' +
						'<div class="pict-right">' +
							'<span class="pict-duration">13:20</span>' +
							'<a href="#" class="pict-mute"></a>' +
							'<a href="#" class="pict-fullscreen"></a>' +
						'</div>' +
						'<div class="pict-center">' +
							'<div class="pict-progress"></div>' +
						'</div>' +
					'</div>'
			};

			this.config = $.extend(defaults, options);

			//this.video.controls = false;

			this.el = document.createElement('div');
			this.el.className = "pict-player";
			this.inner = document.createElement('div');
			this.inner.className = "pict-inner";
			this.video.parentNode.insertBefore(this.el, this.video);
			this.video.parentNode.removeChild(this.video);
			this.inner.appendChild(this.video);
			this.el.appendChild(this.inner);

			$(this.el).css({
				width: this.$video.attr('width'),
				height: this.$video.attr('height')
			});
			this.$video.removeAttr('width height');

			this.controls = new C.Controls(this, this.config);
			this.inner.appendChild(this.controls.el);
		},

		handle: function(action, events, fn) {
			if (events.match(/\bfullscreen/)) {
				$(document)[action]('webkitfullscreenchange mozfullscreenchange fullscreenchange', fn);
			}
			events = events.replace(/volume\b/, 'volumechange');
			this.$video[action](events, fn);
		},
		on: function(events, fn) {
			this.handle('on', events, fn);
		},
		off: function(events, fn) {
			this.handle('off', events, fn);
		},

		play: function(playing) {
			if (playing) {
				this.video.pause();
			} else {
				this.video.play();
			}
		},
		pause: function() {
			this.video.pause();
		},
		mute: function(muted) {
			if (muted) {
				this.video.muted = false;
			} else {
				this.video.muted = true;
			}
		},
		volume: function(val) {
			this.video.muted = false;
			if (val) this.video.volume = val;
		},
		fullscreen: function(fullscreen) {
			if (fullscreen) {
				this.normalscreen();
			} else {
				var el = this.inner;
				var requestFullScreen = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
				requestFullScreen.call(el);
			}
		},
		normalscreen: function() {
			var cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen;
			cancelFullScreen.call(document);
		},
		isFullscreen: function() {
			return !!(document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreenElement);
		}
	};

})(pict, document);
