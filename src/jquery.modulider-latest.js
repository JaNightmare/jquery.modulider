/*!
 * jQuery Modulider - Modular Slider
 *
 * Version 0.11.0
 * Copyright José Almeida (http://joseafga.com.br)
 * Creative Commons Attribution 3.0 Unported License (http://creativecommons.org/licenses/by/3.0/)
 * 
 * Description: 
 *  Modular, Easy and Flexible Slider for jQuery
 *  
 * Syntax:
 *  $(selector).modulider([options]);
 *  Object options
 * 
 * Depends:
 *	jQuery v1.7 or higher, http://jquery.com/
 */
(function($){
	/** =================== *
	 * CLASS
	 * ==================== */
	function Modulider($slider, opts){
		var o = $.extend({
			slides: $slider.children().first().children(),
			captions: $(), // captions element must be within slides and with class "caption"
			nav: $slider.children().last() // if you don't want thumbnails put false
		}, $.fn.modulider.defaults, opts || {});

		var ms = $.extend({}, $slider, {
			currSlide: 0,
			nextSlide: 0,
			running: false,
			inTransition: false,
			_ap: false, // overall autoplay: set true within the module to does not run default autoplay

			// slider options
			options: o,

			_init: function(){
				// distributes captions and set display for slides
				for (var i = 0, len = o.slides.length; i < len; i++) {
					var slide = o.slides.eq(i);
					if (i !== this.currSlide)
						slide.css('display', 'none');
					o.captions.push(slide.children('.caption')[0]);
				}

				// call all functions from options
				this.implement(o.modules || {});

				// autoplay option
				if (o.autoplay && !this._ap)
					this.play();

				return this;
			},

			_startTimer: function(){
				if (this.running) {
					this._clearTimer(); // prevent start multiples timing events
					// start interval
					this.timer = setTimeout($.proxy(function(){
						if (!this.inTransition)
							this.goTo(this.currSlide + 1);
					}, this), o.delay);
				}
				return this;
			},

			// clears current timer
			_clearTimer: function(){
				clearTimeout(this.timer);
				return this;
			},

			// modularity
			implement: obj2param(function(mod, value){
				var mods = $.fn.modulider.modules; // all modules
				if ($.isFunction(value))
					value = value.call(mods, index, mod);

				if (mod in mods && value !== false)
					mods[mod].call(this, typeof value === 'object' ? value || {} : {});

				return this;
			}),

			changeSlide: function(){
				this.trigger('onStartChanging', [this.nextSlide, this.currSlide]);
				// get next/prev slide and set z-index
				var next = o.slides.eq(this.nextSlide).css('zIndex', 1),
					prev = o.slides.eq(this.currSlide).css('zIndex', 0);
				// set caption inside next/prev
				next.caption = o.captions.eq(this.nextSlide).css('display', 'none');
				prev.caption = o.captions.eq(this.currSlide);
				this.currSlide = this.nextSlide;
				this.inTransition = true;

				$.fn.modulider.transitions[o.transition](o, next, prev); // start transition

				// callback logic inspired on jQuery UI Effects Explode
				// run approximately when the slide transition have finished
				setTimeout($.proxy(function(){
					prev.css('display', 'none');
					this.inTransition = false;
					this.trigger('onFinishChanging');
					if (this.currSlide != this.nextSlide)
						this._startTimer().changeSlide(); else
						this._startTimer();
				}, this), o.speed);
				return this;
			},

			play: function(){
				this.trigger('onPlay');
				this.running = true;
				return this._startTimer();
			},

			pause: function(){
				this.trigger('onPause');
				this.running = false;
				return this._clearTimer();
			},

			// show arbitrary slide
			goTo: function(to){
				// fixes the number to the range of slides
				to = (to >= o.slides.length) ? 0 : (to < 0) ? o.slides.length - 1 : to;
				if (this.currSlide != to) {
					this.nextSlide = to;
					if (!this.inTransition)
						this.changeSlide(); // change slide if transition is not in progress
				}
				return this;
			},

			// show next slide
			next: function(){
				this.trigger('onNext');
				return this.goTo(this.currSlide + 1);
			},

			// show previous slide
			prev: function(){
				this.trigger('onPrev');
				return this.goTo(this.currSlide - 1);
			}
		});

		return ms._init();
	}

	/** =================== *
	 * JQUERY PLUGIN
	 * ==================== */
	$.fn.modulider = function(opts){
		var sliders = null;

		this.each(function(index){
			var $slider = $(this),
				ms;

			// if element have an instance of plugin
			if ($slider.data('modulider')) {
				// retrieves the previously stored data
				ms = $slider.data('modulider');
			} else {
				ms = new Modulider($slider, opts);
				// initialize slider and store data
				$slider.data('modulider', ms);
			}

			if (sliders == null)
				sliders = ms; // make first slider functional
			else
				sliders.push(this); // push element only of the others
		});

		return sliders;
	};

	/** =================== *
	 * DEFAULTS
	 * ==================== */
	$.fn.modulider.defaults = {
		delay: 5000, // time for changing slides (milliseconds)
		speed: 500, // transition speed (milliseconds)
		transition: 'fade', // transition ($.fn.modulider.transitions)
		transitionCaption: 'none', // ???
		easing: 'linear',
		randomList: [], // list of possible transitions (used for random transition)
		autoplay: true // if false starts paused
		//, modules: {}
	};

	/** =================== *
	 * TRANSITIONS
	 * 9 transitions based on built-in jQuery effects + "random" and "none"
	 *
	 * if you will animate the caption must hide it before
	 * previous slide hide automatically in options.speed (milliseconds)
	 * ==================== */
	$.fn.modulider.transitions = obj2param(function(name, fn, add){
		var _trans = {};

		add || add === undefined && $.fn.modulider.defaults.randomList.push(name); // add to random list
		$.fn.modulider.transitions[name] = fn;
	});

	$.fn.modulider.transitions({
		random: function(opts, next, prev){
			// get a random value from options.randomList array
			this[opts.randomList[Math.floor(Math.random() * opts.randomList.length)]](opts, next, prev);
		},
		none: function(speed, next){
			next.css('display', '').caption.css('display', '');
		}
	}, false);

	// add multiple transitions
	var trans = {
		fade: ['fadeIn', 'fadeOut'],
		slide: ['slideDown', 'slideUp'],
		show: ['show', 'hide']
	};

	$.each(trans, function(name, fix){
		$.fn.modulider.transitions(name, function(opts, next){
			next.caption.css('visibility', 'hidden'); // ie6 fix

			next[fix[0]](opts.speed, opts.easing, function(){
				next.caption.css('visibility', 'visible'); // ie6 fix
				next.caption[trans[opts.transitionCaption] ? trans[opts.transitionCaption][0] : fix[0]](opts.speed / 2, opts.easing); // caption show in half time
				//$.fn.modulider.transitions._caption.show.call(next.caption);
			});
		});

		$.fn.modulider.transitions('cross' + name, function(opts, next, prev){
			prev[fix[1]](opts.speed, opts.easing);
			this[name](opts, next);
		});

		$.fn.modulider.transitions(name + 'background', function(opts, next, prev){
			var o = $.extend({}, opts, {
				speed: opts.speed / 2
			}); // copy options
			prev[fix[1]](o.speed, o.easing, $.proxy(function(){
				this[name](o, next);
			}, this));
		});
	});

	/** =================== *
	 * MODULES
	 * ==================== */
	$.fn.modulider.modules = {
		/**
		 * NAVIGATION
		 *
		 * options:
		 *   Selector nav
		 *   Boolean autoNav
		 */
		navigation: function(opts){
			opts.nav = this.find(opts.nav || '.navigation');

			// auto generete thumbs
			if (opts.autoNav) {
				// add thumbnails
				var thumbs = '';
				this.options.slides.each(function(){
					thumbs += ('<div class="thumb"><img src="' + $(this).find('img').attr('src') + '" alt="thumb" /></div>');
				});
				opts.nav.append(thumbs);
			}

			var childs = opts.nav.children();
			// add class 'current' to item nav of current slide
			childs.eq(this.currSlide).addClass('current');
			this.on('onStartChanging.modulider', function(e, next, prev){
				childs.eq(prev).removeClass('current');
				childs.eq(next).addClass('current');
			});
			// function when click on nav item
			childs.on('click.modulider', this, function(e){
				e.data.goTo($(this).index());
			});
		},

		/**
		 * MOUSE ENTER/LEAVE
		 */
		slideEvents: function(){
			this.options.slides.on('mouseenter.modulider', $.proxy(this.pause, this)).on('mouseleave.mSlider', $.proxy(this.play, this));
		},

		/**
		 * PRELOAD
		 *
		 * options:
		 *   String(HTML) template
		 */
		preload: function(template){
			template = template || '<div class="preload"><div class="progress"><div class="progress-bar"></div></div></div>';
			this._ap = true; // does not run default autoplay

			var $this = this,
				$load = $(template).appendTo(this),
				$bar = $load.find('.progress-bar'),
				$imgs = this.find('img'), imgLen = $imgs.length, imgLoaded = 0;

			$imgs.each(function(){
				this.complete ? updateProgress() : this.onload = this.onerror = updateProgress;
			});

			function updateProgress(){
				imgLoaded++;
				$bar.css('width', Math.round(imgLoaded * 100 / imgLen) + '%');

				if (imgLoaded == imgLen)
					$load.fadeOut($this.options.speed, function(){
						if ($this.options.autoplay)
							$this.play(); // autoplay option
					});
			}
		}
	};

	/** =================== *
	 * PRIVATE - OBJECT TO PARAMETER
	 * checks if parameter is a object and distribute in function key:value with another parameters
	 * ==================== */
	function obj2param(fn){
		return function(obj){
			if (typeof obj === 'object') {
				var args = Array.prototype.slice.call(arguments, 1);
				for (var k in obj) {
					fn.apply(this, $.merge([k, obj[k]], args));
				}
			} else
				fn.apply(this, arguments);
		}
	}
})(jQuery);