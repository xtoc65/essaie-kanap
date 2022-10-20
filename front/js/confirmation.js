// on va récupérer l’URL du page courante
const url = window.location.href;
const urlObject = new URL(url);
//on va retourne la première valeur associée au paramètre de recherche donné
const orderId = urlObject.searchParams.get("orderId");

document.getElementById("orderId").textContent = orderId;//Recuperation de l'ID orderId du HTML