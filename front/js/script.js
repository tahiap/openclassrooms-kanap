////// gère l'affichage et les intéractions de la page d'accueil

// créé une classe : permet de construire des objets du même type
class Product {
	constructor(jsonProduct) {
		// assigne les valeurs récupérées
		this._id = jsonProduct._id
		this.name = jsonProduct.name
		this.price = jsonProduct.price
		this.imageUrl = jsonProduct.imageUrl
		this.description = jsonProduct.description
		this.altTxt = jsonProduct.altTxt
	}
}

// génère une requête http et récupère les articles de l'API
fetch("http://localhost:3000/api/products/")
	// vérifie que la requête s'est bien passée et récupère les données au format json
	.then(function (res) {
		if (res.ok) {
			return res.json()
		}
	})
	// récupère les valeurs et modifie le DOM
	.then(function (value) {
		// boucle qui parcourt l'objet value et créé de nouvelles instances de la classe Product
		for (let jsonProduct of value) {
			let product = new Product(jsonProduct)

			// insère le lien
			let productLink = document.createElement("a")
			document.querySelector(".items").appendChild(productLink)
			productLink.setAttribute("href", `./product.html?id=${product._id}`)

			// insère l'article
			let productArticle = document.createElement("article")
			productLink.appendChild(productArticle)

			// insère l'image
			let productImg = document.createElement("img")
			productArticle.appendChild(productImg)
			productImg.setAttribute("src", product.imageUrl)
			productImg.setAttribute("alt", `${product.altTxt}, ${product.name}`)

			// insère le titre
			let productName = document.createElement("h3")
			productArticle.appendChild(productName)
			productName.classList.add("productName")
			productName.textContent = product.name

			// insère la description
			let productDescription = document.createElement("p")
			productArticle.appendChild(productDescription)
			productDescription.classList.add("productDescription")
			productDescription.textContent = product.description
		}
	})
	.catch(function (err) {
		console.log("Il y a eu un problème avec l'opération fetch: " + err.message)
	})
