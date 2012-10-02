/*!
 * jQuery Scrollspy Plugin
 * Author: @sxalexander
 * Licensed under the MIT license
 */


;(function ( $, window, document, undefined ) {

    var scrollspyMethods = {
        init: function(options) {
            var options = $.extend({
                min: 0,
                max: 0,
                mode: 'vertical',
                buffer: 0,
                container: window,
                onEnter: options.onEnter ? options.onEnter : [],
                onLeave: options.onLeave ? options.onLeave : [],
                onTick: options.onTick ? options.onTick : []
            }, options);

            return this.each(function (i) {
                var element = this;
                var elementPosition = $(this).position();
                var $container = $(options.container);
                var mode = options.mode;
                var buffer = options.buffer;
                var enters = leaves = 0;
                var inside = false;

                this.options = options;

                if (this.options.min == 0)  // default: vertical
                    this.options.min = elementPosition.top;
                if (this.options.max == 0)  // default: vertical
                    this.options.max = elementPosition.top + $(this).height();

                // check if max/min are callables
                // fix max
                if ($.isFunction(this.options.max)) this.options.max = this.options.max();
                if (this.options.max == 0)
                    this.options.max = (mode == 'vertical') ? $container.height() : $container.outerWidth() + $(element).outerWidth();

                // fix min
                if ($.isFunction(this.options.min)) this.options.min = this.options.min();

                // add listener to container
                $container.bind('scroll', function(e){
                    var position = {top: $(this).scrollTop(), left: $(this).scrollLeft()};
                    var xy = (mode == 'vertical') ? position.top + buffer : position.left + buffer;

                    // if we have reached the minimum bound but are below the max ...
                    if (xy >= element.options.min && xy <= element.options.max){
                        // trigger enter event
                        if (!inside) {
                            inside = true;
                            enters++;

                            // fire enter event
                            $(element).trigger('scrollEnter', { position: position });
                            if ($.isFunction(element.options.onEnter)) element.options.onEnter(element, position);
                        }

                        // triger tick event
                        $(element).trigger('scrollTick', { position: position, inside: inside, enters: enters, leaves: leaves });
                        if ($.isFunction(element.options.onTick)) element.options.onTick(element, position, inside, enters, leaves);
                    } else {
                        if (inside) {
                            inside = false;
                            leaves++;

                            // trigger leave event
                            $(element).trigger('scrollLeave', {position: position, leaves:leaves});
                            if ($.isFunction(element.options.onLeave)) this.options.onLeave(element, position);
                        }
                    }
                });

            });

        }
    };

    $.fn.scrollspy = function ( method ) {
        if (scrollspyMethods[method]) {
            return scrollspyMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return scrollspyMethods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.scrollspy' );
        }
    };
})( jQuery, window );
