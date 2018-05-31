document.addEventListener("DOMContentLoaded", () => {

  let btn = document.querySelector(".icon-button");
  let categoryBox = document.querySelector(".category-container");
  let changeButton = document.querySelector(".icon-button");
  let whiteIconGone = document.querySelector(".add-product-button");
  let blackIconShow = document.querySelector(".button-white");
  let listitem = document.querySelectorAll(".list-item")
            let catlist = document.querySelector(".category-list")

  btn.addEventListener("click", () => {

    changeButton.classList.toggle("change-button");
    categoryBox.classList.toggle("show");
    whiteIconGone.classList.toggle("hide-button");
    blackIconShow.classList.toggle("show-button");

  })

function setEventListener() {
  listitem.forEach((i) => {
    i.addEventListener("click", () =>{
      let cat = i.dataset.categoryid
      fetch(`/API/category/${cat}`)
        .then(data => data.json())
        .then(d => {
          console.log(d);
          let temp = d.children
          catlist.innerHTML = ""
          temp.forEach((j) => {
            fetch(`/API/category/${j}`)
              .then(dat => dat.json())
              .then(k => {
                catlist.innerHTML += `<li class="list-item" data-categoryid="${k.id}">${k.name}</li>`
              })
          })
        })
    })
  })
}
setEventListener()

})
