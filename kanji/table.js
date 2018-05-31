var grid, data_view, lines;
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
	return lines[item.id].match(query_rx);
}
function setup_grid(tsv, config) {
	lines = tsv.split("\n");
	while (lines[lines.length-1] == "")
		lines.pop();

	var headers = lines.shift().split("\t");

	var columns = [];
	for (var i = 0; i < headers.length; ++i) {
		var n = headers[i];
		var column = {
			id: n,
			name: n,
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
		rowHeight: 43,
		explicitInitialization: true
		};

	var data = [];
	for (var i = 0; i < lines.length; ++i) {
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
function search(e) {
	var query = $.trim($('#search').val());
	var terms = query.split(" ");
	query_rx = new RegExp('^' + terms.map(rx_lookahead_anywhere).join(''), 'i');
	data_view.refresh();
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
	});
}
