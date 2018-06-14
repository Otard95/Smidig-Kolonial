document.addEventListener('DOMContentLoaded', () => {

  const filters = document.querySelectorAll('.filter');
  const filter_overlay = document.querySelector('.filter-overlay');
  const overlay_shadow = document.querySelector('.shadow');
  const filter_open_btn = document.getElementById('product-filter-open-btn');
  const filter_close_btn = document.getElementById('filer-menu-close-btn');

  filters.forEach(filter => {

    filter.querySelector('.filter-header').addEventListener('click', () => {
      filter.classList.toggle('show');
    })

  });

  filter_open_btn.addEventListener('click', () => {

    filter_overlay.classList.add('show');
    overlay_shadow.classList.add('show');

  });

  filter_close_btn.addEventListener('click', () => {

    filter_overlay.classList.remove('show');
    overlay_shadow.classList.remove('show');

  });

});