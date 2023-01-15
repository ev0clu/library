// --------- Variable declarations  --------- //

let myLibrary = [];

// --------- Document methods --------- //
const addButton = document.getElementById('btn-add');
const closeButton = document.getElementById('btn-close');

const form = document.getElementById('form-content');
const popUpMenu = document.getElementById('modal');

const content = document.getElementById('content');
const warning = document.getElementById('warning');

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');

// --------- Functions declaration  --------- //

// Constructor
class Book {
    constructor(title, author, pages, isRead) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }
}

function getBookInputs() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const isRead = document.getElementById('read').checked;
    const newBook = new Book(title, author, pages, isRead);
    return newBook;
}

function addBookToLibrary(book) {
    myLibrary.push(book);
    updateBookCards(myLibrary);
}

function updateBookCards(library) {
    resetContentField();
    library.forEach((indexedBook) => {
        createBookCard(indexedBook);
    });
    removeCard();
    toggleStatus();
}

function resetContentField() {
    content.textContent = '';
}

function createBookCard(book) {
    const addCard = document.createElement('div');
    const cardTitle = document.createElement('h1');
    const cardAuthor = document.createElement('p');
    const cardPages = document.createElement('p');
    const isReadButton = document.createElement('button');
    const removeCardButton = document.createElement('button');

    cardTitle.textContent = `${book.title}`;
    cardAuthor.textContent = `${book.author}`;
    cardPages.textContent = `${book.pages} pages read`;

    isReadButton.setAttribute('id', 'btn-read');

    if (book.isRead) {
        addCard.setAttribute('class', `card card-read`);
        isReadButton.textContent = 'Mark as unread';
    } else {
        addCard.setAttribute('class', `card card-unread`);
        isReadButton.textContent = 'Mark as read';
    }

    removeCardButton.setAttribute('id', 'btn-remove');
    removeCardButton.textContent = 'Remove';

    content.appendChild(addCard);
    addCard.appendChild(cardTitle);
    addCard.appendChild(cardAuthor);
    addCard.appendChild(cardPages);
    addCard.appendChild(isReadButton);
    addCard.appendChild(removeCardButton);
}

function removeCard() {
    const removeButton = document.querySelectorAll('#btn-remove');
    removeButton.forEach((button) => {
        button.addEventListener('click', (event) => {
            const bookTitle = event.target.parentNode.firstChild.textContent;
            // Remove the selected book from the myLibrarry
            myLibrary = myLibrary.filter((book) => book.title !== bookTitle);
            updateBookCards(myLibrary);
        });
    });
}

function toggleStatus() {
    const readButton = document.querySelectorAll('#btn-read');
    readButton.forEach((button) => {
        button.addEventListener('click', (event) => {
            const card = event.target.parentNode;
            if (card.classList.contains('card-read')) {
                card.removeAttribute('class', 'card-read');
                card.setAttribute('class', 'card card-unread');
                button.textContent = 'Mark as read';
            } else {
                card.removeAttribute('class', 'card-unread');
                card.setAttribute('class', 'card card-read');
                button.textContent = 'Mark as unread';
            }
        });
    });
}

function openPopUp() {
    popUpMenu.style.display = 'block';
    header.classList.add('inactive');
    main.classList.add('inactive');
    footer.classList.add('inactive');
}

function closePopUp() {
    popUpMenu.style.display = 'none';
    form.reset();
    warning.textContent = '';
    header.classList.remove('inactive');
    main.classList.remove('inactive');
    footer.classList.remove('inactive');
}

function isExistBook(newBook) {
    const booksTitle = getTheTitles(myLibrary);
    return booksTitle.some((title) => title === newBook.title);
}

function getTheTitles(library) {
    return library.map((book) => book.title);
}

// --------- Event listeners --------- //

// Pressed 'Add button' open the Pop up menu
addButton.addEventListener('click', () => {
    openPopUp();
});

// Pressed 'Close button' close the Pop up menu
closeButton.addEventListener('click', () => {
    closePopUp();
});

// Pressed 'Submit button' get book inputs and add them to the library
form.addEventListener('submit', (event) => {
    // default button action should not be taken
    // button does not let to 'submit' the page
    event.preventDefault();
    const newBook = getBookInputs();

    if (isExistBook(newBook)) {
        warning.textContent = 'Already exist in the library';
    } else {
        addBookToLibrary(newBook);
        closePopUp();
    }
});
