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

        $('.accordion--steps .accordion__handler').on('click', function() {
            const $item = $(this).closest('.accordion__item');
            const $accordion = $item.closest('.accordion');
            const index = $item.index();
            const $preview = $accordion.find('.accordion__desktop-preview');
            const $header = $('.header');
            const headerHeight = $header.length ? $header.outerHeight() : 0;
            const expandingAnimationTime = 300;

            // On desktop one item is always active
            if (isDesktop) {

                if ($item.hasClass('accordion__item--expanded')) {
                    return;
                }

                $item.addClass('accordion__item--expanded')
                  .find('.accordion__dropdown')
                  .slideDown(expandingAnimationTime);

                /* Close siblings */
                $item.siblings('.accordion__item')
                  .removeClass('accordion__item--expanded')
                  .find('.accordion__dropdown')
                  .slideUp(expandingAnimationTime);

                /* Images slideshow */
                if ($preview.length) {
                    $preview.find('.accordion__slide')
                      .removeClass('accordion__slide--current')
                      .fadeOut(expandingAnimationTime);

                    $preview.find('.accordion__slide')
                      .eq(index)
                      .addClass('accordion__slide--current')
                      .fadeIn(expandingAnimationTime);
                }
            } else {

                /* On smartphone logic is more traditional. Images are inside of items now */
                if ($item.hasClass('accordion__item--expanded')) {
                    $item.removeClass('accordion__item--expanded')
                      .find('.accordion__dropdown')
                      .slideUp(expandingAnimationTime);
                } else {

                    $item.addClass('accordion__item--expanded')
                      .find('.accordion__dropdown')
                      .slideDown(expandingAnimationTime);

                    $item.siblings('.accordion__item')
                      .removeClass('accordion__item--expanded')
                      .find('.accordion__dropdown')
                      .slideUp(expandingAnimationTime);

                    // Scroll to the item with offset for header
                    // Have to do it after timeout because need to wait until things collapsed to get the final cooridinate
                    if(!isDesktop) {
                        setTimeout(function (){
                            $('html, body').animate({
                                scrollTop: $item.offset().top + 1 /* plus one is to hide border */
                            }, 200);
                        }, expandingAnimationTime);
                    }

                }
            }
        });


        $('.accordion--faq .accordion__handler').on('click', function() {
            const $item = $(this).closest('.accordion__item');
            const $header = $('.header');
            const headerHeight = $header.length ? $header.outerHeight() : 0;
            const expandingAnimationTime = 300;

            if ($item.hasClass('accordion__item--expanded')) {
                $item.removeClass('accordion__item--expanded')
                  .find('.accordion__dropdown')
                  .slideUp(expandingAnimationTime);
            } else {

                $item.addClass('accordion__item--expanded')
                  .find('.accordion__dropdown')
                  .slideDown(expandingAnimationTime);

                // Scroll to the item with offset for header
                // Have to do it after timeout because need to wait until things collapsed to get the final cooridinate
                if(!isDesktop) {
                    setTimeout(function (){
                        $('html, body').animate({
                            scrollTop: $item.offset().top + 1 /* plus one is to hide border */
                        }, 200);
                    }, expandingAnimationTime);
                }

            }
        });

    });
})(jQuery);
