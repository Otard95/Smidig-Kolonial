/*jshint esversion: 6 */
/*jshint node: true */

let DOM_burger_button, DOM_side_overlay, DOM_content, DOM_footer, DOM_shadow;
document.addEventListener("DOMContentLoaded", () => {
  DOM_burger_button = document.querySelectorAll('.burger')[0]
  DOM_content = document.querySelectorAll('.container')[0]
  DOM_side_overlay = document.querySelectorAll('.side-overlay')[0]
  DOM_footer = document.querySelectorAll('footer')[0]
  DOM_shadow = document.querySelectorAll('.shadow')[0]

  DOM_burger_button.addEventListener('click', () => {
    DOM_burger_button.classList.toggle('close');
    DOM_content.classList.toggle('overlay');
    DOM_side_overlay.classList.toggle('show');
    DOM_footer.classList.toggle('overlay');
    DOM_shadow.classList.toggle('show');
  })

  // fit images in shoppinglist info
  document.querySelectorAll('.shoppinglist-box').forEach(() => {
    // let img_container = el.find('.image-container')
    let img = document.querySelectorAll('.image-container img')[0]
    let h = img.style.height,
      w = img.style.width
    let r = h / w
    if (r < 0) {
      img.style.width = '100%'
    } else {
      img.style.height = '100%'
    }
  });

  let nextpoiner = document.querySelectorAll('#next-pointer')[0],
    previouspoiner = document.querySelectorAll('#previous-pointer')[0],
    calendarbtn = document.querySelectorAll('.calendar-btn')

  calendarbtn.forEach(element => {
    element.addEventListener('click', () => {
      let day = element.dataset.day,
          month = element.dataset.month
      window.location.href = `/kalender/liste/${month}-${day}`
    })
  })

  previouspoiner.addEventListener('click', () => {
    let month = previouspoiner.dataset.month
    window.location.href = `/kalender/${--month}`
  })

  nextpoiner.addEventListener('click', () => {
    let month = nextpoiner.dataset.month
    window.location.href = `/kalender/${++month}`
  })
})