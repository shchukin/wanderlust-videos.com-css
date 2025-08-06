(function($) {
    $(document).ready(function() {

        /* Global constants  */

        const $html = $('html');
        let isDesktop;
        let isMobile;
        let headerHeight;

        function initGlobalConstant() {
            isDesktop = window.matchMedia("(min-width: 740px)").matches;
            isMobile = !isDesktop;
            headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0;
        }

        initGlobalConstant();
        window.addEventListener('resize', initGlobalConstant);


        /* Page Scrolled */

        $(window).on('scroll', isPageScrolled);
        $(document).ready(isPageScrolled);

        function isPageScrolled() {
            if (! $html.hasClass('burger-expanded')) { /* This condition is important: when burger is expanded we still need to know was the page scrolled or not,
                                                          to keep pre-header or not. See .page-scrolled.burger-expanded .pre-header { display: none;} */
                if ($(window).scrollTop() > 10) {
                    $html.addClass('page-scrolled');
                } else {
                    $html.removeClass('page-scrolled');
                }
            }
        }


        /* Pre-header */
        $('.pre-header__close').on('click', function () {
            $(this).closest('.pre-header').remove();
        })


        /* Burger */

        let rememberedPageScrollPosition = 0;

        $('.header__toggler').on('click', function () {

            if( ! $html.hasClass('burger-expanded') ) {
                rememberedPageScrollPosition = $(window).scrollTop(); /* Запомнить скролл пользователя, так как display: none на .page его сбросит (смотри .burger-expanded .page) */
                $html.addClass('burger-expanded');
                $(window).scrollTop(0); /* При открытии меню его скролл должен быть в начале */
            } else {
                $html.removeClass('burger-expanded');
                $(window).scrollTop(rememberedPageScrollPosition);/* При закрытии меню скролл должен быть там, где пользователь его оставил */
            }
        });

        /* Close burger by click under navigation (expanded header) */
        $(document).on('click', function (event) {
            if (!$(event.target).closest('.header').length) {
                $html.removeClass('burger-expanded');
            }
        });


        /* Accordion */

        $('.accordion__handler').on('click', function() {
            const $item = $(this).closest('.accordion__item');
            const $accordion = $item.closest('.accordion');
            const index = $item.index();
            const $preview = $accordion.find('.accordion__desktop-preview');
            const $header = $('.header');
            const expandingAnimationTime = 300;

            /* On smartphone, all the accordions behaves the same.
             * On desktop default accordion also behaves the same but .accordion--steps and .accordion--faq are exception.
             * Their behaviour is written inside "else" down below
             */
            if (isMobile || (!$accordion.hasClass('accordion--steps') && !$accordion.hasClass('accordion--faq'))) {

                /* This is pretty traditional logic: opening one item closes the others.
                 * Closing the current item is allowed:
                 */

                /* Close the current item if user want that */
                if ($item.hasClass('accordion__item--expanded')) {
                    $item.removeClass('accordion__item--expanded')
                      .find('.accordion__dropdown')
                      .slideUp(expandingAnimationTime);
                    return;
                }

                /* Expand self */
                $item.addClass('accordion__item--expanded')
                  .find('.accordion__dropdown')
                  .slideDown(expandingAnimationTime);

                /* Close siblings */
                $item.siblings('.accordion__item')
                  .removeClass('accordion__item--expanded')
                  .find('.accordion__dropdown')
                  .slideUp(expandingAnimationTime);

                /* Scroll document the way that currently open question will be on top of the screen
                 * This is necessary in the case if the item above is closing moving newly open question
                 * behind the screen. Note that to calculate coordinates correctly you have to run it
                 * after everything stop moving.
                 */
                if(isMobile) {
                    setTimeout(function (){
                        $('html, body').animate({
                            scrollTop: $item.offset().top - headerHeight + 2 /* +2 is to hide the border behind the screen */
                        }, 200);
                    }, expandingAnimationTime);
                }
            }

            /* Special behavior for .accordion--steps (desktop only) */
            else if ($accordion.hasClass('accordion--steps') && isDesktop) {

                /* Can't close current item because whole section, including slideshow will collapse */
                if ($item.hasClass('accordion__item--expanded')) {
                    return;
                }

                /* Open itself */
                $item.addClass('accordion__item--expanded')
                  .find('.accordion__dropdown')
                  .slideDown(expandingAnimationTime);

                /* Close siblings */
                $item.siblings('.accordion__item')
                  .removeClass('accordion__item--expanded')
                  .find('.accordion__dropdown')
                  .slideUp(expandingAnimationTime);

                /* Sync with images slideshow */
                if ($preview.length) {
                    $preview.find('.accordion__slide')
                      .removeClass('accordion__slide--current')
                      .fadeOut(expandingAnimationTime);

                    $preview.find('.accordion__slide')
                      .eq(index)
                      .addClass('accordion__slide--current')
                      .fadeIn(expandingAnimationTime);
                }
            }

            /* Special behavior for accordion--faq (desktop only) */
            else if ($accordion.hasClass('accordion--faq') && isDesktop) {

                if ($item.hasClass('accordion__item--expanded')) {
                    $item.removeClass('accordion__item--expanded')
                      .find('.accordion__dropdown')
                      .slideUp(expandingAnimationTime);
                } else {
                    $item.addClass('accordion__item--expanded')
                      .find('.accordion__dropdown')
                      .slideDown(expandingAnimationTime);
                }
            }
        });


        /* Team: add container--wid if 11+ members */

        const $teamList = $('.team__list');

        if ($teamList.find('.team__member').length >= 11) {
            $teamList.closest('.container').addClass('container--wide');
        }


        /* Youtube Preview Player */

        $('.youtube-preview__handler').on('click', function() {
            const ytUrl = $(this).data('yt-url');
            const iframe = $('<iframe>', {
                class: 'youtube-preview__video',
                src: ytUrl + '?autoplay=1',
                allow: 'autoplay; encrypted-media',
                allowfullscreen: true
            });
            $(this).closest('.youtube-preview').empty().append(iframe);
        });


        /* Smooth Scrolling */

        $('.anchor').on('click', function(event) {
            event.preventDefault();
            const $target = $($(this).attr('href'));
            if ($target.length) {
                const targetOffset = $target.offset().top - headerHeight - 30; // 30px extra space before the target
                $('html, body').animate({
                    scrollTop: targetOffset
                }, 800);
            }
        });


        /* Splide */

        if( $('.splide').length ) {

            // Initialize portfolio carousel if it exists
            if( $('.splide--portfolio').length ) {
                new Splide( '.splide--portfolio', {
                    perPage: 3,
                    gap: 30,
                    pagination: false,
                    breakpoints: {
                        740: {
                            perPage: 1,
                            pagination: true
                        },
                    }
                } ).mount();
            }

            // Initialize tools carousel if it exists
            if( $('.splide--tools').length ) {
                new Splide( '.splide--tools', {
                    perPage: 4,
                    gap: 30,
                    pagination: false,
                    breakpoints: {
                        740: {
                            perPage: 1,
                            pagination: true
                        },
                    }
                } ).mount();
            }

            // Initialize love carousel if it exists
            if( $('.splide--love').length ) {
                new Splide( '.splide--love', {
                    perPage: 4,
                    gap: 30,
                    pagination: false,
                    breakpoints: {
                        740: {
                            perPage: 1,
                            pagination: true
                        },
                    }
                } ).mount();
            }

        }

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


        /* Password eye */
        $('.input__show-password').on('click', function() {
            const $icon = $(this).find('.icon');
            const $input = $(this).parents('.input').find('.input__widget');

            if ($input.attr('type') === 'password') {
                $icon.text('visibility');
                $input.attr('type', 'text');
            } else {
                $icon.text('visibility_off');
                $input.attr('type', 'password');
            }
        });
    });
})(jQuery);
