function modalProducts(db, printProducts) {

  const modal = document.querySelector('.modal')  
  const productsDOM = document.querySelector('.products__container')
  // Cart
  const notifyDOM = document.querySelector('.notify')
  const cartDOM = document.querySelector('.cart__body')
  const countDOM = document.querySelector('.cart__count--item')
  const totalDOM = document.querySelector('.cart__total--item')
  const checkoutDOM = document.querySelector('.btn--buy')

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
                  <button type="button" class="modal__btn add--to--cart" data-id="${product.id}">
                    <i class="bx bx-cart-add"></i>
                  </button>
                  <p class="modal__description">${product.description}</p>
                  <span class="modal__price">Precio:</span>
                  <span class="price">$${product.price}</span>
                  <div class="modal__measures">
                    <h3>Medidas</h3>
                    <p>XS, S, M, L, XL, XXL</p>
                  </div>

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
    const itemFinded = cart.find(i => i.id === id)

    if (itemFinded) {
      itemFinded.qty += qty
    } else {
      cart.push({id, qty})
    }

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

    cart = []
    printCart()
    printProducts()
    // alertCart()
  }


  // Eventos

  // const cartFunctions = cart()
  // console.log(cartFunctions)
  modal.addEventListener('click', function(e){
    if (e.target.closest('.btn--close--modal')) {
      modal.classList.remove('show--modal')
    }
    if(e.target.closest('.add--to--cart')) {
      const id = +e.target.closest('.add--to--cart').dataset.id
      addToCart(id)
    }
    
  })

  checkoutDOM.addEventListener('click', function () {
    checkout()
  })

  // printProducts()

}

export default modalProducts