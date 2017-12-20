let DOM_burger_button;
let DOM_side_overlay;
let DOM_content;
let bool_overlay_open = false;

window.onload=function(){
  DOM_burger_button = document.getElementsByClassName('burger')[0];
  DOM_content = document.getElementsByClassName('container')[0];
  DOM_side_overlay = document.getElementsByClassName('side-overlay')[0];

  DOM_burger_button.addEventListener('click', () => {
    if (!bool_overlay_open){
      console.log('open');
      bool_overlay_open = true;
      DOM_side_overlay.className += ' show';
      DOM_content.className += ' overlay';
      DOM_burger_button.className += ' close';
    }
    else {
      console.log('close');
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
}
