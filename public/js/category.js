/*
document.addEventListener("DOMContentLoaded", () => {

  let btn = document.querySelector(".icon-button");
  let categoryBox = document.querySelector(".category-container");
  let whiteIconGone = document.querySelector(".add-product-button");
  let blackIconShow = document.querySelector(".button-white");
  let catlist = document.querySelector(".category-list");
  let showArrow = document.querySelector(".back-arrow");
  let inspoCategory = document.querySelector(".inspiration");
  let headerName = document.querySelector(".search-title");
  let headerContainer = document.querySelector(".information-header")
  let hideSearch = document.querySelector(".search-container");
  let inspoList = document.querySelector(".categories")

  let itemId = []

  btn.addEventListener("click", async () => {
    // Resets the list
    inspirationClick()
    btn.classList.toggle("change-button");
    categoryBox.classList.toggle("show");
    whiteIconGone.classList.toggle("hide-button");
    blackIconShow.classList.toggle("show-button");
    
    if (btn.classList.contains("change-button")) {
      let result = await fetch('/api/categories')
      let json = await result.json()
      catlist.innerHTML = ""
      catlist.innerHTML += `<li class="inspiration">Inspirasjon</li>
      <li>Dine Varer</li>`
      json.forEach(e => {
        catlist.innerHTML += `<li class="list-item" data-categoryid="${e.id}">${e.name}</li>`
        setEventListener()
      })
    }
  })

  async function getCategories(data) {
    headerName.innerHTML = ""
    headerName.innerHTML = `${data.name}`
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
    headerName.innerHTML = ""
    headerName.innerHTML = `${data.name}`
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

        if(!itemId.includes(json.id)){
          itemId.push(json.id)
        }

        console.log(itemId);
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

  function goBack() {
    showArrow.addEventListener("click", async () => {
      console.log("Trykket tilbake");
      if(itemId.length >= 2){
        let last = itemId[itemId.length - 2]
        catlist.innerHTML = ""
        let data = await fetch(`/API/category/${last}`)
        let json = await data.json()
        console.log(json);
        getCategories(json)
      }if(itemId.length < 2){
        hideSearch.classList.remove("hide-search-container")
        inspoList.classList.remove("inspiration-categories")
        let result = await fetch('/api/categories')
        let json = await result.json()
        headerName.innerHTML = ""
        headerName.innerHTML = `Varer`
        catlist.innerHTML = ""
        catlist.innerHTML += `<li>Inspirasjon</li>
        <li>Dine Varer</li>`
        json.forEach(e => {
          catlist.innerHTML += `<li class="list-item" data-categoryid="${e.id}">${e.name}</li>`
          setEventListener()
        })
      }
      itemId.pop()
    })
  }

  function inspirationClick(){
    inspoCategory.addEventListener("click", () =>{
      console.log("Inspo Clicked");
      headerName.innerHTML = ""
      headerName.innerHTML = `Inspirasjon`
      catlist.innerHTML = ""
      catlist.innerHTML += `<li>Familiemiddag</li>
        <li>Helgekos</li>
        <li class="event">Selskap</li>
        <li>Gjester</li>
        <li>Høytid</li>`
      hideSearch.classList.toggle("hide-search-container")
      inspoList.classList.toggle("inspiration-categories")

      let eventCategory = document.querySelector(".event")
      eventCategory.addEventListener("click", async () =>{
        await console.log("Noe ble trykket på");
        catlist.innerHTML = ""
        catlist.innerHTML += `<li class="kidsBirthday">Barnebursdag</li>
          <li>Fest</li>
          <li>Jubeleum</li>`

        let birthdayCategory = document.querySelector(".kidsBirthday")
        birthdayCategory.addEventListener("click", async () =>{
          await console.log("Barnebursdag klikket på");
          headerContainer.classList.toggle("information-event-header")
          headerName.innerHTML = ""
          headerName.innerHTML = `Barnebursdag`
          catlist.innerHTML = ""

          let data = await fetch(`/API/item/search?name=bursdag`)
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
      })
    })
  }
  setEventListener()
  searchTerm()
  goBack()
})
*/