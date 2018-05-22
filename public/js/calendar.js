/*jshint esversion: 6 */
/*jshint node: true */

let DOM_burger_button, DOM_side_overlay, DOM_content, DOM_footer, DOM_shadow;

$(document).ready(() => {

  // ## Click events for side panel
  DOM_burger_button = $('.burger');
  DOM_content       = $('.container');
  DOM_side_overlay  = $('.side-overlay');
  DOM_footer        = $('footer');
  DOM_shadow        = $('.shadow');

  DOM_burger_button.click(() => {

    DOM_burger_button.toggleClass('close');
    DOM_content.toggleClass('overlay');
    DOM_side_overlay.toggleClass('show');
    DOM_footer.toggleClass('overlay');
    DOM_shadow.toggleClass('show');

  });

  // fit images in shoppinglist info
  $('.shoppinglist-box').each(function (i) {

    let img_container = $(this).find('.image-container');
    let img = img_container.find('img');
    let h = img.height();
    let w = img.width();

    let r = h / w;

    if (r < 0) {
      img.css('width', '100%');
    } else {
      img.css('height', '100%');
    }

  });

  
  $('.calendar-btn').on('click', function() {
    let day = $(this).data('day'), month = $(this).data('month')
    // Kobler sammen med week data

    if (!day) return $(this).off()
    window.location.href = `kalender/${month}-${day}`
  })

});
