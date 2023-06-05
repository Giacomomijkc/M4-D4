//funzione per rimuovere tutti i libri dal carrello

function deleteCart() {
  let cartList = document.getElementById("cart-list");
  if (cartList.childElementCount > 0){
    while (cartList.firstChild) {
      cartList.firstChild.remove();
    }

    //istruzioni per far scomparire la sezione con i contenuti del carrello se non sono presenti contenuti
    let cartInfoContainer = document.getElementById("cart-info-container");
    cartInfoContainer.classList.add("d-none");
    //istruzioni per riportare il bordo colorato delle card selezionate al colore originale
    let cards = document.querySelectorAll(".card");
    for (let index = 0; index < cards.length; index++) {
      cards[index].style.borderColor  = "lightgray"; 
    }
  } 
}

//funzione per mostrare il prezzo totale dei libri a carrello
function updateTotalPrice() {
  let cartList = document.getElementById("cart-list");
  let items = cartList.querySelectorAll("li");
  let totalPrice = 0;

  items.forEach((item) => {
    //istruzione per prendere il valore "prezzo" dal li
    let price = parseFloat(item.getAttribute("data-price"));
    if (!isNaN(price)) {
      totalPrice += price;
    }
  });

  let cartInfoTitle = document.getElementById("cart-info-title");
  cartInfoTitle.innerText = "Prezzo totale: " + totalPrice.toFixed(2);
}


// fetch per inserire tutti libri in pagina

window.onload = () => {
  fetchBooks()
}

const endPointUrl = "https://striveschool-api.herokuapp.com/books";

const fetchBooks = () => {
  fetch(endPointUrl)
  .then(response => response.json())
  .then(data => {
    let myArray = data;
    let cardSection = document.getElementById("card-section");
    cardSection.innerHTML = ""; 
    //istruzione per ciclare gli elementi dell'array e prendere i valori necessari per costruire la card di ogni libro
    myArray.forEach((item) => {
        let myCategory = item.category;
        let myTitle = item.title;
        let myPrice = item.price;
        let myImg = item.img;
        let card = document.createElement("div");
        card.classList.add("card");
        card.style.width = "18rem";
        card.style.marginTop = "20px";
        card.style.marginBottom = "20px";
        let image = document.createElement("img");
        image.classList.add("card-img-top");
        image.src = myImg;
        image.alt = "Card image cap";
        card.appendChild(image);
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardBody.textContent = "Category: " + myCategory + "Price: " + myPrice ;
        let cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = myTitle;
        let addButton = document.createElement("button");
        addButton.classList.add("btn", "btn-success");
        addButton.textContent = "Aggiungi al carrello";
        addButton.style.marginTop = ("2px");
        addButton.style.marginBottom = ("2px");
        //istruzioni per aggiungere un listener di tipo click al bottone per aggiungere al carrello
        addButton.addEventListener("click", () =>{
            card.style.borderColor = "red";
            //istruzioni per aggiungere le info del libro come li alla ol
            let cartList = document.getElementById("cart-list");
            let newLi = document.createElement("li");
            newLi.innerText = "Titolo: " + myTitle + "Prezzo: " + myPrice;
            cartList.appendChild(newLi);
            //creazione del bottone per rimuovere ogni li
            let deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-warning");
            deleteButton.textContent = "Delete";
            newLi.appendChild(deleteButton);
            let cartInfoContainer = document.getElementById("cart-info-container");
            cartInfoContainer.classList.remove("d-none");
            //istruzioni per settare l'attributo price e usarlo nella funzione updatePrice
            newLi.setAttribute("data-price", myPrice);
            //creazione del lsitener sul bottone per rimuovere il li
            deleteButton.addEventListener("click", () => {
              newLi.remove();
              card.style.borderColor = "lightgrey";
              if (cartList.childElementCount === 0) {
                cartInfoContainer.classList.add("d-none");
              }
              //richiamo funzione per aggiornare il prezzo
              updateTotalPrice();
            });
            //richiamo funzione per aggiornare il prezzo
            updateTotalPrice();
        })
        //creazione del bottone per nascondere la card
        let hideButton = document.createElement("button");
        hideButton.classList.add("btn", "btn-primary");
        hideButton.style.marginTop = ("2px");
        hideButton.style.marginBottom = ("2px");
        hideButton.textContent = "Nascondi";
        //creazione del listener per far scomparire la card al click
        hideButton.addEventListener("click", () => {
          card.style.display = "none";
        })
        cardTitle.appendChild(addButton);
        cardTitle.appendChild(hideButton);
        cardBody.appendChild(cardTitle);
        card.appendChild(cardBody);
        cardSection.appendChild(card);
    });
    
  })
  .catch(error => {
    // Gestisci eventuali errori qui
    console.error('Si è verificato un errore:', error);
  });
}

//funzione per cercare i libri dalla barra di ricerca
const searchBook = (event) => {
  let query = event.target.value.toLowerCase();
  let cards = document.querySelectorAll(".card");
  let hasResult = false;
  let noResultsMessage = document.getElementById("no-results-message");

  if (query === " ") {
    // Mostra tutte le card quando la query è vuota
    noResultsMessage.style.display = "none";
    cards.forEach((card) => {
      card.style.display = "block";
    });
  } else {
    // Filtra le card in base alla query di ricerca
    cards.forEach((card) => {
      const title = card.querySelector(".card-body h5.card-title");

      if (title.innerText.toLowerCase().includes(query)) {
        card.style.display = "block";
        hasResult = true;
      } else {
        card.style.display = "none";
      }
    });
  }

  // Mostra un messaggio se non ci sono risultati
  if (hasResult) {
    noResultsMessage.style.display = "none";
  } else {
    noResultsMessage.style.display = "block";
  }
};

