/*jshint esversion: 6 */
/*jshint node: true */

let DOM_burger_button, DOM_side_overlay, DOM_content;
let bool_overlay_open = false;

$(window).ready(() => {

  DOM_burger_button = $('.burger')[0];
  DOM_content = $('.container')[0];
  DOM_side_overlay = $('.side-overlay')[0];

  DOM_burger_button.addEventListener('click', () => {

    if (!bool_overlay_open){

      bool_overlay_open = true;

      DOM_side_overlay.className += ' show';
      DOM_content.className += ' overlay';
      DOM_burger_button.className += ' close';

    } else {

      bool_overlay_open = false;

      let cname = DOM_side_overlay.className;
      cname = cname.replace(' show', '');
      DOM_side_overlay.className = cname;

      cname = DOM_content.className;
      cname = cname.replace(' overlay', '');
      DOM_content.className = cname;

      cname = DOM_burger_button.className;
      cname = cname.replace(' close', '');
      DOM_burger_button.className = cname;

    }

  });

});
