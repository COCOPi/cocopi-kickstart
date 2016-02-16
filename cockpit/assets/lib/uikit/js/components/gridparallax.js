/*! UIkit 2.24.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-grid-parallax", ["uikit"], function(){
            return component || addon(UIkit);
        });
    }

})(function(UI){

    var parallaxes  = [], checkParallaxes = function() {

            requestAnimationFrame(function(){
                for (var i=0; i < parallaxes.length; i++) {
                    parallaxes[i].process();
                }
            });
        };


    UI.component('gridparallax', {

        defaults: {
            target   : false,
            smooth   : 300,
            diff     : 400
        },

        boot: function() {

            // listen to scroll and resize
            UI.$doc.on("scrolling.uk.document", checkParallaxes);
            UI.$win.on("load resize orientationchange", UI.Utils.debounce(function(){
                checkParallaxes();
            }, 50));

            // init code
            UI.ready(function(context) {

                UI.$('[data-uk-grid-parallax]', context).each(function() {

                    var parallax = UI.$(this);

                    if (!parallax.data("gridparallax")) {
                        UI.gridparallax(parallax, UI.Utils.options(parallax.attr("data-uk-grid-parallax")));
                    }
                });
            });
        },

        init: function() {

            this.initItems().process();
            this.element.css('margin-bottom', this.options.diff + parseInt(this.element.css('margin-bottom')));
            parallaxes.push(this);

        },

        initItems: function() {

            var smooth = this.options.smooth;

            this.items = (this.options.target ? this.element.find(this.options.target) : this.element.children()).each(function(){
                UI.$(this).css({
                    transition: 'transform '+smooth+'ms linear',
                    transform: ''
                });
            });

            return this;
        },

        process: function() {

            var percent  = percentageInViewport(this.element),
                columns  = getcolumns(this.element),
                items    = this.items,
                mods     = [(columns-1)];

            if (columns == 1 || !percent) {
                items.css('transform', '');
                return;
            }

            while(mods.length < columns) {
               if(!(mods[mods.length-1] - 2)) break;
               mods.push(mods[mods.length-1] - 2);
            }

            var diff  = this.options.diff,
                percentdiff = percent*diff;

            items.each(function(idx, ele, translate){
                translate = mods.indexOf((idx+1) % columns) != -1 ? percentdiff : percentdiff / 4;
                UI.$(this).css('transform', 'translate3d(0,'+(translate)+'px, 0)');
            });
        }

    });


    function getcolumns(element) {

        var children = element.children(),
            first    = children.filter(':visible:first'),
            top      = first[0].offsetTop + first.outerHeight();

        for (var column=0;column<children.length;column++) {
            if (children[column].offsetTop >= top)  break;
        }

        return column || 1;
    }

    function percentageInViewport(element) {

        var top       = element.offset().top,
            height    = element.outerHeight(),
            scrolltop = UIkit.$win.scrollTop(),
            wh        = window.innerHeight,
            distance, percentage, percent;

        if (top > (scrolltop + wh)) {
            percent = 0;
        } else if ((top + height) < scrolltop) {
            percent = 1;
        } else {

            if ((top + height) < wh) {
                percent = (scrolltop < wh ? scrolltop : scrolltop - wh) / (top+height);
            } else {

                distance   = (scrolltop + wh) - top;
                percentage = Math.round(distance / ((wh + height) / 100));
                percent    = percentage/100;
            }
        }

        return percent;
    }
});