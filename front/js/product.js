/*****
gère l'affichage et les intéractions de la page product
*****/

// RÉCUPÉRATION DES DONNÉES
// récupère l'id du produit à partir de l'url
const productId = new URL(location.href).searchParams.get("id")

getProductFromApi()

// récupère l'article grâce à son id
function getProductFromApi() {
	fetch("http://localhost:3000/api/products/" + productId)
		.then(function (res) {
			if (res.ok) {
				return res.json()
			}
		})
		.then(function (article) {
			if (article) {
				modifyDom(article)
			}
		})
		.catch(function (err) {
			console.log(
				"Il y a eu un problème avec l'opération fetch: " + err.message
			)
		})
}

// modifie le DOM
function modifyDom(article) {
	document.querySelector(
		".item__img"
	).innerHTML += `<img src="${article.imageUrl}" alt="${article.altTxt}"></img>`
	document.getElementById("title").innerHTML += article.name
	document.getElementById("price").innerHTML += article.price
	document.getElementById("description").innerHTML += article.description
	for (let i = 0; i < article.colors.length; i++) {
		document.getElementById(
			"colors"
		).innerHTML += `<option value="${article.colors[i]}">${article.colors[i]}</option>`
	}
	addCart(article)
}

// AJOUT DES PRODUITS DANS LE PANIER
// récupère les éléments du Dom
const addToCart = document.getElementById("addToCart")
const color = document.getElementById("colors")
const quantity = document.getElementById("quantity")

// récupère les infos du local storage
let productInCart = JSON.parse(localStorage.getItem("product"))

// enregistre les infos dans le local storage
function saveCart() {
	localStorage.setItem("product", JSON.stringify(productInCart))
}

// affiche un message qui incite l'utilisateur à choisir une couleur et une quantité
function showMessageMissingSettings() {
	document.querySelector(
		".item__content__settings"
	).innerHTML += `<p class="messageIncompleteOrder">Veuillez choisir une couleur et une quantité !</p>`
	const incompleteOrder = document.querySelector(".messageIncompleteOrder")
	incompleteOrder.style.color = "#2C3E50"
	incompleteOrder.style.textAlign = "center"
}

function addCart(article) {
	// écoute le bouton d'ajout au panier, les conditions couleur et quantité ne doivent pas être nulles
	addToCart.addEventListener("click", () => {
		if (quantity.value > 0 && quantity.value <= 100 && color.value != 0) {
			// récupère les valeurs des input couleur et quantité
			let colorPicked = color.value
			let quantityPicked = quantity.value

			// stocke les infos à ajouter au panier
			let productOrder = {
				productId: productId,
				productColor: colorPicked,
				productQuantity: quantityPicked,
				productName: article.name,
				productPrice: article.price,
				productImg: article.imageUrl,
				productAltTxt: article.altTxt,
			}

			if (productInCart) {
				// si un produit est déjà dans le panier, trouver s'il a le même id et la même couleur
				const resultFind = productInCart.find(
					(p) => p.productId == productId && p.productColor == colorPicked
				)

				if (resultFind) {
					// si oui, modification de la quantité
					const productQuantityOrder = parseInt(productOrder.productQuantity)
					const productQuantityInCart = parseInt(resultFind.productQuantity)

					let newQuantity = productQuantityOrder + productQuantityInCart
					resultFind.productQuantity = newQuantity

					saveCart()

					console.log(
						"Un produit avec une id et une couleur identitque se trouve dans le panier : modification de la quantité"
					)
				} else {
					// sinon, ajout d'un nouveau produit
					productInCart.push(productOrder)
					saveCart()

					console.log(
						"Aucun produit de même id et couleur ne se trouve dans le panier : ajout du nouveau produit"
					)
				}
			} else {
				// si le panier est vide, ajout du premier produit
				productInCart = []
				productInCart.push(productOrder)
				saveCart()

				console.log("Le panier est vide : ajout du premier produit")
			}
		} else {
			// si les éléments couleur ou quantité sont nulles, afficher le message d'erreur
			showMessageMissingSettings()
		}
	})
}
