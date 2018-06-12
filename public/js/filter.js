document.addEventListener('DOMContentLoaded', () => {

  let filters = document.querySelectorAll('.filter');
  let filter_overlay = document.querySelector('.filter-overlay');

  filters.forEach(filter => {

    filter.querySelector('.filter-header').addEventListener('click', () => {
      filter.classList.toggle('show');
    })

  });

});