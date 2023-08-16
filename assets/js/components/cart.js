function cart (db, printProducts) {
  // Elementos del DOM 
  const productsDOM = document.querySelector('.products__container')
  const notifyDOM = document.querySelector('.notify')
  const cartDOM = document.querySelector('.cart__body')
  const countDOM = document.querySelector('.cart__count--item')
  const totalDOM = document.querySelector('.cart__total--item')
  const checkoutDOM = document.querySelector('.btn--buy')
  const alertDOM = document.querySelector('.alert')
  const productStockDOM = document.querySelector('.product__stock')

  

  let cart = []
  
  // Funciones 
  function printCart () {
    let htmlCart = ''

    if (cart.length === 0) {
      htmlCart += `
      <div class="cart__empty">
        <i class="bx bx-cart"></i>
        <p class="cart__empty--text">No hay productos en el carrito</p>
      </div>
      `
      notifyDOM.classList.remove('show--notify')
    } else {
      for (const item of cart) {
        const product = db.find(p => p.id === item.id)
        htmlCart += `
        <article class="article">
          <div class="article__image">
            <img
              src="${product.image}"
              alt="${product.name}"
            />
          </div>
          <div class="article__content">
            <h3 class="article__title">
              ${product.name}
            </h3>
            <span class="article__price">$${product.price}</span>
            <div class="article__quantity">
              <button type="button" class="article__quantity-btn article--minus" data-id="${item.id}">
                <i class='bx bx-minus' ></i>
              </button>
              <span class="article__quantity-text">${item.qty}</span>
              <button type="button" class="article__quantity-btn article--plus" data-id="${item.id}">
                <i class='bx bx-plus' ></i>
              </button>
            </div>
            <button type="button" class="article__btn remove-from-cart" data-id="${item.id}">
              <i class='bx bx-trash' ></i>
            </button>
          </div>
        </article>
        `
      }
      notifyDOM.classList.add('show--notify')
    }

    cartDOM.innerHTML = htmlCart
    notifyDOM.innerHTML = showItemsCount()
    countDOM.innerHTML = showItemsCount()
    totalDOM.innerHTML = showTotal()
  }

  function addToCart(id, qty = 1) {
    const itemFinded = db.find(i => i.id === id)

    if (itemFinded && itemFinded.quantity > 0) {
      const item = cart.find(i => i.id === id)
      if (item) {
        if (checkStock(id, qty + item.qty)) {
          item.qty += qty
        } else {
          const alert = `
          <div class="modal__alert">
            <div class="alert__container">
              <div class="alert__header">
                <button type="button" class="alert__btn btn--close--alert">
                  <i class="bx bx-x"></i>
                </button>
              </div>
              <div class="alert__Thanks">
                <div class="logo__alert__none">
                  <i class='bx bxs-x-circle'></i>
                  <i class='bx bxs-shopping-bags'></i>
                </div>
                <div class="text__alert">
                  <p class="bold-text">"No hay stock disponible"</p>
                </div>
              </div>
            </div>        
          </div>`
          alertDOM.innerHTML = alert
          alertDOM.classList.toggle('show--alert')
        }
      } else {
        cart.push({id, qty})
      }
    }
    printCart()
  }

  function checkStock(id, qty) {
    const product = db.find(i => i.id === id)
    return product.quantity - qty >= 0
  }

  function removeFromCart (id, qty = 1) {
    const itemFinded = cart.find(i => i.id === id)
    const result = itemFinded.qty - qty

    if (result > 0) {
      itemFinded.qty -= qty
    } else {
      cart = cart.filter(i => i.id !== id)
    }
    
    printCart()
  }

  function deleteFromCart(id) {
    cart = cart.filter(i => i.id !== id)

    printCart()
  }

  function showItemsCount() {
    let suma = 0
    for (const item of cart) {
      suma += item.qty
    }
    return suma
  }

  function showTotal() {
    let total = 0
    for (const item of cart) {
      const productFinded = db.find(p => p.id === item.id)
      total += item.qty * productFinded.price 
    }
    return total
  }

  function checkout() {
    for (const item of cart) {
      const productFinded = db.find(p => p.id === item.id)
      productFinded.quantity -= item.qty
    }
    alertCart()
    cart = []
    printCart()
    printProducts()
    
  }

  function alertCart() {

      if(cart.length !== 0) {
        const alert = `
        <div class="modal__alert">
          <div class="alert__container">
            <div class="alert__header">
              <button type="button" class="alert__btn btn--close--alert">
                <i class="bx bx-x"></i>
              </button>
            </div>
            <div class="alert__Thanks">
              <div class="logo__alert">
                <!-- <i class='bx bx-like'></i> -->
                <i class='bx bx-cool'></i>
                <i class='bx bxs-shopping-bags'></i>
              </div>
              <div class="text__alert">
                <p class="bold-text">"Gracias por adquirir nuestros productos. Esperamos que tu experiencia con nosotros sea extraordinaria"</p>
              </div>
            </div>
          </div>        
        </div>`
        alertDOM.innerHTML = alert
        alertDOM.classList.toggle('show--alert')
      } else {
        const alertNone = `
        <div class="modal__alert">
          <div class="alert__container">
            <div class="alert__header">
              <button type="button" class="alert__btn btn--close--alert">
                <i class="bx bx-x"></i>
              </button>
            </div>
            <div class="alert__Thanks">
              <div class="logo__alert__none">
                <i class='bx bxs-x-circle'></i>
                <i class='bx bxs-shopping-bags'></i>
              </div>
              <div class="text__alert">
                <p class="bold-text">"No hay productos en el carrito"</p>
              </div>
            </div>
          </div>        
        </div>`
        alertDOM.innerHTML = alertNone
        alertDOM.classList.toggle('show--alert')
      }
  }

  // alertCart()
  // printCart()
  

  // Eventos 

  productsDOM.addEventListener('click', function (e) {
    if (e.target.closest('.add--to--cart')) {
      const id = +e.target.closest('.add--to--cart').dataset.id
      addToCart(id)

    }
  })

  cartDOM.addEventListener('click', function (e) {
    if (e.target.closest('.article--minus')) {
      const id = +e.target.closest('.article--minus').dataset.id
      removeFromCart(id)
    }

    if (e.target.closest('.article--plus')) {
      const id = +e.target.closest('.article--plus').dataset.id
      addToCart(id)
    }

    if (e.target.closest('.remove-from-cart')) {
      const id = +e.target.closest('.remove-from-cart').dataset.id
      deleteFromCart(id)
    }
    
  })

  checkoutDOM.addEventListener('click', function () {
    checkout()
  })

  // close alert
  alertDOM.addEventListener('click', function (e) {
    if (e.target.closest('.btn--close--alert')) {
      alertDOM.classList.remove('show--alert')
    }
  })
}

export default cart