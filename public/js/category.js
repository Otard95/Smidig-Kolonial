document.addEventListener("DOMContentLoaded", () => {

  let btn = document.querySelector("#add-product-button");
  let categoryBox = document.querySelector(".category-container");

  btn.addEventListener("click", () => {

    btn.classList.toggle(".show");
    categoryBox.classList.toggle(".show");

  })

})
