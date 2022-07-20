////// gère l'affichage et les intéractions du panier

// AFFICHAGE DU PANIER
// récupère les données du local storage
let productInCart = JSON.parse(localStorage.getItem("product"))

// enregistre les infos dans le local storage
function saveCart() {
	localStorage.setItem("product", JSON.stringify(productInCart))
}

// récupère le reste des informations qui ne sont pas dans le local storage, par exemple le prix
function getProductsDetails() {
	// génère une requête http et récupère les articles de l'API
	fetch("http://localhost:3000/api/products/")
		// vérifie que la requête s'est bien passée et récupère les données au format json
		.then(function (res) {
			if (res.ok) {
				return res.json()
			}
		})
		// récupère les valeurs dans un tableau et appelle les fonctions qui modifient le dom
		.then(function (value) {
			let productsDetails = []
			for (let i = 0; i < productInCart.length; ++i) {
				let element = value.find((p) => p._id === productInCart[i].productId)
				productsDetails.push(element)
			}
			modifyDom(productsDetails)
			modifyProductQuantity()
			removeProduct()
		})
		.catch(function (err) {
			console.log(
				"Il y a eu un problème avec l'opération fetch: " + err.message
			)
		})
}
getProductsDetails()

// calcule le nombre de produits dans le panier
function getTotalQuantity() {
	let totalQuantity = 0
	for (let j = 0; j < productInCart.length; ++j) {
		totalQuantity += parseInt(productInCart[j].productQuantity)
	}
	return totalQuantity
}

// calcule le prix total du panier
function getTotalPrice(productsDetails) {
	let totalPrice = 0
	for (let j = 0; j < productInCart.length; ++j) {
		totalPrice +=
			parseInt(productInCart[j].productQuantity) *
			parseInt(productsDetails[j].price)
	}
	return totalPrice
}

// modifie le dom
function modifyDom(productsDetails) {
	for (let i = 0; i < productInCart.length; ++i) {
		// insère l'article
		let productArticle = document.createElement("article")
		document.getElementById("cart__items").appendChild(productArticle)
		productArticle.classList.add("cart__item")
		productArticle.setAttribute("data-id", productInCart[i].productId)
		productArticle.setAttribute("data-color", productInCart[i].productColor)

		// insère la div contenant l'image
		let productDivImg = document.createElement("div")
		productArticle.appendChild(productDivImg)
		productDivImg.classList.add("cart__item__img")

		// insère l'image
		let productImg = document.createElement("img")
		productDivImg.appendChild(productImg)
		productImg.setAttribute("src", productsDetails[i].imageUrl)
		productImg.setAttribute("alt", productsDetails[i].altTxt)

		// insère la div contenant les informations du produit
		let productDivContent = document.createElement("div")
		productArticle.appendChild(productDivContent)
		productDivContent.classList.add("cart__item__content")

		// insère la div contenant la description du produit
		let productDivContentDescription = document.createElement("div")
		productDivContent.appendChild(productDivContentDescription)
		productDivContentDescription.classList.add(
			"cart__item__content__description"
		)

		// insère le titre
		let productName = document.createElement("h2")
		productDivContentDescription.appendChild(productName)
		productName.textContent = productsDetails[i].name

		// insère la couleur du produit
		let productColor = document.createElement("p")
		productDivContentDescription.appendChild(productColor)
		productColor.textContent = productInCart[i].productColor

		// insère le prix du produit
		let productPrice = document.createElement("p")
		productDivContentDescription.appendChild(productPrice)
		productPrice.textContent = `${productsDetails[i].price}€`

		// insère la div contenant les options de personnalisation du produit
		let productDivContentSettings = document.createElement("div")
		document
		productDivContent.appendChild(productDivContentSettings)
		productDivContentSettings.classList.add("cart__item__content__settings")

		// insère la div contenant l'élément 'supprimer'
		let productDivContentSettingsQuantity = document.createElement("div")
		document
		productDivContentSettings.appendChild(productDivContentSettingsQuantity)
		productDivContentSettingsQuantity.classList.add(
			"cart__item__content__settings__quantity"
		)

		// insère le texte "Qté"
		let productQuantityText = document.createElement("p")
		productDivContentSettingsQuantity.appendChild(productQuantityText)
		productQuantityText.textContent = "Qté : "

		// insère l'input quantité
		let productQuantityInput = document.createElement("input")
		productDivContentSettingsQuantity.appendChild(productQuantityInput)
		productQuantityInput.setAttribute("type", "number")
		productQuantityInput.classList.add("itemQuantity")
		productQuantityInput.setAttribute("name", "itemQuantity")
		productQuantityInput.setAttribute("min", "1")
		productQuantityInput.setAttribute("max", "100")
		productQuantityInput.setAttribute("value", productInCart[i].productQuantity)

		// insère la div contenant l'élément 'supprimer'
		let productDivContentSettingsDelete = document.createElement("div")
		document
		productDivContentSettings.appendChild(productDivContentSettingsDelete)
		productDivContentSettingsDelete.classList.add(
			"cart__item__content__settings__delete"
		)

		// insère l'élément 'supprimer'
		let productDelete = document.createElement("p")
		productDivContentSettingsDelete.appendChild(productDelete)
		productDelete.classList.add("deleteItem")
		productDelete.textContent = "Supprimer"
	}
	document.getElementById("totalQuantity").textContent = getTotalQuantity()
	document.getElementById("totalPrice").textContent =
		getTotalPrice(productsDetails)
}

// MODIFICATION DU PANIER PAR L'UTILISATEUR ET MISE À JOUR DU PANIER
// écoute l'input quantité et modifie la quantité de produit dans le local storage
function modifyProductQuantity() {
	const productQuantityInCart = document.querySelectorAll(".itemQuantity")

	for (let k = 0; k < productInCart.length; ++k) {
		productQuantityInCart[k].addEventListener("change", () => {
			// attribue la nouvelle quantité au produit du panier et enregistre dans le local storage
			productInCart[k].productQuantity = productQuantityInCart[k].value
			saveCart()

			// rafraichit la page
			location.reload()
		})
	}
}

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
					p.productId !== removeProductId ||
					p.productColor !== removeProductColor
			)

			// attribue la nouvelle valeur du panier et enregistre dans le local storage
			productInCart = resultFilter
			saveCart()

			// rafraichit la page
			location.reload()
		})
	}
}

// GESTION DU FORMULAIRE
// déclaration des variables pour l'accés au dom
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
	addressForm.setAttribute("pattern", "[0-9]{1,3}(([ ,.]*['A-Za-z0-9]+)+)")
	email.setAttribute(
		"pattern",
		"[A-Za-z0-9](([_.-]?[A-Za-z0-9]+)*)@([A-Za-z0-9]+)(([_.-]?[A-Za-z0-9]+)*)\\.([A-Za-z]{2,})"
	)
}
addPatternDom()

// ANALYSE DES INPUTS
// écoute l'input prénom
function firstNameValidity() {
	firstNameForm.addEventListener("change", () => {
		if (firstNameForm.validity.patternMismatch === true) {
			document.getElementById("firstNameErrorMsg").textContent =
				"Le prénom ne doit pas comporter de chiffres ou de caractères spéciaux (par exemple : *, %, !, ?...)."
		} else {
			document.getElementById("firstNameErrorMsg").textContent = ""
		}
	})
}
firstNameValidity()

// écoute l'input nom
function lastNameValidity() {
	lastNameForm.addEventListener("change", () => {
		if (lastNameForm.validity.patternMismatch === true) {
			document.getElementById("lastNameErrorMsg").textContent =
				"Le nom ne doit pas comporter de chiffres ou de caractères spéciaux (par exemple : *, %, !, ?...)."
		} else {
			document.getElementById("lastNameErrorMsg").textContent = ""
		}
	})
}
lastNameValidity()

// écoute l'input adresse
function addressValidity() {
	addressForm.addEventListener("change", () => {
		if (addressForm.validity.patternMismatch === true) {
			document.getElementById("addressErrorMsg").textContent =
				"L'adresse doit comporter le numéro de la voix, suivie du type et du nom de la voix, puis du complétement d'adresse. Exemple : 130 avenue moulin, batiment c"
		} else {
			document.getElementById("addressErrorMsg").textContent = ""
		}
	})
}
addressValidity()

// écoute l'input city
function cityValidity() {
	cityForm.addEventListener("change", () => {
		if (cityForm.validity.patternMismatch === true) {
			document.getElementById("cityErrorMsg").textContent =
				"Le nom de la ville ne doit pas comporter de chiffres ou de caractères spéciaux (par exemple : *, %, !, ?...). "
		} else {
			document.getElementById("cityErrorMsg").textContent = ""
		}
	})
}
cityValidity()

// écoute l'input email
function emailValidity() {
	emailForm.addEventListener("change", () => {
		if (emailForm.validity.patternMismatch === true) {
			document.getElementById("emailErrorMsg").textContent =
				"L'email doit contenir le caractère '@'. Par exemple : nom.prenom@mail.com."
		} else {
			document.getElementById("emailErrorMsg").textContent = ""
		}
	})
}
emailValidity()

// ENVOI DU FORMULAIRE ET RECUPERATION DU NUMERO DE COMMANDE
// gère l'envoi du formulaire
function postForm() {
	// récupère l'id des produits du panier dans un tableau
	let productsId = []
	for (let l = 0; l < productInCart.length; ++l) {
		productsId.push(productInCart[l].productId)
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
			products: productsId,
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
					clearCart()
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

function clearCart() {
	localStorage.clear()
}
