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
  listitem.forEach((i) => {
    i.addEventListener("click", () => {
      let cat = i.dataset.categoryid
      fetch(`/API/category/${cat}`)
        .then(data => data.json())
        .then(d => {
          console.log(d);
          if(d.children.length > 0){
            catlist.innerHTML = ""
            d.children.forEach((j) => {
              fetch(`/API/category/${j}`)
                .then(dat => dat.json())
                .then(k => {
                  catlist.innerHTML += `<li class="list-item" data-categoryid="${k.id}">${k.name}</li>`
                })
            })
          }else{
            catlist.innerHTML = ""
            d.products.forEach((j) => {
              fetch(`/API/item/${j}`)
                .then(dat => dat.json())
                .then(k => {
                  console.log(k);
                  catlist.innerHTML += `<li class="list-item" data-categoryid="${k.id}">${k.name}</li>`
                })
            })
          }

        })
        setTimeout(() => {
        setEventListener()
      }, 500)
    })
  })
}

setEventListener()
})
