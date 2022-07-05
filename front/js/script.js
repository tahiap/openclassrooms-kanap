/*****
gère l'affichage et les intéractions de la page d'accueil
*****/

// class Product{
// 	constructor(jsonProduct){
// 		this.name = jsonProduct.name;
// 		this.price = jsonProduct.price;
// 		this.imageUrl = jsonProduct.imageURL;
// 		this.description = jsonProduct.description;
// 		this.altTxt = jsonProduct.altTxt;
// 	}
// }

// créé d'une classe : permet de construire des objets du même type
class Product {
	constructor(jsonProduct) {
		// assigne les valeurs récupérées
		jsonProduct && Object.assign(this, jsonProduct)
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
	// récupère les vraies valeurs et modifie le DOM
	.then(function (value) {
		// boucle qui parcourt l'objet value et créé de nouvelles instances de la classe Product
		for (let jsonProduct of value) {
			let product = new Product(jsonProduct)
			document.getElementById(
				"items"
			).innerHTML += `<a href="./product.html?id=${product._id}">
							<article>
								<img src="${product.imageUrl}" alt="${product.altTxt}, ${product.name}">
								<h3 class="productName">${product.name}</h3>
								<p class="productDescription">${product.description}</p>
							</article>
						</a>`
		}
	})
