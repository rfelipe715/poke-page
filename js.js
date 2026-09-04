/**
 * Atributos HTML
 */

const openCartBtn = document.getElementById("openCart")
const closeCartBtn = document.getElementById("closeCart")
const cartDrawer = document.getElementById("drawer")


/**
 * Event listeners
 */

openCartBtn.addEventListener("click", (e) => {        
        cartDrawer.classList.toggle("open")
})

closeCartBtn.addEventListener("click", (e) => {        
        cartDrawer.classList.remove("open")
})