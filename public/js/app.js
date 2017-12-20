function start() {
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

}

$(document).ready(start);
