(function($) {
    $(document).ready(function() {

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
            const index = $item.index();
            const allowAllClosed = $accordion.hasClass('accordion--allow-all-closed');
            const $preview = $accordion.find('.accordion__preview');

            if (allowAllClosed) {
                // Логика для аккордеона, где можно закрывать все элементы
                if ($item.hasClass('accordion__item--expanded')) {
                    // Сворачиваем текущий элемент
                    $item.removeClass('accordion__item--expanded')
                      .find('.accordion__dropdown')
                      .slideUp(300);
                } else {
                    // Разворачиваем текущий элемент и сворачиваем остальные
                    $item.addClass('accordion__item--expanded')
                      .find('.accordion__dropdown')
                      .slideDown(300);

                    $item.siblings('.accordion__item')
                      .removeClass('accordion__item--expanded')
                      .find('.accordion__dropdown')
                      .slideUp(300);

                    // Обновляем превью, если есть, хотя в случае allowAllClosed оно вряд ли будет использоваться
                    if ($preview.length) {
                        $preview.find('.accordion__slide')
                          .removeClass('accordion__slide--current')
                          .fadeOut(300);

                        $preview.find('.accordion__slide')
                          .eq(index)
                          .addClass('accordion__slide--current')
                          .fadeIn(300);
                    }
                }
            } else {
                // Логика для аккордеона, где один элемент всегда активен
                if ($item.hasClass('accordion__item--expanded')) {
                    return; // Игнорируем клик на активный элемент
                }

                // Разворачиваем текущий элемент и сворачиваем остальные
                $item.addClass('accordion__item--expanded')
                  .find('.accordion__dropdown')
                  .slideDown(300);

                $item.siblings('.accordion__item')
                  .removeClass('accordion__item--expanded')
                  .find('.accordion__dropdown')
                  .slideUp(300);

                // Обновляем превью, если есть
                if ($preview.length) {
                    $preview.find('.accordion__slide')
                      .removeClass('accordion__slide--current')
                      .fadeOut(300);

                    $preview.find('.accordion__slide')
                      .eq(index)
                      .addClass('accordion__slide--current')
                      .fadeIn(300);
                }
            }
        });

    });
})(jQuery);
