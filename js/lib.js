function parse_tsv(data, types) {
	var lines = data.split('\n');
	var n = lines.length;
	if (n && lines[n-1] === '') {
		lines.pop(); --n;
	}
	var names = lines.shift().split('\t'); --n;
	var w = names.length;
	var type_i = -1;
	if (types) {
		for (var i=0; i<w; ++i) {
			if (names[i] == 'type')
				type_i = i;
		}
	}
	var records = new Array(n);
	for (var i=0; i<n; ++i) {
		var fields = lines[i].split('\t');
		var o;
		if (types && type_i >= 0) {
			var type = fields[type_i];
			var c = types[type];
			if (c) {
				o = new c();
			}
		}
		if (!o) {
			o = {};
		}
		for (var j=0; j<w; ++j) {
			var k = names[j];
			var v = fields[j];
			if (v === undefined) {
				v = '';
			} else if (v.match(/^[0-9]+(\.[0-9]+)?$/)) {
				v = +v;
			}
			o[k] = v;
		}
		if (typeof o.init === 'function')
			o.init()
		records[i] = o;
	}
	return records;
}

function get(url, fn_ok, fn_err) {
	// WIP, will need refinement
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.onload = function() {
    	    if (xhr.status === 200)
        	fn_ok(xhr.responseText);
    	    else
        	fn_err(xhr.responseText, xhr.status);
	};
	xhr.send();
}

function remove(e) {
	var p = e.parentNode;
	if (!p)
		return;
	p.removeChild(e);
}

function $(id) {
	return document.getElementById(id);
}

/*
function inherit(Child, Parent) {
	var Parent2 = Object.create(Parent.prototype);
	Parent2.constructor = Child;
	Child.prototype = Parent2;
}
*/

function now() {
	return performance.now() / 1000;
}

var set_timeout_at__margin = 0.002;

function set_timeout_at(target, fn_callback) {
	var t = now();
	var dt = target - t;
	setTimeout(function() {
		log("busy wait for ", target - now());
		while (now() < target) { }
		fn_callback();
	}, (dt - set_timeout_at__margin)*1000);
}

function get_hash() {
	var s = location.hash;
	if (s !== '') {
		s = s.replace(/^#/, '');
		s = decodeURIComponent(s);
		s = s.replace(/\+/g, ' ');
	}
	return s;
}
