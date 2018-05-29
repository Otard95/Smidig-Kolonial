$(document).ready(() => {
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
