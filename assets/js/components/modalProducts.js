function modalProducts(db, printProducts) {

  const modal = document.querySelector('.modal')  
  const productsDOM = document.querySelector('.products__container')
  // Cart
  const notifyDOM = document.querySelector('.notify')
  const cartDOM = document.querySelector('.cart__body')
  const countDOM = document.querySelector('.cart__count--item')
  const totalDOM = document.querySelector('.cart__total--item')
  const checkoutDOM = document.querySelector('.btn--buy')
  const alertDOM = document.querySelector('.alert')

  let modalProduct = ""
  productsDOM.addEventListener('click', function (e) {
    if (e.target.closest('.details__product')) {
      const productId = +e.target.closest('.details__product').dataset.id
      const product = db.find(p => p.id === productId)
      console.log(product)
      if (product) {
        modalProduct += `
          <div class="modal__container">
            <div class="modal__product">
              <div class="modal__image">
                <img src="${product.image}" alt="${product.name}" />
              </div>
              <div class="modal__details">
                <div class="modal__close__btn">
                  <button type="button" class="modal__btn__close btn--close--modal">
                    <i class="bx bx-x"></i>
                  </button>
                </div>
                <div class="details__head">
                  <h3 class="modal__title">${product.name}</h3>
                </div>
                <div class="details__content">
                  
                  <p class="modal__description">${product.description}</p>
                  <span class="modal__price">Precio: $${product.price}</span>

                  <h3>Medidas</h3>
                  <p>XS, S, M, L, XL, XXL</p>

                  <h3>Colores</h3>
                  <div class="modal__colors">
                    <span class="colors__color color--black"></span>
                    <span class="colors__color color--blue"></span>
                    <span class="colors__color color--red"></span>
                    <span class="colors__color color--grey"></span>
                  </div>

                  <div class="modal__stock">
                    <span class="stock">Disponibles: ${product.quantity}</span>
                  </div>
                  <button type="button" class="modal__btn add--to--cart" data-id="${product.id}">
                    <i class="bx bx-cart-add"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>`
      }

      modal.innerHTML = modalProduct
      modal.classList.toggle('show--modal')
    }
  })

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
          item.qty++
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
  printCart()
  // Eventos

  // const cartFunctions = cart()
  // console.log(cartFunctions)
  modal.addEventListener('click', function(e){
    if (e.target.closest('.btn--close--modal')) {
      modal.classList.remove('show--modal')
      modalProduct = ""
    }
    if(e.target.closest('.add--to--cart')) {
      const id = +e.target.closest('.add--to--cart').dataset.id
      addToCart(id)
    }
    
  })
  

  // printProducts()
  productsDOM.addEventListener('click', function (e) {
    if (e.target.closest('.add--to--cart')) {
      const id = +e.target.closest('.add--to--cart').dataset.id
      addToCart(id)

    }
  })
  alertDOM.addEventListener('click', function (e) {
    if (e.target.closest('.btn--close--alert')) {
      alertDOM.classList.remove('show--alert')
    }
  })

}

export default modalProducts