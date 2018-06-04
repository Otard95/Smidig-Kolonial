document.addEventListener("DOMContentLoaded", () => {
  let backarrow = document.querySelectorAll('#pil-icon')[0]
  let weekday = document.querySelectorAll('.btn-week-day')

  // Eventlistener for presented weekdays
  weekday.forEach(element => {
    element.addEventListener('click', el => {
      let month = element.dataset.month
      let day = element.innerHTML
      window.location.href = `/kalender/liste/${month}-${day}`
    })
  })

  // Eventlistener to get back to calendar
  backarrow.addEventListener('click', el => {
    let month = backarrow.dataset.month
    window.location.href = `/kalender/${month}`
  })
})