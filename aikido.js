var old_query = [];
function search() {
	var query = $('#search').val();
	if (query == old_query) {
		return;
	}
	old_query = query;
	if (query.match(/^ *$/)) {
		$('li').show();
		delay_set_hash('');
		var title = $('title').text()
		title = title.replace(/.* - |^/, '');
		$('title').text(title);
		return;
	}
	var query_words = query.toLowerCase().split(" ");
	for (var i=0; i<query_words.length; ++i) {
		query_words[i] = query_words[i].replace(/\./g, ' ');
	}
	$('li').hide();
	$('li').each(function() {
		var $li = $(this);
		var $path_li = $.merge($li, $li.parents('li'));
		var path = ' ';
		$path_li.each(function() {
			var $li = $(this);
			var $a = $li.children('a').first();
			path += $a.text() + ' ';
		});
		path = path.toLowerCase();
		var match = true;
		for (var i=0; i<query_words.length; ++i) {
			var w = query_words[i];
			var exclude = w.indexOf('-') == 0;
			if (exclude) {
				w = w.substr(1);
				if (w.length == 0) {
					continue;
				}
			}
			var found = path.indexOf(w) >= 0;
			if (exclude == found) {
				match = false;
				break;
			}
		}
		if (match) {
			$li.show();
			$li.parents('li').show();
		}
	});
	delay_set_hash('#'+query.replace(/ /g, '+'));
	var title = $('title').text()
	title = title.replace(/.* - |^/, query + ' - ');
	$('title').text(title);
}
var new_hash;
var set_hash_timeout;
function delay_set_hash(v) {
	new_hash = v;
	if (set_hash_timeout) {
		clearTimeout(set_hash_timeout);
	}
	set_hash_timeout = setTimeout(set_hash, 1000);
}
function set_hash() {
	location.hash = new_hash;
}
function on_hash_change() {
	if (location.hash != new_hash) {
		search_from_hash();
	}
}
function search_clear() {
	$('#search').focus();
	$('#search').val('');
	search();
}
function search_from_hash() {
	var query = location.hash;
	query = query.replace(/\+|%20/g, ' ');
	if (query.length) {
		query = query.substr(1);
		$('#search').val(query);
	}
	search();
}

$('#search').on('input', search);
$('#search').on('change', search);
$('#search').on('keyup', function(event) {
	event.preventDefault();
	if (event.which == 13) {
		search();
	}
});
$('#search_clear').on('click', search_clear);
$(window).hashchange(on_hash_change);
$(function() {
	search_from_hash();
});
