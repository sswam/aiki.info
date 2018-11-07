var grid, data_view, lines, lines_search;
var query_rx = /./;
var loading_delay = 1000;
function format_kanji(row, cell, value, columnDef, dataContext) {
	return '<a href="//jisho.org/kanji/details/' + value + '">' + value + '</a>';
	// TODO a pop-up menu to allow to choose koohii link, edict link, etc
	// also apply to each of multiple kanji in a longer phrase or whatever
	// https://kanji.koohii.com/study/kanji/X
}
function row_count_changed(e, args) {
	grid.updateRowCount();
	grid.render();
}
function rows_changed(e, args) {
	grid.invalidateRows(args.rows);
	grid.render();
}
function filter(item) {
	return lines_search[item.id].match(query_rx);
}
function setup_grid(tsv, config) {
	lines = tsv.split("\n");
	while (lines[lines.length-1] == "")
		lines.pop();

	var header_names = lines.shift().split("\t");
	var headers = [];
	var columns = [];
	for (var i = 0; i < header_names.length; ++i) {
		var N = header_names[i];
		var n = N.toLowerCase().replace(' ', '_');
		headers[i] = n;
		var column = {
			id: n,
			name: N,
			field: n,
			cssClass: n,
			width: config.widths[i]
		};
		var fmt = "format_"+n;
		if (typeof window[fmt] == "function") {
			column.formatter = window[fmt];
		}
		var extra = config.columns[n];
		for (var k in extra) {
			column[k] = extra[k];
		}
		columns.push(column);
	}

	var options = {
		enableCellNavigation: false,
		enableColumnReorder: true,
		enableTextSelectionOnCells: true,
		rowHeight: 50,
		explicitInitialization: true
		};

	var data = [];
	lines_search = [];
	for (var i = 0; i < lines.length; ++i) {
		lines_search[i] = strip_accents(lines[i]);
		var a = lines[i].split("\t");
		var d = { id: i };
		for (var j = 0; j < headers.length; ++j) {
			d[headers[j]] = a[j];
		}
		data[i] = d;
	}

	data_view = new Slick.Data.DataView();

	grid = new Slick.Grid("#container", data_view, columns, options);
	plugin = new Slick.AutoTooltips({ enableForHeaderCells: true });
	grid.registerPlugin(plugin);

	grid.init();

	data_view.onRowCountChanged.subscribe(row_count_changed);
	data_view.onRowsChanged.subscribe(rows_changed);

	data_view.beginUpdate();
	data_view.setItems(data);
	data_view.setFilter(filter);
	data_view.endUpdate();
}
function rx_lookahead_anywhere(s) {
	return "(?=.*(?:" + s + "))";
}
function strip_accents(s) {
	return s.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}
var old_query = []
function search(e) {
	var query = $.trim($('#search').val());
	if (query == old_query) {
		return;
	}
	old_query = query;
	var q2 = strip_accents(query);
	var terms = q2.split(" ");
	query_rx = new RegExp('^' + terms.map(rx_lookahead_anywhere).join(''), 'i');
	data_view.refresh();
	delay_set_title_hash(query);
}
var loading_timeout;
function loading(on_off) {
	var el = document.getElementById("loading");
	if (!el) {
		el = document.createElement("div");
		el.id = "loading";
		el.style.display = 'none';
		el.className = 'loading';
		el.innerText = 'Loading...';
		document.body.prepend(el);
	}
	if (on_off) {
		loading(false);
		loading_timeout = setTimeout(function() {
			el.style.display = 'block';
			loading_timeout = null;
		}, loading_delay);
	} else {
		if (loading_timeout) {
			clearTimeout(loading_timeout);
			loading_timeout = null;
		}
		el.style.display = 'none';
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
	set_title_hash_timeout = setTimeout(set_title_hash, 2000);
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
	var query = hash.replace(/\+/g, ' ');
	query = decodeURIComponent(query);
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

function init(file, config) {
	loading(true);
	var ajax = $.ajax({
		url: file,
	});
	ajax.fail(function() {
		loading(false);
		alert("load failed");
	});
	ajax.done(function(tsv) {
		loading(false);
		setup_grid(tsv, config);
		$('#search').focus();
		$('#search').on("change keyup", search);
		$('#search_clear').on('click', search_clear);
		$(window).on('hashchange', on_hash_change);
		on_hash_change();
	});
}
