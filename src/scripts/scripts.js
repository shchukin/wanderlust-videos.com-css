(function($) {
    $(document).ready(function() {

        /* Global constants  */

        let isDesktop;

        function initGlobalConstant() {
            isDesktop = window.matchMedia("(min-width: 740px)").matches;
        }

        initGlobalConstant();
        window.addEventListener('resize', initGlobalConstant);



        /* Select placeholder */
        function selectPlaceholder($element) {
            if ($element.val() === 'placeholder') {
                $element.parent('.input').addClass('input--placeholder-is-chosen');
            } else {
                $element.parent('.input').removeClass('input--placeholder-is-chosen');
            }
        }

        $('select.input__widget').each(function () {
            selectPlaceholder($(this));
        }).on('change', function () {
            selectPlaceholder($(this));
        });

        /* Expanding textarea */
        function expandTextarea($element) {
            $element.css('height', 'auto');
            $element.css('height', ($element[0].scrollHeight + 2 * parseInt($element.css('border-width'), 10)) + 'px');
        }

        $('.input--expandable .input__widget').each(function () {
            expandTextarea($(this));
        }).on('input', function () {
            expandTextarea($(this));
        });

        /* Error field */
        $('.input__widget').on('focus', function () {
            $(this).parents('.input').removeClass('input--error');
            $(this).parents('.input').nextUntil(':not(.helper--error)').remove();
        });


        /* Input Mask */
        $('[type="tel"]').inputmask({
            alias: 'phoneru',
        });


        /* Magnific Popup */
        $('.mfp-handler').magnificPopup({
            type: 'inline',
            removalDelay: 200,
            showCloseBtn: false
        });


        /* Accordion */

        $('.accordion__handler').on('click', function() {
            const $item = $(this).closest('.accordion__item');
            const $accordion = $item.closest('.accordion');
            const $accordionBody = $item.closest('.accordion__body');
            const index = $item.index();
            const allowAllClosed = $accordion.hasClass('accordion--allow-all-closed');
            const $preview = $accordion.find('.accordion__preview');
            const $header = $('.header');
            const headerHeight = $header.length ? $header.outerHeight() : 0;
            const slideAnimationTime = 300;

            if (allowAllClosed || !isDesktop) {
                // Logic for accordion where all items can be closed
                if ($item.hasClass('accordion__item--expanded')) {
                    // Collapse the current item
                    $item.removeClass('accordion__item--expanded')
                      .find('.accordion__dropdown')
                      .slideUp(slideAnimationTime);
                } else {
                    // Expand the current item and collapse others
                    $item.addClass('accordion__item--expanded')
                      .find('.accordion__dropdown')
                      .slideDown(slideAnimationTime);

                    // Scroll to the item with offset for header
                    // Have to do it after timeout because need to wait until things collapsed to get the final cooridinate
                    if(!isDesktop) {
                        setTimeout(function (){
                            $('html, body').animate({
                                scrollTop: $item.offset().top
                            }, 200);
                        }, slideAnimationTime);
                    }


                    $item.siblings('.accordion__item')
                      .removeClass('accordion__item--expanded')
                      .find('.accordion__dropdown')
                      .slideUp(slideAnimationTime);

                    // Update preview if it exists, though unlikely to be used with allowAllClosed
                    if ($preview.length) {
                        $preview.find('.accordion__slide')
                          .removeClass('accordion__slide--current')
                          .fadeOut(slideAnimationTime);

                        $preview.find('.accordion__slide')
                          .eq(index)
                          .addClass('accordion__slide--current')
                          .fadeIn(slideAnimationTime);
                    }
                }
            } else {
                // Logic for accordion where one item is always active
                if ($item.hasClass('accordion__item--expanded')) {
                    return; // Ignore click on active item
                }

                // Expand the current item and collapse others
                $item.addClass('accordion__item--expanded')
                  .find('.accordion__dropdown')
                  .slideDown(slideAnimationTime);

                // Scroll to the item with offset for header
                // Have to do it after timeout because need to wait until things collapsed to get the final cooridinate
                if(!isDesktop) {
                    setTimeout(function (){
                        $('html, body').animate({
                            scrollTop: $item.offset().top
                        }, 200);
                    }, slideAnimationTime);
                }

                $item.siblings('.accordion__item')
                  .removeClass('accordion__item--expanded')
                  .find('.accordion__dropdown')
                  .slideUp(slideAnimationTime);

                // Update preview if it exists
                if ($preview.length) {
                    $preview.find('.accordion__slide')
                      .removeClass('accordion__slide--current')
                      .fadeOut(slideAnimationTime);

                    $preview.find('.accordion__slide')
                      .eq(index)
                      .addClass('accordion__slide--current')
                      .fadeIn(slideAnimationTime);
                }
            }
        });

    });
})(jQuery);
