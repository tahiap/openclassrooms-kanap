////// gère l'affichage et les intéractions de la page product

// RÉCUPÉRATION DES DONNÉES
// récupère l'id du produit à partir de l'url
const productId = new URL(location.href).searchParams.get("id")

// appel de la fonction
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
	// insère l'image
	let productImg = document.createElement("img")
	document.querySelector(".item__img").appendChild(productImg)
	productImg.setAttribute("src", article.imageUrl)
	productImg.setAttribute("alt", `${article.altTxt}, ${article.name}`)

	// insère le titre
	let productName = document.getElementById("title")
	productName.textContent = article.name

	// insère le prix
	let productPrice = document.getElementById("price")
	productPrice.textContent = article.price

	// insère la description
	let productDescription = document.getElementById("description")
	productDescription.textContent = article.description

	// insère les options de couleur
	for (let color of article.colors) {
		let productColors = document.createElement("option")
		document.getElementById("colors").appendChild(productColors)
		productColors.setAttribute("value", color)
		productColors.textContent = color
	}
	addCart(article)
}

// AJOUT DES PRODUITS DANS LE PANIER
// déclaration des variables pour l'accés au dom
const addToCart = document.getElementById("addToCart")
const color = document.getElementById("colors")
const quantity = document.getElementById("quantity")

// récupère les infos du local storage
let productInCart = JSON.parse(localStorage.getItem("product"))

// enregistre les infos dans le local storage
function saveCart() {
	localStorage.setItem("product", JSON.stringify(productInCart))
}

function addCart() {
	// écoute le bouton d'ajout au panier, les conditions couleur et quantité ne doivent pas être nulles
	addToCart.addEventListener("click", () => {
		if (quantity.value > 0 && quantity.value <= 100 && color.value !== "") {
			// récupère les valeurs des input couleur et quantité
			let colorPicked = color.value
			let quantityPicked = quantity.value

			// stocke les infos à ajouter au panier
			let productOrder = {
				productId: productId,
				productColor: colorPicked,
				productQuantity: quantityPicked,
			}

			if (productInCart) {
				// si un produit est déjà dans le panier, trouver s'il a le même id et la même couleur
				const resultFind = productInCart.find(
					(p) => p.productId === productId && p.productColor === colorPicked
				)

				if (resultFind) {
					// si oui, modification de la quantité
					const productQuantityOrder = parseInt(productOrder.productQuantity)
					const productQuantityInCart = parseInt(resultFind.productQuantity)

					let newQuantity = productQuantityOrder + productQuantityInCart
					resultFind.productQuantity = newQuantity

					saveCart()
				} else {
					// sinon, ajout d'un nouveau produit
					productInCart.push(productOrder)
					saveCart()
				}
			} else {
				// si le panier est vide, ajout du premier produit
				productInCart = []
				productInCart.push(productOrder)
				saveCart()
			}
		} else {
			// si les éléments couleur ou quantité sont nulles, afficher le message d'erreur
			alert("Vous devez choisir une couleur et une quantité !")
		}
	})
}
