let panier = JSON.parse(localStorage.getItem('panier'));
afficher(panier);//appelle la fonction aficher panier 

//
async function afficher(panier)
{
   let section = document.getElementById('cart__items'); // on va cherche dans le DOM l'id dans cart.html
   if(!panier)  //si le pannier est vide retourner le message d'alerte
   {
    alert("le panier est vide");
    return;
   }
   for(produit of panier)
   {
        articleElement= document.createElement('article'); // aller dans le DOM puis crée un element HTML
        // Récupération des données de l'API avec la méthode fetch
        const produitInfo = await fetch("http://localhost:3000/api/products/" + produit.id)//URL de l'API et l'Id du produit
        .then(function(res){ 
            if(res.ok){
                return res.json();//Obtention des reponses .json
            }
        });
        //on utilise produit. pour allez le cherchez dans le local Storage
        //on utilise produitInfo. pour allez le cherchez dans l'API
        articleElement.innerHTML=` 
        <article class="cart__item" data-id="${produit.id}" data-color="${produit.color}">  
            <div class="cart__item__img">
                  <img src=${produitInfo.imageUrl} alt=${produitInfo.altTxt}>
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${produitInfo.name}</h2>
                    <p>${produit.color}</p>
                    <p>${produitInfo.price}€</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produit.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>
        `; 
        section.appendChild(articleElement); //on ajoute dans le DOM 
    }     
    modifierQuantite(); //appelle la fonction modifier quantite
    supprimerProduit();//appelle la fonction supprimer produit
    calculerTotal(); //appelle la fonction calculer total 
}

//modifier la quantité d'un produit du panier
function modifierQuantite()
{ 
    //on renvoie tous les éléments de la classe itemQuantity
    document.querySelectorAll('.itemQuantity').forEach( //appelle une fonction pour chaque élément du tableau.
        quantityElement => 
        {
            quantityElement.addEventListener("click", ()=> // addEventListener Ajoute un événement de clic à un élément
            {
                //closest Trouve l'élément le plus proche qui correspond au sélecteur CSS ". cart__item"
                // getAttribute Obtient la valeur de l'attribut de la classe d'un élément ici data-id
                const produitId = quantityElement.closest('.cart__item').getAttribute('data-id');
                const produitColor = quantityElement.closest('.cart__item').getAttribute('data-color');
                //find -> recherche dans le panier
                //p.id ->Se qu'il y a dans le panier, produitId -> const produitId
                //On verifie donc si les ID sont les m̂ et on fait pareille avec la couleur
                //&& -> verifie si les deux condition sont vrai
                const foundProduct = panier.find(p => p.id == produitId && p.color == produitColor);
                if (foundProduct!=undefined)
                {
                    foundProduct.quantity = quantityElement.value; 
                    localStorage.setItem("panier", JSON.stringify(panier)); // on enregistre dans le localStorage
                    calculerTotal();//appelle la fonction calculer total 
                }        
            })
        }
    )
}

//calculer un prix et la quantité d'un produit du panier
function calculerTotal(){
    //On commence avec la quantite et le prix vide
    let totalQuantite = 0;  
    let totalPrix = 0;  
    // on renvoie tous les éléments de la classe cart__item__content       
    document.querySelectorAll('.cart__item__content').forEach(//appelle une fonction pour chaque élément du tableau.
        contentEl => {
            quantite = contentEl.querySelector('.itemQuantity').value; 
            prix = contentEl.querySelector('.cart__item__content__description').querySelector(':last-child').textContent;
            // on utilise parseInt pour renvoyer un entier
            totalQuantite += parseInt(quantite);
            //le prix total = la quantité + le prix
            totalPrix += parseInt(quantite) * parseInt(prix);  
        }
    )

    document.getElementById('totalQuantity').textContent = totalQuantite; //Recuperation de l'ID #totalQuantity du HTML
    document.getElementById('totalPrice').innerText = totalPrix;//Recuperation de l'ID #totalPrice du HTML

}


//supprimer un produit du panier
function supprimerProduit(){ 
     // on renvoie tous les éléments de la classe deleteItem
    document.querySelectorAll('.deleteItem').forEach(//appelle une fonction pour chaque élément du tableau
        suppirmerElement =>{
            suppirmerElement.addEventListener("click", ()=> // addEventListener Ajoute un événement de clic à un élément
            {
                //closest Trouve l'élément le plus proche qui correspond au sélecteur CSS ". cart__item"
                const produitId = suppirmerElement.closest('.cart__item').getAttribute('data-id'); //getAttribute Obtient la valeur de l'attribut de classe d'un élément ‘data-id’
                const produitColor = suppirmerElement.closest('.cart__item').getAttribute('data-color');
                //findIndex() renvoie l'index du premier élément dans un tableau qui satisfait la fonction de test fournie.
                const foundIndex = panier.findIndex(p => p.id == produitId && p.color == produitColor);
                if (foundIndex != -1)
                {
                    suppirmerElement.closest('.cart__item').remove(); //supprimer l'élement du DOM
                    panier.splice(foundIndex,1);//On modifie le tableaux panier
                    localStorage.setItem("panier", JSON.stringify(panier));// on enregistre dans le localStorage
                    calculerTotal();//appelle la fonction calculer total 
                }  
            })
        }
    )
    
}

// ******** Formulaire de validation de la commande & envois de celle-ci à l'API ********

// Récupération de chaque élément du form dans le DOM
let prenomEl = document.getElementById("firstName");
let nomEl = document.getElementById("lastName");
let adresseEl = document.getElementById("address");
let villeEl = document.getElementById("city");
let emailEl = document.getElementById("email");

let prenom;
let nom;
let adresse;
let ville;
let email;

let prenomRegExp = new RegExp(
    /^[a-zA-ZÀ-ÿ\-]+$/g //Le début du texte commence par des caractéres qu'on peux ecrire plusieur fois.
    );                 // le $ designe la fin de l'expresion réfgulière. g est le marqueur pour dire global;
let nomRegExp = new RegExp(
    /^[a-zA-ZÀ-ÿ-]+$/g //Le début du texte commence par des caractéres qu'on peux ecrire plusieur fois.
);                 // le $ designe la fin de l'expresion réfgulière. g est le marqueur pour dire global
let adresseRegExp = new RegExp(
    /^[.0-9a-zA-ZÀ-ÿ\s,-]+$/g //Le début d'une expresion regulière commence par des caractéres qu'on peux ecrire plusieur fois.
);                       // le $ designe la fin de l'expresion réfgulière. g est le marqueur pour dire global
let villeRegExp = new RegExp(
    /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/g //Le début d'une expresion regulière commence par des caractéres qu'on peux ecrire plusieur fois.
);                            // le $ designe la fin de l'expresion réfgulière. g est le marqueur pour dire global
let emailRegExp = new RegExp(
    /^[a-zA-Z0-9\.-_]+[@]{1}[a-zA-Z0-9\.-_]+[\.]{1}[a-z]{2,3}$/g //Le début du texte commence par des caractéres qu'on peux ecrire plusieur fois.On doit retrouvé le @ 1 seule fois
);                                                                // le $ designe la fin de l'expresion réfgulière. g est le marqueur pour dire global

prenomEl.addEventListener('change', function(){
    validationPrenom(this);
});
const validationPrenom = function (prenomEl){
    if(prenomRegExp.test(prenomEl.value)){
        document.getElementById("firstNameErrorMsg").textContent="";
        prenom = prenomEl.value;
    }else{
        document.getElementById("firstNameErrorMsg").textContent="votre prénom n'est pas valide";
        prenom = null;
    }
};

nomEl.addEventListener('change', function(){
    validationNom(this);
});
const validationNom = function (nomEl){
    if(nomRegExp.test(nomEl.value)){
        document.getElementById("lastNameErrorMsg").textContent="";
        nom = nomEl.value;
    }else{
        document.getElementById("lastNameErrorMsg").textContent="votre nom n'est pas valide";
        nom = null;
    }
};

adresseEl.addEventListener('change', function(){
    validationAdresse(this); 
});
const validationAdresse = function (adresseEl){
    if(adresseRegExp.test(adresseEl.value)){
       document.getElementById("addressErrorMsg").textContent="";
       adresse = adresseEl.value;
    }else{
        document.getElementById("addressErrorMsg").textContent="votre adresse n'est pas valide";
        adresse = null;
    }
};

villeEl.addEventListener('change', function(){
    validationVille(this);
});
const validationVille = function (villeEl){
    if(villeRegExp.test(villeEl.value)){
        document.getElementById("cityErrorMsg").textContent="";
        ville = villeEl.value;
    }else{
        document.getElementById("cityErrorMsg").textContent="votre ville n'est pas valide";
        ville = null;
    }
};

emailEl.addEventListener('change', function(){
    validationEmail(this);
});
const validationEmail = function (emailEl){
    if(emailRegExp.test(emailEl.value)){
        document.getElementById("emailErrorMsg").textContent="";
        email = emailEl.value;
    }else{
        document.getElementById("emailErrorMsg").textContent="votre email n'est pas valide";
        email = null;
    }
};
//passer la commande
function commander(event){
    event.preventDefault();
    if(prenom == null || nom == null || adresse == null || ville == null || email == null){
        alert("veulliez remplir le fomulaire correctement");
    }    
    if(!panier.length){//si le panier est vide
        alert("veuillez remplir le panier");
    }
    contact = {
        firstName : prenom,
        lastName : nom,
        address : adresse,
        city : ville,
        email : email
    };
    products = [];//création d'un tableau vide
    panier.forEach(produit => products.push(produit.id));
    // Récupération des données de l'API avec la méthode fetch
    fetch("http://localhost:3000/api/products/order", { //URL de l'API
	    method: 'POST', // on crée ou modifie une resource
	    headers: { 
            'Accept': 'application/json', // indique se que l'on attent
            'Content-Type': 'application/json' // indique les donner qu'on envoie
        },
	    body: JSON.stringify({contact:contact, products:products})  
    }).then(function(res){
        if(res.ok){
            return res.json();//Obtention des reponses .json
        }else{
            alert("la commande n'est pas valide");
        };
    })
    .then(res => {
        if(res.orderId){
            document.location.href = `confirmation.html?orderId=${res.orderId}`; // aller cherche dans le DOM le html pour ajouté le numéro de comande
            localStorage.clear(); // netoyer le pannier quand la commande est passer
        }
    }
    );    
}
document.querySelector(".cart__order__form").addEventListener("submit", commander);