/*!
 * jQuery Scrollspy Plugin
 * Author: Daniel Barreto
 * Licensed under the MIT license
 */


;(function ( $, window, document, undefined ) {

    var scrollspyMethods = {
        init: function(options) {
            var options = $.extend({
                min: null,
                max: null,
                mode: 'vertical',
                buffer: 0,
                container: window,
                onEnter: options.onEnter ? options.onEnter : [],
                onLeave: options.onLeave ? options.onLeave : [],
                onTick: options.onTick ? options.onTick : []
            }, options);

            if (options.max === null && options.min === null) {  // both were made without size, so windows size might matter.
                options.max = options.min = 0;
                $(options.container).bind('resize.scrollspy', {'element': this}, scrollspyMethods.resize);
            }
            this.data('scrollspy.options', options);

            return this.each(function(i) { scrollspyMethods.initElement(this); });
        },

        initElement: function(element) {
            var options = $(element).data('scrollspy.options');
            var $container = $(options.container);
            var elementPosition = $(element).position();

            if (options.min == 0)  // default: vertical
                options.min = elementPosition.top;
            if (options.max == 0)  // default: vertical
                options.max = elementPosition.top + $(element).height();

            // check if max/min are callables
            // fix max
            if ($.isFunction(options.max)) options.max = options.max();
            if (options.max == 0)
                options.max = (options.mode == 'vertical') ? $container.height() : $container.outerWidth() + $(element).outerWidth();

            // fix min
            if ($.isFunction(options.min)) options.min = options.min();

            $(element).data('scrollspy.options', options);

            $container.bind('scroll.scrollspy', {'element': element}, scrollspyMethods.watchScroll);
        },

        resize: function(event) {
            var element = event.data.element;
            var options = element.data('scrollspy.options');
            var elementPosition = $(element).position();
            options.min = elementPosition.top;
            options.max = elementPosition.top + $(element).height();
            element.data('scrollspy.options', options);
        },

        watchScroll: function(event) {
            var element = event.data.element;
            var options = $(element).data('scrollspy.options');
            var $container = $(options.container);
            var inside = false;
            var enters = leaves = 0;

            // gets the element position against the container
            var position = {top: $container.scrollTop(), left: $container.scrollLeft()};
            var xy = (options.mode == 'vertical') ? position.top + options.buffer : position.left + options.buffer;

            // if we have reached the minimum bound but are below the max ...
            if (xy >= options.min && xy <= options.max){
                // trigger enter event
                if (!inside) {
                    inside = true;
                    enters++;

                    // fire enter event
                    $(element).trigger('scrollEnter', { position: position });
                    if ($.isFunction(options.onEnter)) options.onEnter(element, position);
                }

                // triger tick event
                $(element).trigger('scrollTick', { position: position, inside: inside, enters: enters, leaves: leaves });
                if ($.isFunction(options.onTick)) options.onTick(element, position, inside, enters, leaves);
            } else {
                if (inside) {
                    inside = false;
                    leaves++;

                    // trigger leave event
                    $(element).trigger('scrollLeave', {position: position, leaves: leaves});
                    if ($.isFunction(options.onLeave)) options.onLeave(element, position);
                }
            }
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
