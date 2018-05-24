$(document).ready(() => {
  let boolean = true;

  $(".week-add-button").click(function() {
    if (boolean) {
      $(".week-add-button").animate({
        bottom: '29em'
      }, 1000);
      boolean = false;
    } else {
      $(".week-add-button").animate({
        bottom: 0
      }, 1000);
      boolean = true;
    }
  });

  $('.btn-week-day').on('click', function() {
    let month = $(this).data('month')
    let day = $(this).html()
    window.location.href = `/kalender/${month}-${day}`
  })

  $('#pil-icon').on('click', function() {
    let month = $(this).data('month')
    window.location.href = `/kalender/${month}`
  })
});
