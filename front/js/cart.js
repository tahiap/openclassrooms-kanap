/***** 
gestion du panier
*****/

// récupère les données du local storage
let productInCart = JSON.parse(localStorage.getItem("product"))

// enregistre les infos dans le local storage
function saveCart() {
	localStorage.setItem("product", JSON.stringify(productInCart))
}

// calcule le nombre de produits dans le panier
function getTotalQuantity() {
	let totalQuantity = 0
	for (let j = 0; j < productInCart.length; ++j) {
		totalQuantity += parseInt(productInCart[j].productQuantity)
	}
	return totalQuantity
}
totalQuantity = getTotalQuantity()

// calcule le prix total du panier
function getTotalPrice() {
	let totalPrice = 0
	for (let j = 0; j < productInCart.length; ++j) {
		totalPrice +=
			parseInt(productInCart[j].productQuantity) *
			parseInt(productInCart[j].productPrice)
	}
	return totalPrice
}
totalPrice = getTotalPrice()

// modifie le dom
function modifyDom() {
	for (let i = 0; i < productInCart.length; ++i) {
		document.getElementById(
			"cart__items"
		).innerHTML += `<article class="cart__item" data-id="${productInCart[i].productId}" data-color="${productInCart[i].productColor}">
                <div class="cart__item__img">
                  <img src="${productInCart[i].productImg}" alt="${productInCart[i].productAltTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${productInCart[i].productName}</h2>
                    <p>${productInCart[i].productColor}</p>
                    <p>${productInCart[i].productPrice} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInCart[i].productQuantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`
		document.getElementById("totalQuantity").innerHTML = totalQuantity
		document.getElementById("totalPrice").innerHTML = totalPrice
	}
}

modifyDom()

// écoute l'input quantité et modifie la quantité de produit dans le local storage
function modifyProductQuantity() {
	let productQuantityInCart = document.querySelectorAll(".itemQuantity")

	for (let k = 0; k < productInCart.length; ++k) {
		productQuantityInCart[k].addEventListener("change", () => {
			// attribut la nouvelle quantité au produit du panier et enregistre dans le local storage
			productInCart[k].productQuantity = productQuantityInCart[k].value
			saveCart()

			// rafraichit la page
			location.reload()
		})
	}
	totalQuantity = getTotalQuantity()
	totalPrice = getTotalPrice()
}

modifyProductQuantity()

// écoute l'élément html .deleteItem et supprime le produit du local storage
function removeProduct() {
	let removeButton = document.querySelectorAll(".deleteItem")

	for (let h = 0; h < productInCart.length; ++h) {
		removeButton[h].addEventListener("click", () => {
			const removeProductId = productInCart[h].productId
			const removeProductColor = productInCart[h].productColor

			// filtre le local storage en fonction de l'id et la couleur de l'élément à supprimer
			const resultFilter = productInCart.filter(
				(p) =>
					p.productId != removeProductId && p.productColor != removeProductColor
			)

			// attribut la nouvelle valeur du panier et enregistre dans le local storage
			productInCart = resultFilter
			saveCart()

			// rafraichit la page
			location.reload()
		})
	}
}

removeProduct()
