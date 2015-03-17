var old_query = [];

function search() {
	var query = $('#search').val();
	if (query == old_query) {
		return;
	}
	old_query = query;
	if (query.match(/^ *$/)) {
		$('li').show();
		delay_set_title_hash('');
		return;
	}
	var query_words = query.toLowerCase().split(" ");
	for (var i=0; i<query_words.length; ++i) {
		query_words[i] = query_words[i].replace(/\./g, ' ');
	}
	var count = 0;
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
			++count;
		}
	});
	if (count) {
		delay_set_title_hash(query);
	} else {
		clearTimeout(set_title_hash_timeout);
	}
}

var new_hash;
var new_title;
var set_title_hash_timeout;
function delay_set_title_hash(query) {
	new_hash = '#'+query.replace(/ /g, '+');
	new_title = query_to_title(query);
	if (set_title_hash_timeout) {
		clearTimeout(set_title_hash_timeout);
	}
	set_title_hash_timeout = setTimeout(set_title_hash, 1000);
}
function query_to_title(query) {
	var new_title = $('title').text();
	new_title = new_title.replace(/.* - |^/, '');
	if (query != '') {
		new_title = query + ' - ' + new_title;
	}
	return new_title;
}
function set_title_hash() {
	location.hash = new_hash;
	$('title').text(new_title);
}
function on_hash_change() {
	$('title').text(query_to_title(hash_to_query(location.hash)));
	if (location.hash != new_hash) {
		var query = hash_to_query(location.hash);
		$('#search').val(query);
		search();
	}
}
function hash_to_query(hash) {
	var query = hash.replace(/\+|%20/g, ' ');
	if (query.length) {
		query = query.substr(1);
	}
	return query;
}
function search_clear() {
	$('#search').focus();
	$('#search').val('');
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
	on_hash_change();
});
