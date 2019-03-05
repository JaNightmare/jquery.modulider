(function($) {
    /*!
     * jQuery Modulider - Debug plugin
     *
     * Version 0.2.3
     * Copyright José Almeida (http://joseafga.com.br)
     * MIT License
     *
     * Description:
     *  Simple debugger for log triggered events from Modulider
     *
     * Syntax:
     *  $('selector').modulider([options]).modDebug([fn]);
     *  Function fn, function called to display message
     */
    $.fn.modDebug = function(fn) {
        fn = fn || (window.console ? console.log : false) || $.noop;

        // fix webkit console
        var log = $.proxy(function() {
            var args = Array.prototype.slice.call(arguments);
            try {
                fn.apply(this, args);
            } catch (e) {
                fn.apply(console, args);
            }
        }, this);

        // create function for detach all debug events
        this.debugDestroy = function() {
            this.each(function() {
                $(this).off('.debug');
                log('Debug Destroyed', this);
            });
            return this;
        };

        // attach events
        return this.each(function() {
            log('Debug Initialized', this);
            $(this).on({
                'onPlay.debug onPause.debug onNext.debug onPrev.debug onFinishChanging.debug': function(e) {
                    log(e.type);
                },
                'onStartChanging.debug': function(e, current, next) {
                    log(e.type + ' - ' + current + ' to ' + next);
                }
            });
        });
    };

    /*!
     * jQuery Modulider - Key Navigation plugin
     *
     * Version 0.1
     * Copyright José Almeida (http://joseafga.com.br)
     * Creative Commons Attribution 3.0 Unported License (http://creativecommons.org/licenses/by/3.0/)
     *
     * Description:
     *  when press a key the corresponding function is performed
     *  created for Modulider but may work in other ways
     *
     * Syntax:
     *  $('selector').modulider([options]).modKeyNav([keys]);
     *  Object keys, keyCode with string function name
     */
    $.fn.modKeyNav = function(keys) {
        var slider = this;
        // default options
        keys = keys || {
            '37': 'prev', // <- go to previous slide
            '39': 'next' // -> go to next slide
        };

        $(window).keydown(function(e) {
            for (var k in keys) {
                if (e.keyCode == k) {
                    e.preventDefault();
                    slider[keys[k]]();
                    break;
                }
            }
        });

        return this;
    };

    /*!
     * jQuery Modulider - Caption Hide plugin
     *
     * Version 0.1
     * Copyright José Almeida (http://joseafga.com.br)
     * Creative Commons Attribution 3.0 Unported License (http://creativecommons.org/licenses/by/3.0/)
     *
     * Description:
     *
     * Syntax:
     *  $('selector').modulider([options]);
     */
    $.fn.modCaptionHide = function() {
        var slider = this;
        var isOver = false;

        slider.on('mouseenter',
            function() {
                isOver = true;
                slider.options.captions.eq(slider.currSlide).slideUp(500);
            }).on('onFinishChanging',
            function() {
                setTimeout(function() {
                    if (isOver) slider.trigger('mouseenter');
                }, slider.options.speed);
            }).on('mouseleave',
            function() {
                isOver = false;
                slider.options.captions.eq(slider.currSlide).slideDown(500);
            }).on('onStartChanging', function() {
            slider.options.captions.eq(slider.currSlide).slideDown(500);
        });

        return this;
    };
})(jQuery);
