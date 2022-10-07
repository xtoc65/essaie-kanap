const currentUrl = new URL(window.location.href);
const productId = currentUrl.searchParams.get("id");
let panier = JSON.parse(localStorage.getItem('panier'));

fetch("http://localhost:3000/api/products/" + productId)
.then(function(res){
    if(res.ok){
        return res.json();
    }
})
.then(res => afficher(res));

function afficher(produit){
    document.querySelector(".item__img").innerHTML = `<img src=${produit.imageUrl} alt=${produit.altTxt}>`;
    document.getElementById("title").textContent = produit.name;
    document.getElementById("price").textContent = produit.price;
    document.getElementById("description").textContent = produit.description;
    for (color of produit.colors){
        const colorOption = document.createElement('option');
        colorOption.setAttribute('value', color);
        colorOption.textContent= color;
        document.getElementById("colors").appendChild(colorOption);
    }
}

function gestionPanier(){
    const bouton = document.getElementById("addToCart");
    bouton.addEventListener("click", function(){
        const quantity = parseInt(document.getElementById("quantity").value);
        const color = document.getElementById("colors").value;
        const produitSelectionner = {
            id:productId,
            quantity:quantity,
            color:color,
        }
        ajouterAuPanier(produitSelectionner);
    })
}


function ajouterAuPanier(produitSelectionner){ //ajouté un produit au panier
    if (panier == null){
        panier = []; 
    } 
    if (produitSelectionner.quantity <= 0){
        alert ("Veuillez choisir un nombre d'article")
        return;
    }
    if(!produitSelectionner.color.length){
        alert ("Veuillez choisir une couleur")
        return;
    }
    let foundProduct = panier.find(p => p.id == produitSelectionner.id && p.color == produitSelectionner.color);
    if(foundProduct != undefined){
        foundProduct.quantity += produitSelectionner.quantity;
    }else{
        panier.push(produitSelectionner);
    }
    
    localStorage.setItem("panier", JSON.stringify(panier));
}

gestionPanier();

