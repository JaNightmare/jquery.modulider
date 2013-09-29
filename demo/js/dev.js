$(function (){ // document ready
	var devSlider = window.slider;
	/* begin monitor */
	// round with precision
	Math._round = function (x, precision){
		var p = Math.pow(10, precision || 1);
		return Math.round(x * p) / p;
	};

	setInterval(function (){
		$('#current').text(devSlider.currSlide);
		$('#next').text(devSlider.nextSlide);
		$('#running').text(devSlider.inTransition);
	}, 10);

	// select transition
	var transitions = '<option value="select">select...</option>';
	$.each($.fn.modulider.transitions, function (key){
		transitions += '<option value="' + key + '">' + key + '</option>';
	});

	$('#transitions').change(function (){
		if (this.value != 'select')
			devSlider.options.transition = this.value;
	}).html(transitions);

	// mouseOver option
	$(':checkbox').each(function (){
		this.checked = false;
	});

	$('#mOver').click(function (e){
		if (this.checked) {
			devSlider.options.setSlideEvents.call(devSlider);
			devSlider.options.mouseOver = true;
		} else {
			devSlider.options.slides.off();
			devSlider.options.mouseOver = false;
		}
	});
	if (devSlider.options.mouseOver)
		$('#mOver').click();

	// delay and speed option
	$('#delay, #speed').each(function (){
		this.value = devSlider.options[this.id];
	}).change(function (){
		devSlider.options[this.id] = parseInt(this.value);
	});
	/* end monitor */

	/* begin controls */
	$('.play, .pause, .prev, .next').click(function (){
		devSlider[$(this).attr('class')]();
	});
	/* end controls */
});