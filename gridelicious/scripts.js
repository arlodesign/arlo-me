/**
 *
 * Gridelicious v.05
 * Free, as in do what ever you want with it.
 * Just link to me.
 * http://arlodesign.com/blog/2009/05/01/gridelicious/
 *
 **/

// conversion from unit to points
var units = new Array();
units['in'] = 72;
units['pica'] = 12;
units['pt'] = 1;
units['mm'] = 2.83464567;

var this_unit = 'in';
var page_width;
var page_height;
var desired_leading;
var baselines;
var image_lines;
var correct_leading;
var horizontal_offset;
var f_height;
var f_line;
var gutter_width;
var row_space;

function round_3_decimals(value) {
	return Math.round(value * 1000) / 1000;
}

function populate_page_size() {
	page_width = convert_units($('input#width').val());
	page_height = convert_units($('input#height').val());
	$('span#page-width-pt').html(round_3_decimals(page_width) + ' pt');
	$('span#page-height-pt').html(round_3_decimals(page_height) + ' pt');
}

function convert_units(value) {
	if (this_unit == 'pica') {
		var valuearray = value.split('p');
		value = parseFloat(valuearray[0]) * units[this_unit];
		if (valuearray[1]) {
			return value + parseFloat(valuearray[1]);
		} else {
			return value;
		}
	} else {
		return value * units[this_unit];
	}
}

function calculate_grid_settings() {
	// baselines
	desired_leading = $('input#desired-leading').val();
	baselines = Math.round(page_height / desired_leading);
	if (baselines > 0) $('input#baselines').val(baselines);
	else $('input#baselines').val('');

	// image lines
	image_lines = baselines - 1;
	if (image_lines > 0) $('input#image-lines').val(image_lines);
	else $('input#image-lines').val('');

	// correct leading
	correct_leading = page_height / baselines;
	$('input[name="correct-leading"]').val(round_3_decimals(correct_leading));

	// horizontal offset (to make the grid a proportion of the page size)
	switch ($('#grid-proportion').val()) {
		case "page":
			horizontal_offset = correct_leading / (page_height / page_width);
			break;
		case "square":
			vert_grid_columns = Math.round((page_width / correct_leading) * 10) / 10;
			horizontal_offset = page_width / vert_grid_columns;
	}
	$('input#horz-offset').val(round_3_decimals(horizontal_offset));
}

function calculate_f_height() {
	f_height = $('input#f-height').val();
	f_line = correct_leading - f_height;
	$('input#first-f-line').val(round_3_decimals(f_line));
}

function calculate_gutter_width() {
	gutter_width = horizontal_offset * $('input#gutter-val').val();
	$('input#gutter-width').val(round_3_decimals(gutter_width));
}

function calculate_row_space() {
	row_space = f_line + (correct_leading * $('input#row-val').val());
	$('input#row-space').val(round_3_decimals(row_space));
}

function update_everything() {
	populate_page_size();
	calculate_grid_settings();
	calculate_f_height();
	calculate_gutter_width();
	calculate_row_space();
}

/***/

$(document).ready(function () {
	// Set default units
	$('select#page-units option').removeAttr('selected');
	$('select#page-units option[value="' + this_unit + '"]').attr('selected', 'selected');

	// selected units
	$('select#page-units').change(function () {
		this_unit = $(this).find('option:selected').attr('value');
		update_everything()
	});

	// Make Steppers Work
	$('a#gutter-width-step-down').click(function () {
		var gutter_val = $('input#gutter-val').val();
		if (gutter_val > 0) $('input#gutter-val').val(gutter_val - 1);
		calculate_gutter_width();
	});
	$('a#gutter-width-step-up').click(function () {
		var gutter_val = $('input#gutter-val').val();
		$('input#gutter-val').val(parseInt(gutter_val) + 1);
		calculate_gutter_width();
	});
	$('a#row-space-step-down').click(function () {
		var row_val = $('input#row-val').val();
		if (row_val > 0) $('input#row-val').val(row_val - 1);
		calculate_row_space();
	});
	$('a#row-space-step-up').click(function () {
		var row_val = $('input#row-val').val();
		$('input#row-val').val(parseInt(row_val) + 1);
		calculate_row_space();
	});

	// Set the reset button to clear out the page size spans
	$('input#reset').click(function () {

	});

	// bind updating of all fields to ANY changing input field
	$('input:text').change(function () {
		update_everything();
	});
	$('select').change(function () {
		update_everything();
	});
	$('input:text').blur(function () {
		update_everything();
	});

});