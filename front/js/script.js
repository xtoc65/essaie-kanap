// Récupération des données de l'API avec la méthode fetch
fetch("http://localhost:3000/api/products")//URL de l'API
.then(function(res){
    if(res.ok){
        return res.json(); //Obtention des reponses .json
    }
})
.then(res => afficher(res));


function afficher (produits){
    let section = document.getElementById("items"); //Recuperation du 1er ID #items du HTML
    for(produit of produits){
        let articleElement = document.createElement("article"); //Creation de l'élément <article> dans le HTML
        articleElement.innerHTML = `
        <img src=${produit.imageUrl} alt=${produit.altTxt}>
        <h3 class="productName">${produit.name}</h3>
        <p class="productDescription">${produit.description}</p>`;

        let aElement = document.createElement("a"); //Creation de l'élément <a> dans le HTML
        aElement.setAttribute("href",`./product.html?id=${produit._id}`) // Lien de l'url
        
        aElement.appendChild(articleElement);
        section.appendChild(aElement);
    }
}
