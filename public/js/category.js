document.addEventListener("DOMContentLoaded", () => {

  let btn = document.querySelector(".icon-button");
  let categoryBox = document.querySelector(".category-container");
  let whiteIconGone = document.querySelector(".add-product-button");
  let blackIconShow = document.querySelector(".button-white");
  let catlist = document.querySelector(".category-list")

  btn.addEventListener("click", async () => {
    // Resets the list
    if (btn.classList.contains("change-button")) {
      let result = await fetch('/api/categories')
      let json = await result.json()

      catlist.innerHTML = ""
      catlist.innerHTML += `<li>Inspirasjon</li>
      <li>Dine Varer</li>`
      json.forEach(e => {
        catlist.innerHTML += `<li class="list-item" data-categoryid="${e.id}">${e.name}</li>`
        setEventListener()
      })
    }

    btn.classList.toggle("change-button");
    categoryBox.classList.toggle("show");
    whiteIconGone.classList.toggle("hide-button");
    blackIconShow.classList.toggle("show-button");
  })

  async function getCategories(data) {
    catlist.innerHTML = ""
    data.children_id.forEach(async (num, index) => {
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
                  <img id="product-image" src=${json.images.thumbnail} alt="">
                  <h1 id="product-name">${json.name}</h1>
                  <h1 id="price-per-unit">kr ${json.price.gross}</h1>
                  <img id="add-button" src="/imgs/icon/Velg vare.png" alt="">
                  <span></span>
                  <h2 id="price-quantity">kr ${json.price.gross_unit}</h2>
                  </div>`
        setEventListener()
      } catch (e) {
        console.log(e)
      }
    })
  }

  function setEventListener() {
    let listitem = document.querySelectorAll(".list-item")
    listitem.forEach(item => {
      item.addEventListener("click", async () => {
        let category = item.dataset.categoryid
        let data = await fetch(`/API/category/${category}`)
        let json = await data.json()

        if (json.children_id && json.children_id.length > 0) {
          getCategories(json)
        } else {
          getProducts(json)
        }

      })
    })
  }
  function searchTerm(){
    let input = document.getElementById("search-t")
    input.addEventListener("change", async () => {
      console.log(input.value)
      let i = input.value
      let data = await fetch(`/API/item/search?name=${i}`)
      let json = await data.json()
      console.log(json)
      catlist.innerHTML = ""

      json.forEach(async (json) => {
          catlist.innerHTML += `<div class="product-container">
                    <img id="product-image" src=${json.images.thumbnail} alt="">
                    <h1 id="product-name">${json.name}</h1>
                    <h1 id="price-per-unit">kr ${json.price.gross}</h1>
                    <img id="add-button" src="/imgs/icon/Velg vare.png" alt="">
                    <h2 id="price-som">stykk</h2>
                    <h2 id="price-quantity">kr ${json.price.gross_unit}</h2>
                    </div>`
          setEventListener()
        })
    })
  }
  setEventListener()
  searchTerm()
})