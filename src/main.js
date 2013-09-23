(function(window) {

	var players = {};

	var C = function(id) {
		if (players[id]) return players[id];
		return players[id] = new C.Api(id);
	};

	window.pict = C;

})(window);
