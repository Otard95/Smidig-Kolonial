document.addEventListener("DOMContentLoaded", () => {

  let btn = document.querySelector(".icon-button");
  let categoryBox = document.querySelector(".category-container");
  let changeButton = document.querySelector(".icon-button");
  let whiteIconGone = document.querySelector(".add-product-button");
  let blackIconShow = document.querySelector(".button-white");
  let catlist = document.querySelector(".category-list")

  btn.addEventListener("click", () => {

    changeButton.classList.toggle("change-button");
    categoryBox.classList.toggle("show");
    whiteIconGone.classList.toggle("hide-button");
    blackIconShow.classList.toggle("show-button");

  })

  function setEventListener() {
    let listitem = document.querySelectorAll(".list-item")
    listitem.forEach((i, index) => {
      i.addEventListener("click", () => {
        let cat = i.dataset.categoryid
        fetch(`/API/category/${cat}`)
          .then(data => data.json())
          .then(y => {

            if (y.children.length > 0) {
              catlist.innerHTML = ""
              y.children.forEach((j) => {
                fetch(`/API/category/${j}`)
                  .then(x => x.json())
                  .then(k => {
                    if (k.name !== undefined) catlist.innerHTML += `<li class="list-item" data-categoryid="${k.id}">${k.name}</li>`
                  })
              })

            } else {
              catlist.innerHTML = ""
              y.products.forEach((j) => {
                fetch(`/API/item/${j}`)
                  .then(dat => dat.json())
                  .then(k => {
                    catlist.innerHTML += `<div class="product-container">
                  <img id="product-image" src=${k.images[0].thumbnail.url} alt="">
                  <h1 id="product-name">${k.name.base}</h1>
                  <h1 id="price-per-unit">kr ${k.price.gross}</h1>
                  <img id="add-button" src="/imgs/icon/Velg vare.png" alt="">
                  <h2 id="price-som">${k.price.unit_quantity_name}</h2>
                  <h2 id="price-quantity">kr ${k.price.gross_unit}/${k.price.unit_quantity_abbreviation}</h2>
                  </div>`
                  })
              })
            }
          })
        setTimeout(() => {
          setEventListener()
        }, 1000)
      })
    })
  }

  setEventListener()
})