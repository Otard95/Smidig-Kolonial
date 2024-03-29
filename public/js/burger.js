

document.addEventListener("DOMContentLoaded", () => {
  let DOM_burger_button, DOM_side_overlay, DOM_content, DOM_footer, DOM_shadow
  DOM_burger_button = document.querySelectorAll('.burger')[0] || document.querySelectorAll('#burger-toggle-btn')[0]
  DOM_content = document.querySelectorAll('.container')[0]
  DOM_side_overlay = document.querySelectorAll('.side-overlay')[0]
  DOM_footer = document.querySelectorAll('footer')[0]
  DOM_shadow = document.querySelectorAll('.shadow')[0]
  DOM_burger_icon = document.querySelectorAll('.burgermenu-icon')[0]
  DOM_burger_icon_close = document.querySelectorAll('.burgermenu-icon-close')[0]
  DOM_delete_list_btns = document.querySelectorAll('#delete-list-btn');
  DOM_list_name = document.querySelector('#list-name');

  DOM_burger_button.addEventListener('click', () => {
    DOM_burger_button.classList.toggle('close');
    DOM_content.classList.toggle('overlay');
    DOM_side_overlay.classList.toggle('show');
    DOM_footer.classList.toggle('overlay');
    DOM_shadow.classList.toggle('show');
    if (DOM_burger_icon) DOM_burger_icon.classList.toggle('display-sidebar');
    if (DOM_burger_icon_close) DOM_burger_icon_close.classList.toggle('display-sidebar');
  })

  let addListBtn = document.querySelector('#list-add-btn');
  let updateListBtn = document.querySelector('#list-update-btn');
  let burgerlistname = document.querySelector('.burger-list-name');
  let delete_btn = document.querySelector('#delete-btn');

  let list_name
  if (burgerlistname) list_name = burgerlistname.value;
  let can_save = false;
  
  let upcoming = document.querySelectorAll('.upcoming');
  let passed = document.querySelectorAll('.passed');
  
  let upcomingbtn = document.querySelector('.choice-one');
  let passedbtn = document.querySelector('.choice-two');

  if (DOM_list_name) {
    DOM_list_name.addEventListener('click', () => {
      DOM_burger_button.classList.toggle('close');
      DOM_content.classList.toggle('overlay');
      DOM_side_overlay.classList.toggle('show');
      DOM_footer.classList.toggle('overlay');
      DOM_shadow.classList.toggle('show');
      if (DOM_burger_icon) DOM_burger_icon.classList.toggle('display-sidebar');
      if (DOM_burger_icon_close) DOM_burger_icon_close.classList.toggle('display-sidebar');
      burgerlistname.focus();
    })
  }

  if (DOM_delete_list_btns) {
    DOM_delete_list_btns.forEach(i => {
      i.addEventListener('click', async e => {
        
        let el = e.target;

        let encoded_date = parseInt(el.dataset.date);
        let day = encoded_date % 100; encoded_date = Math.floor(encoded_date / 100);
        let mon = encoded_date % 100; encoded_date = Math.floor(encoded_date / 100);
        let year = encoded_date;

        console.log(`day: ${day}; month: ${mon}; year: ${year};`);

        if (typeof ShoppingListModule === 'function') {

          let parent = el.parentElement;
          
          let spinner = ShoppingListModule().createSpinner(32, 32);
          parentElement.appendChild(spinner);
        }

        let res;
        try {
          let http_res = await fetch(`/kalender/liste/${mon}-${day}/delete`, {
            method: 'GET',
            credentials: 'include'
          });
          let res = await http_res.json();
        } catch (e) {
          return;
        }

        window.location = '/kalender';

      });
    });
  }
  
  if (delete_btn) delete_btn.addEventListener('click', async () => {

    if (typeof ShoppingListModule === 'function') {
      let spinner = ShoppingListModule().createSpinner(150,150);
      DOM_side_overlay.appendChild(spinner);
    }

    let res;
    try {
      let http_res = await fetch(window.location.pathname + '/delete', {
        method: 'GET',
        credentials: 'include'
      });
      let res = await http_res.json();
    } catch (e) {
      return;
    }

    window.location = '/kalender';

  });

  if (burgerlistname) {
    burgerlistname.addEventListener('keyup', () => {

      if (burgerlistname.value !== list_name) {
        can_save = true
        if (addListBtn) {
          addListBtn.classList.add('save');
        }
        if (updateListBtn) {
          updateListBtn.classList.add('save');
        }
      } else {
        can_save = false;
        if (addListBtn) {
          addListBtn.classList.remove('save');
        }
        if (updateListBtn) {
          updateListBtn.classList.remove('save');
        }
      }
      
    });
  }
  
  if (addListBtn) {
    addListBtn.addEventListener('click', () => {
      if (!can_save) return;
      list_name = burgerlistname.value
      if (list_name.length > 2) {
        let instance = ShoppingListModule();
        instance.ShoppingList.createCustomList(list_name);
      }
      can_save = false;
      if (addListBtn) {
        addListBtn.classList.remove('save');
      }
      if (updateListBtn) {
        updateListBtn.classList.remove('save');
      }
    })
  }

  if (updateListBtn) {
    updateListBtn.addEventListener('click', () => {
      if (!can_save) return;
      list_name = burgerlistname.value;
      if (list_name.length > 2) {
        let instance = ShoppingListModule();
        instance.ShoppingList.updateMeta(list_name, undefined);
      }
      can_save = false;
      if (addListBtn) {
        addListBtn.classList.remove('save');
      }
      if (updateListBtn) {
        updateListBtn.classList.remove('save');
      }
    })
  }



  if (upcomingbtn) {
    upcomingbtn.addEventListener('click', () => {
      if (passedbtn.classList.contains('active')) {
        passedbtn.classList.toggle('active')
        upcomingbtn.classList.toggle('active')

        upcoming.forEach(item => item.classList.toggle('shoppinglist-hidden'))
        passed.forEach(item => item.classList.toggle('shoppinglist-hidden'))
      }
    })
  }

  if (passedbtn) {
    passedbtn.addEventListener('click', () => {
      if (upcomingbtn.classList.contains('active')) {
        upcomingbtn.classList.toggle('active')
        passedbtn.classList.toggle('active')

        upcoming.forEach(item => item.classList.toggle('shoppinglist-hidden'))
        passed.forEach(item => item.classList.toggle('shoppinglist-hidden'))
      }
    })
  }

  document.querySelectorAll('.list-date').forEach(element => {
    let date = element.innerHTML
    let year = date.substring(2, 4), month = date.substring(4, 6), day = date.substring(6, 8)
    element.innerHTML = `${day}.${month}.${year}`
  })

})
