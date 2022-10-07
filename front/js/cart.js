let panier = JSON.parse(localStorage.getItem('panier'));
afficher(panier);

async function afficher(panier)
{
   let section= document.getElementById('cart__items');
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



function supprimerProduit(){ //retirer un produit du panier
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

