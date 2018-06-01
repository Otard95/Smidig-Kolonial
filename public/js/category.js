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

  async function getCategories(data) {
    catlist.innerHTML = ""
    let list = []
    data.children.forEach(async (num, index) => {
      try {
        let response = await fetch(`/API/category/${num}`)
        let json = await response.json()
        if (json.name !== undefined) catlist.innerHTML += `<li class="list-item" data-categoryid="${json.id}">${json.name}</li>`
        setEventListener()
      } catch (e) {
        console.log(e)
      }
    })
  }

  async function getProducts(data) {
    catlist.innerHTML = ""
    data.products.forEach(async (j) => {
      try {
        let response = await fetch(`/API/item/${j}`)
        let json = await response.json()
        catlist.innerHTML += `<div class="product-container">
                  <img id="product-image" src=${json.images[0].thumbnail.url} alt="">
                  <h1 id="product-name">${json.name.base}</h1>
                  <h1 id="price-per-unit">kr ${json.price.gross}</h1>
                  <img id="add-button" src="/imgs/icon/Velg vare.png" alt="">
                  <h2 id="price-som">${json.price.unit_quantity_name}</h2>
                  <h2 id="price-quantity">kr ${json.price.gross_unit}/${json.price.unit_quantity_abbreviation}</h2>
                  </div>`
        setEventListener()
      } catch (e) {
        console.log(e)
      }
    })
  }

  function setEventListener() {
    console.log('Setting eventlisteners')
    let listitem = document.querySelectorAll(".list-item")
    listitem.forEach(item => {
      item.addEventListener("click", async () => {
        let category = item.dataset.categoryid
        let data = await fetch(`/API/category/${category}`)
        let json = await data.json()

        if (json.children.length > 0) {
          getCategories(json)
        } else {
          console.log('Should log out data')
          getProducts(json)
        }

      })
    })
  }

  setEventListener()
})