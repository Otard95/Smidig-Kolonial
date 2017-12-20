function start() {
  let weekbtn, weeklist;
  let boolean = true;

  const init = function() {
    const elements = function() {

      if (window.location.pathname === '/uke') {
        weekbtn = document.querySelectorAll('.week-add-button')[0];
        weeklist = document.querySelectorAll('.week-view-list')[0];
      }
    }();
    const events = function() {
      weekbtn.onclick = () => {
        if (boolean) {
          weeklist.style.cssText = `height: 0em`;
          boolean = false;
        } else {
          weeklist.style.cssText = `height: 35em`;
          boolean = true;
        }
      }
    }();
  }();
}

$(document).ready(start);
