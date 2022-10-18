const currentUrl = new URL(window.location.href);// renvoie le href, l'URL de la page en cours
const productId = currentUrl.searchParams.get("id"); // va nous donner l'id du produit 
let panier = JSON.parse(localStorage.getItem('panier'));

// Récupération des données de l'API avec la méthode fetch
fetch("http://localhost:3000/api/products/" + productId)//URL de l'API et l'Id du produit
.then(function(res){
    if(res.ok){
        return res.json();//Obtention des reponses .json
    }
})
.then(res => afficher(res));

function afficher(produit){
    //Obtenir le premier élément avec class="item__img" et permet de mettre du HMTL dans le DOM avec innerHTML
    document.querySelector(".item__img").innerHTML = `<img src=${produit.imageUrl} alt=${produit.altTxt}>`; 
    // on va dans le DOM et on accède a l'ID dans le HTML et permet de mettre du texte avec textContent
    document.getElementById("title").textContent = produit.name; 
    document.getElementById("price").textContent = produit.price;
    document.getElementById("description").textContent = produit.description; 
    //Pour chaque produit.colors on le met dans une variable qu'on appelle color
    for (color of produit.colors){//permet de répété une instruction plusieur fois
        const colorOption = document.createElement('option');//Creation de la balise <option> dans le HTML
        colorOption.setAttribute('value', color);
        colorOption.textContent= color;
        //appendChild permet d'ajouté sans écrasé se qui existe
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
        panier = []; //création d'un tableau vide
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

