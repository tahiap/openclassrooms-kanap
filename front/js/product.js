/* 
gère l'affichage et les intéractions de la page product
*/

const productId = new URL(location.href).searchParams.get("id")
console.log(productId)

fetch("http://localhost:3000/api/products/" + productId)
	.then(function (res) {
		if (res.ok) {
			return res.json()
		}
	})
	.then(function (value) {
		document.querySelector(
			".item__img"
		).innerHTML += `<img src="${value.imageUrl}" alt="${value.altTxt}"></img>`
		document.getElementById("title").innerHTML += `${value.name}`
		document.getElementById("price").innerHTML += `${value.price}`
		document.getElementById("description").innerHTML += `${value.description}`
		for (let i = 0; i < value.colors.length; i++) {
			document.getElementById(
				"colors"
			).innerHTML += `<option value="${value.colors[i]}">${value.colors[i]}</option>`
		}
	})
	.catch(function (err) {
		// Une erreur est survenue
	})
