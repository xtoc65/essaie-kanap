fetch("http://localhost:3000/api/products")
.then(function(res){
    if(res.ok){
        return res.json();
    }
})
.then(res => afficher(res));


function afficher (produits){
    let section = document.getElementById("items");
    for(produit of produits){
        let articleElement = document.createElement("article");
        articleElement.innerHTML = `
        <img src=${produit.imageUrl} alt=${produit.altTxt}>
        <h3 class="productName">${produit.name}</h3>
        <p class="productDescription">${produit.description}</p>`;

        let aElement = document.createElement("a");
        aElement.setAttribute("href",`./product.html?id=${produit._id}`)
        
        aElement.appendChild(articleElement);
        section.appendChild(aElement);
    }
}
