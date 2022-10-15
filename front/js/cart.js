let panier = JSON.parse(localStorage.getItem('panier'));
afficher(panier);

async function afficher(panier)
{
   let section= document.getElementById('cart__items'); // on va cherche dans le DOM l'id dans cart.html
   if(!panier)  //si le pannier est vide retourner le message d'alerte
   {
    alert("le panier est vide");
    return;
   }
   for(produit of panier)
   {
        articleElement= document.createElement('article');
        const produitInfo= await fetch("http://localhost:3000/api/products/" + produit.id)
        .then(function(res){ 
            if(res.ok){
                return res.json();
            }
        });
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
        section.appendChild(articleElement);
    }     
    modifierQuantite();
    supprimerProduit();
    calculerTotal(); 
}

//modifier la quantité d'un produit du panier
function modifierQuantite()
{
    document.querySelectorAll('.itemQuantity').forEach(
        quantityElement => 
        {
            quantityElement.addEventListener("click", ()=>
            {
                const produitId = quantityElement.closest('.cart__item').getAttribute('data-id');
                const produitColor = quantityElement.closest('.cart__item').getAttribute('data-color');
                const foundProduct = panier.find(p => p.id == produitId && p.color == produitColor);
                if (foundProduct!=undefined)
                {
                    foundProduct.quantity = quantityElement.value; 
                    localStorage.setItem("panier", JSON.stringify(panier));
                    calculerTotal();
                }        
            })
        }
    )
}

//calculer un prix et la quantité d'un produit du panier
function calculerTotal(){
    let totalQuantite = 0;  
    let totalPrix = 0;         
    document.querySelectorAll('.cart__item__content').forEach(
        contentEl => {
            quantite = contentEl.querySelector('.itemQuantity').value; 
            prix = contentEl.querySelector('.cart__item__content__description').querySelector(':last-child').textContent;
            totalQuantite += parseInt(quantite);
            totalPrix += parseInt(quantite) * parseInt(prix);
        }
    )

    document.getElementById('totalQuantity').textContent = totalQuantite;
    document.getElementById('totalPrice').innerText = totalPrix;

}


//supprimer un produit du panier
function supprimerProduit(){ 
    document.querySelectorAll('.deleteItem').forEach(
        suppirmerElement =>{
            suppirmerElement.addEventListener("click", ()=>
            {
                const produitId = suppirmerElement.closest('.cart__item').getAttribute('data-id');
                const produitColor = suppirmerElement.closest('.cart__item').getAttribute('data-color');
                const foundIndex = panier.findIndex(p => p.id == produitId && p.color == produitColor);
                if (foundIndex != -1)
                {
                    suppirmerElement.closest('.cart__item').remove();
                    panier.splice(foundIndex,1);
                    localStorage.setItem("panier", JSON.stringify(panier));
                    calculerTotal();
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
    /^[a-zA-ZÀ-ÿ]+$/g //Le début du texte commence par des caractéres qu'on peux ecrire plusieur fois.
    );                 // le $ designe la fin de l'expresion réfgulière. g est le marqueur pour dire global;
let nomRegExp = new RegExp(
    /^[a-zA-ZÀ-ÿ]+$/g //Le début du texte commence par des caractéres qu'on peux ecrire plusieur fois.
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

function commander(event){
    event.preventDefault();
    if(prenom == null || nom == null || adresse == null || ville == null || email == null){
        alert("veulliez remplir le fomulaire correctement");
    }
    if(!panier.length){
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
    fetch("http://localhost:3000/api/products/order", {
	    method: 'POST',
	    headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
        },
	    body: JSON.stringify({contact:contact, products:products})
    }).then(function(res){
        if(res.ok){
            return res.json();
        }else{
            alert("la commande n'est pas valide");
        };
    })
    .then(res => {
        if(res.orderId){
            document.location.href = `confirmation.html?orderId=${res.orderId}`;
            localStorage.clear();
        }
    }
    );    
}
document.querySelector(".cart__order__form").addEventListener("submit", commander);