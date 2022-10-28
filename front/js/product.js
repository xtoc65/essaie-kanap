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

// Creation de l'evenement au clic du button d'ajout au panier
function gestionPanier(){
    const bouton = document.getElementById("addToCart");
    bouton.addEventListener("click", function(){
        // parseInt de la fonction quantityProduct pour analyser ma chaine de caractère en nombre entier
        const quantity = parseInt(document.getElementById("quantity").value);
        const color = document.getElementById("colors").value;
        // Creation d'un objet type à envoyer dans localStorage
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
    if (produitSelectionner.quantity <= 0 || produitSelectionner.quantity > 100){
        alert ("Veuillez choisir une quantité correcte entre 1 et 100");
        return;
    }
    //si la couleur du produit sélectionner est vide alors on retourne une alerte
    //length regarde la longueur de la chaine de caractère
    if(!produitSelectionner.color.length){ 
        alert ("Veuillez choisir une couleur");
        return;
    }
    //find -> recherche dans le panier
    //p.id ->Se qu'il y a dans le panier, produitSelectionner.id -> produit selectionner
    //On verifie donc si les ID sont les m̂ et on fait pareille avec la couleur
    //&& -> verifie si les deux condition sont vrai
    let produitTrouver = panier.find(p => p.id == produitSelectionner.id && p.color == produitSelectionner.color);

    // quand on trouve le produit dans le panier il faut changer la quantité
    if(produitTrouver != undefined){ //different de undefined il est donc dans le panier
        produitTrouver.quantity += parseInt(produitSelectionner.quantity); //on change donc la quantité
        if(produitTrouver.quantity > 100){
            alert(`le total pour le produit a dépassé 100 dans le panier, la quantité actuelle est ${produitTrouver.quantity}`);
            return;
        }
    }else{ 
        panier.push(produitSelectionner); //produit ajouté au panier
    }
    
    localStorage.setItem("panier", JSON.stringify(panier));
    alert("votre produit a bien été ajoutez dans le panier");
}

gestionPanier(); // appeller la fonction gestion panier 
