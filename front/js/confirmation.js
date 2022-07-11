/*****
gère l'affichage et les intéractions de la page confirmation
*****/

// récupère le numéro de commande
function getOrderId() {
	const orderId = new URL(location.href).searchParams.get("id")
	return orderId
}

// modifie le dom
function modifyDom() {
	const orderId = getOrderId()
	document.getElementById("orderId").innerHTML += `${orderId}`
}
modifyDom()
