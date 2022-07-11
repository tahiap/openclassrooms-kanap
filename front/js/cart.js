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
	const productQuantityInCart = document.querySelectorAll(".itemQuantity")

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
	const removeButton = document.querySelectorAll(".deleteItem")

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

// VALIDATION DU FORMULAIRE
const firstNameForm = document.getElementById("firstName")
const lastNameForm = document.getElementById("lastName")
const cityForm = document.getElementById("city")
const addressForm = document.getElementById("address")
const emailForm = document.getElementById("email")
const submitForm = document.querySelector(".cart__order__form")

// ajout de pattern aux input dans le dom
function addPatternDom() {
	firstNameForm.setAttribute("pattern", "[A-Za-z](([- ',]?[A-Za-z]+)*)")
	lastNameForm.setAttribute("pattern", "[A-Za-z](([- ',]?[A-Za-z]+)*)")
	cityForm.setAttribute("pattern", "[A-Za-z](([- ',]?[A-Za-z]+)*)")
	addressForm.setAttribute("pattern", "[0-9]{1,3}(([ ,.]+['A-Za-z0-9]+)+)")
	email.setAttribute(
		"pattern",
		"[A-Za-z0-9](([_.-]?[A-Za-z0-9]+)*)@([A-Za-z0-9]+)(([_.-]?[A-Za-z0-9]+)*).([A-Za-z]{2,})"
	)
}
addPatternDom()

// écoute l'input prénom
function firstNameValidity() {
	firstNameForm.addEventListener("change", (event) => {
		if (firstNameForm.validity.patternMismatch == true) {
			document.getElementById("firstNameErrorMsg").innerHTML =
				"Le prénom ne doit pas comporter de chiffres ou de caractères spéciaux."
		} else {
			document.getElementById("firstNameErrorMsg").innerHTML = ""
		}
	})
}
firstNameValidity()

// écoute l'input nom
function lastNameValidity() {
	lastNameForm.addEventListener("change", (event) => {
		if (lastNameForm.validity.patternMismatch == true) {
			document.getElementById("lastNameErrorMsg").innerHTML =
				"Le nom ne doit pas comporter de chiffres ou de caractères spéciaux."
		} else {
			document.getElementById("lastNameErrorMsg").innerHTML = ""
		}
	})
}
lastNameValidity()

// écoute l'input adresse
function addressValidity() {
	addressForm.addEventListener("change", (event) => {
		if (addressForm.validity.patternMismatch == true) {
			document.getElementById("addressErrorMsg").innerHTML =
				"L'adresse doit comporter le numéro de la voix, suivie du type et du nom de la voix, puis du complétement d'adresse. Exemple : 130 avenue moulin, batiment c"
		} else {
			document.getElementById("addressErrorMsg").innerHTML = ""
		}
	})
}
addressValidity()

// écoute l'input city
function cityValidity() {
	cityForm.addEventListener("change", (event) => {
		if (cityForm.validity.patternMismatch == true) {
			document.getElementById("cityErrorMsg").innerHTML =
				"Le nom de la ville ne doit pas comporter de chiffres ou de caractères spéciaux."
		} else {
			document.getElementById("cityErrorMsg").innerHTML = ""
		}
	})
}
cityValidity()

// écoute l'input email
function emailValidity() {
	emailForm.addEventListener("change", (event) => {
		if (emailForm.validity.patternMismatch == true) {
			document.getElementById("emailErrorMsg").innerHTML =
				"L'email doit contenir le caractère '@'. Par exemple : nom.prenom@mail.com."
		} else {
			document.getElementById("emailErrorMsg").innerHTML = ""
		}
	})
}
emailValidity()

// ENVOI DU FORMULAIRE ET RECUPERATION DU NUMERO DE COMMANDE
// gère l'envoi du formulaire
function postForm() {
	// récupère l'id des produits du panier dans un tableau
	let productIds = []
	for (let l = 0; l < productInCart.length; ++l) {
		productIds.push(productInCart[l].productId)
	}

	// écoute l'envoi du formulaire
	submitForm.addEventListener("submit", (event) => {
		event.preventDefault()
		// stocke les infos de la commande
		let order = {
			contact: {
				firstName: firstNameForm.value,
				lastName: lastNameForm.value,
				address: addressForm.value,
				city: cityForm.value,
				email: emailForm.value,
			},
			products: productIds,
		}

		// effectue la requête POST
		fetch("http://localhost:3000/api/products/order", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(order),
		})
			.then(function (res) {
				if (res.ok) {
					return res.json()
				}
			})
			.then(function (value) {
				if (value) {
					let url = "./confirmation.html?id=" + value.orderId
					document.location.href = url
				}
			})
			.catch(function (err) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " + err.message
				)
			})
	})
}
postForm()
