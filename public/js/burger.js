

document.addEventListener("DOMContentLoaded", () => {
    let DOM_burger_button, DOM_side_overlay, DOM_content, DOM_footer, DOM_shadow
    DOM_burger_button = (document.querySelector('.burger')) ? document.querySelectorAll('.burger')[0] : document.querySelectorAll('.handleliste-icon')[0]
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

    let addListBtn = document.querySelector('.list-add-btn')
    let upcoming = document.querySelectorAll('.upcoming')
    let passed = document.querySelectorAll('.passed')

    let upcomingbtn = document.querySelector('.choice-one')
    let passedbtn = document.querySelector('.choice-two')
    let burgerlistname = document.querySelector('.burger-list-name')

    if (addListBtn) {
        addListBtn.addEventListener('click', () => {
            let name = burgerlistname.value
            if (name.length > 2) {
                // postRequest towards server to create list
                let instance = ShoppingListModule();
                instance.ShoppingList.createCustomList(name);
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
