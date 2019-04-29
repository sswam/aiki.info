$(function() {
	var $comments = $('<div id="comments" class="comments columns"/>');
	$comments.append($('<div id="comment_div"><textarea id="comment" class="comment" placeholder="your comment ..."></textarea><br><button id="comment_save" class="comment save">save</button></div>'));
	$('body').append($comments);
	var page = document.baseURI.replace(/.*?\/\/.*?\//, '');
	if (page == "" || page[page.length-1] == '/') {
		page += "index.html";
	}
	var comment_uri = '/comments/' + page;
	$.ajax({
		type: "GET",
		url: comment_uri,
		dataType: "html"
	}).done(function(data) {
		$comments.prepend(data);
	});
	$('#comment_save').hide();
	$('#comment_save').on('click', comment_save);
	$('#comment').on('keypress keyup paste cut change', comment_changed);
	function comment_changed() {
		$('#comment').off();
		$('#comment_save').show();
	}
	function comment_save() {
		var comment = $('#comment').val();
		$.ajax({
			type: "POST",
			url: "/x/comment",
			data: { page: page, comment: comment },
			dataType: "html"
		}).done(function(data) {
			$('#comment_div').remove();
			$comments.append(data);
		});
		console.log(comment);
	}
});

