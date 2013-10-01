(function(window, document) {

	var players = {};

	var C = window.pict = function(id) {
		if (players[id]) return players[id];
		return players[id] = new C.fn.init(id);
	};

	C.fn = C.prototype = {

		init: function(id) {
			this.id = id;
			this.$video = C.$('#'+id);
			this.video = this.$video[0];
		},

		setup: function(options) {

			var defaults = {
				controls: false
			};

			this.config = C.$.extend(defaults, options);

			this.video.controls = this.config.controls;

			this.el = document.createElement('div');
			this.el.className = "pict-player";
			this.inner = document.createElement('div');
			this.inner.className = "pict-inner";
			this.video.parentNode.insertBefore(this.el, this.video);
			this.video.parentNode.removeChild(this.video);
			this.inner.appendChild(this.video);
			this.el.appendChild(this.inner);

			C.$(this.el).css({
				width: this.$video.attr('width'),
				height: this.$video.attr('height')
			});
			this.$video.removeAttr('width height');

			this.controlbar = new C.Controlbar(this, this.config.controlbar);

			this.on('click', C.$.proxy(this.toggle, this));

			return this;
		},

		handle: function(action, events, fn) {
			if (events.match(/\bfullscreen/)) {
				C.$(document)[action]('webkitfullscreenchange mozfullscreenchange fullscreenchange', fn);
			}
			events = events.replace(/volume\b/, 'volumechange');
			events = events.replace(/(time\b|position)/, 'timeupdate');
			this.$video[action](events, fn);
			return this;
		},
		on: function(events, fn) {
			return this.handle('on', events, fn);
		},
		off: function(events, fn) {
			return this.handle('off', events, fn);
		},

		load: function(src) {
			this.video.src = src;
			this.video.load();
			return this;
		},
		toggle: function() {
			return this.play(!this.video.paused);
		},
		play: function(playing) {
			if (playing) {
				this.video.pause();
			} else {
				this.video.play();
			}
			return this;
		},
		pause: function() {
			this.video.pause();
			return this;
		},
		mute: function(muted) {
			if (muted) {
				this.video.muted = false;
			} else {
				this.video.muted = true;
			}
			return this;
		},
		volume: function(val) {
			this.video.muted = false;
			if (val) this.video.volume = val;
			return this;
		},
		fullscreen: function(fullscreen) {
			if (fullscreen) {
				this.normalscreen();
			} else {
				var el = this.inner;
				var requestFullScreen = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
				requestFullScreen.call(el);
			}
			return this;
		},
		normalscreen: function() {
			var cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen;
			cancelFullScreen.call(document);
			return this;
		},
		isFullscreen: function() {
			return !!(document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreenElement);
		}
	};

	C.fn.init.prototype = C.fn; 

})(window, document);
