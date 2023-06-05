// Dichiarazione di variabili globali
const cardSection = document.getElementById('card-section');
const cartList = document.getElementById('cart-list');
const noResultsMessage = document.getElementById('no-results-message');

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

// Funzione per ottenere i libri dalla API
const fetchBooks = async () => {
  try {
    const response = await fetch('https://striveschool-api.herokuapp.com/books');
    if (response.ok) {
      const books = await response.json();
      if (books.length > 0) {
        noResultsMessage.style.display = 'none';
        renderBooks(books);
      } else {
        noResultsMessage.style.display = 'block';
      }
    } else {
      console.error('Si è verificato un errore nella risposta della API');
    }
  } catch (error) {
    console.error('Si è verificato un errore durante la richiesta dei libri:', error);
  }
};

// Funzione per rendere visibili le informazioni dei libri nella pagina index.html
const renderBooks = (books) => {
  cardSection.innerHTML = '';

  books.forEach(book => {
    const card = document.createElement('div');
    card.classList.add('card', 'm-3', 'p-2');
    card.style.width = '18rem';

    const image = document.createElement('img');
    image.src = book.img;
    image.classList.add('card-img-top');
    image.alt = book.title;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('h5');
    title.textContent = book.title;
    title.classList.add('card-title');

    const price = document.createElement('p');
    price.textContent = `Prezzo: ${book.price}`;
    price.classList.add('card-text');

    const id = book.asin;

    const addButton = document.createElement('button');
    addButton.textContent = 'Aggiungi al carrello';
    addButton.classList.add('btn', 'btn-success');
    addButton.addEventListener("click", () =>{
      card.style.borderColor = "red";
            //istruzioni per aggiungere le info del libro come li alla ol
            let cartList = document.getElementById("cart-list");
            let newLi = document.createElement("li");
            newLi.innerText = "Titolo: " + book.title + "Prezzo: " + book.price;
            cartList.appendChild(newLi);
            //creazione del bottone per rimuovere ogni li
            let deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-warning");
            deleteButton.textContent = "Delete";
            newLi.appendChild(deleteButton);
            let cartInfoContainer = document.getElementById("cart-info-container");
            cartInfoContainer.classList.remove("d-none");
            //istruzioni per settare l'attributo price e usarlo nella funzione updatePrice
            newLi.setAttribute("data-price", book.price);
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

    let hideButton = document.createElement("button");
        hideButton.classList.add("btn", "btn-primary");
        hideButton.style.marginTop = ("2px");
        hideButton.style.marginBottom = ("2px");
        hideButton.textContent = "Nascondi";
        //creazione del listener per far scomparire la card al click
        hideButton.addEventListener("click", () => {
          card.style.display = "none";
        })

    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'Dettagli';
    detailsButton.classList.add('btn', 'btn-secondary');
    detailsButton.addEventListener("click", ()=>{
      redirectToDetailsPage(id);
    })

    cardBody.appendChild(title);

    cardBody.appendChild(price);
    cardBody.appendChild(addButton);
    cardBody.appendChild(hideButton);
    cardBody.appendChild(detailsButton);

    card.appendChild(image);
    card.appendChild(cardBody);

    cardSection.appendChild(card);
  });
};

// Funzione per reindirizzare alla pagina dei dettagli con l'ID del libro come parametro

const redirectToDetailsPage = (id) => {
  window.location.href = `dettagli.html?id=${id}`;
};

// Funzione per ottenere i search params e visualizzare i dettagli del libro corrispondente
const fetchBookDetails = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  try {
    const response = await fetch(`https://striveschool-api.herokuapp.com/books/` + bookId);
    if (response.ok) {
      const book = await response.json();
      renderBookDetails(book);
    } else {
      console.error('Si è verificato un errore nella risposta della API');
    }
  } catch (error) {
    console.error('Si è verificato un errore durante la richiesta dei dettagli del libro:', error);
  }
};

// Funzione per rendere visibili i dettagli del libro nella pagina dettagli.html
const renderBookDetails = (book) => {
  const bookDetailsContainer = document.getElementById('book-details');
  bookDetailsContainer.style.marginLeft = "20px";
  bookDetailsContainer.style.marginTop = "20px";

  const title = document.createElement('p');
  title.textContent = "Titolo: " + book.title;

  const category = document.createElement('p');
  category.textContent = "Categoria: " + book.category;

  const price = document.createElement('p');
  price.textContent = "Prezzo: " + book.price;

  const img = document.createElement("img");
  img.src = book.img;
  img.style.width = "150px";

  let goBackButton = document.createElement("a");
  goBackButton.classList.add("btn", "btn-info");
  goBackButton.textContent = "Torna indietro";
  goBackButton.href = "index.html";

  bookDetailsContainer.appendChild(title);
  bookDetailsContainer.appendChild(img);
  bookDetailsContainer.appendChild(category);
  bookDetailsContainer.appendChild(price);
  bookDetailsContainer.appendChild(goBackButton);
};

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

// Funzione per avviare l'applicazione
const startApp = () => {
  if (window.location.pathname === '/dettagli.html') {
    fetchBookDetails();
  } else {
    fetchBooks();
  }
};

startApp();
