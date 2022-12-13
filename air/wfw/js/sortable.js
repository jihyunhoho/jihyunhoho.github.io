/**
 * sortable.js sortable Table
 * 
 * @version 1.0
 * @author SAINTSHINE
 * @since 2012.11.06
 */
(function($) {

	$.fn.sortable = function(option, flag) {

		// current table
		var $table = $(this);

		// alert($(this).attr('id'));
		// optinos
		var activeColor = '';
		var head_id = null;
		var enabled = (flag === undefined) ? true : flag;

		var sort_classes = Array();
		sort_classes.push("sort-numeric");
		sort_classes.push("sort-text");
		sort_classes.push("sort-date");

		if (option) {
			if (option.activeColor) {
				activeColor = option.activeColor;
			}
			if (option.head) {
				head_id = option.head;
			}
		}

		// var $sort_asc = "<span class='sortable-arrow ui-icon ui-icon-triangle-1-n' style='float: right;'></span>";
		// var $sort_desc = "<span class='sortable-arrow ui-icon ui-icon-triangle-1-s' style='float: right;'></span>";
		var $sort_asc = '<span id="sp_up"><a href="#" class="k1_btn_up k1_ml3">up</a></span>';
		var $sort_desc = '<span id="sp_down"><a href="#" class="k1_btn_down k1_ml3">down</a></span>';
		var $sort_default = '<span><a href="#" class="k1_btn_updown k1_ml3" title="updown">updown</a></span>';

		var arrow = {
			"1" : $sort_asc,
			"-1" : $sort_desc
		};

		$table.each(function(index) {

			if (!enabled) {
				sortclear();
				return;
			}

			clearHeader();

			// 데이타 첫번째 Row에 first class 추가/삭제하는 로직
			setRow($table.find('tbody > tr').get());

			$('th:not([scope="colgroup"])', $table).each(function(column) {
				// $('th', $table).each(function(column) {
				var $header = $(this);
				if (hasSortClass($header)) {

					$header.sortDirection = 1;
					$header.css('cursor', 'pointer');

					$header.click(function() {

						clearHeader();

						activeCurrentHeader($header, column);

						var rows = $table.find('tbody > tr').get();
						setSortKey($header, rows, column);
						rows.sort(function(pre, curr) {
							// var keyA = $(a).children('td').eq(column).text();
							// var keyB = $(b).children('td').eq(column).text();

							if (pre.sortKey < curr.sortKey) {
								return -$header.sortDirection;
							}
							if (pre.sortKey > curr.sortKey) {
								return $header.sortDirection;
							}
							return 0;
						});

						$header.sortDirection = -$header.sortDirection;
						// $table.children('tbody').empty();

						setRow(rows);
					});
				}
			});
		});

		function hasSortClass(obj) {
			var result = false;
			$.each(sort_classes, function(index, cls) {
				if (obj.hasClass(cls)) {
					result = true;
				}
			});
			return result;
		}
		;

		function sortclear() {
			$('th:not([scope="colgroup"])', $table).each(function(index) {
				if (!hasSortClass($(this))) {
					return;
				}
				if (activeColor != "") {
					$(this).css('background', '');
				}
				// $(this).find('.sortable-arrow').remove();

				$span = $(this).find('> span').remove();
				$(this).html($(this).html());

				// alert(index);
				if (head_id != null) {
					var $tr_head = $(head_id);
					var $th_head = $tr_head.find('td:not([scope="colgroup"]):not([class="last"]):eq(' + index + ')');
					$th_head.html($(this).html());
				}
			});
		}

		function clearHeader() {
			$('th:not([scope="colgroup"])', $table).each(function(index) {
				if (!hasSortClass($(this))) {
					return;
				}
				if (activeColor != "") {
					$(this).css('background', '');
				}
				// $(this).find('.sortable-arrow').remove();

				$span = $(this).find('> span').remove();
				$(this).html($(this).html() + $sort_default);

				// alert($(this).html());
				if (head_id != null) {
					var $tr_head = $(head_id);
					var $th_head = $tr_head.find('td:not([scope="colgroup"]):not([class="last"]):eq(' + index + ')');
					// alert('z : ' + $th_head.attr('id'));
					$th_head.html($(this).html());
				}
			});
		}

		function activeCurrentHeader(obj, colidx) {
			$span = obj.find('> span');
			$span.remove();

			obj.html(obj.html() + arrow[obj.sortDirection]);
			if (activeColor != "") {
				obj.css("background", activeColor);
			}

			obj.attr('type', obj.sortDirection);
			if (head_id != null) {
				var $tr_head = $(head_id);
				var $th_head = $tr_head.find('td:not([scope="colgroup"]):not([class="last"]):eq(' + colidx + ')');
				$th_head.html(obj.html());
				if (obj.sortDirection == 1) {
					// $th_head.attr('id', $th_head.attr('id') + " ASC");
				} else {
					// $th_head.attr('id', $th_head.attr('id') + " DESC");
				}
			}

		}

		function setSortKey(obj, rows, column) {

			$.each(rows, function(index, row) {

				var key = $(row).children('td').eq(column).text();

				// alert(key);
				if (obj.hasClass('sort-numeric')) {

					key = $.util.trimChar(key, ',');
					key = parseFloat(key);
					key = isNaN(key) ? 0 : key;

				}

				row.sortKey = key;

			});
		}

		function setRow(rows) {
			$.each(rows, function(index, row) {
				if (head_id != null) {
					// 첫번째 row에는 line을 없는 속성을 지정하고 나머지 row에는 line이 있는 속성을 지정한다.
					if (index == 0) {
						$(row).addClass('first');
						// console.log('first row : ' + $(row).children('td').eq(column).text());
					} else {
						$(row).removeClass('first');
						// console.log('row : ' + $(row).children('td').eq(column).text());
					}
				}

				$table.children('tbody').append(row);
			});

		}
	};
})(jQuery);
