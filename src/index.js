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

// --------- Class declaration --------- //
class Book {
    constructor(title, author, pages, isRead) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }
}

// --------- Functions declaration  --------- //
// Save to Local Storage
function saveLocal() {
    localStorage.setItem('Library', JSON.stringify(myLibrary));
}

function getBookInputs() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const isRead = document.getElementById('read').checked;
    const newBook = new Book(title, author, pages, isRead);
    return newBook;
}

function resetContentField() {
    content.textContent = '';
}

function createBookCard(book, index) {
    const addCard = document.createElement('div');
    addCard.setAttribute('data-index', `${index}`);
    const cardTitle = document.createElement('h1');
    const cardAuthor = document.createElement('p');
    const cardPages = document.createElement('p');
    const isReadButton = document.createElement('button');
    const removeCardButton = document.createElement('button');

    cardTitle.textContent = `${book.title}`;
    cardAuthor.textContent = `${book.author}`;
    cardPages.textContent = `${book.pages} pages read`;

    isReadButton.setAttribute('class', 'btn-read');

    if (book.isRead) {
        addCard.setAttribute('class', `card card-read`);
        isReadButton.textContent = 'Mark as unread';
    } else {
        addCard.setAttribute('class', `card card-unread`);
        isReadButton.textContent = 'Mark as read';
    }

    removeCardButton.setAttribute('class', 'btn-remove');
    removeCardButton.textContent = 'Remove';

    content.appendChild(addCard);
    addCard.appendChild(cardTitle);
    addCard.appendChild(cardAuthor);
    addCard.appendChild(cardPages);
    addCard.appendChild(isReadButton);
    addCard.appendChild(removeCardButton);
}

function updateBookCards(library) {
    resetContentField();

    for (let i = 0; i < library.length; i++) {
        createBookCard(library[i], i);
    }
}

function toggleStatus(library) {
    const readButton = document.querySelectorAll('.btn-read');
    readButton.forEach((button) => {
        button.addEventListener('click', (event) => {
            const card = event.target.parentNode;
            const bookIndex = card.dataset.index;
            const myLib = library;
            if (card.classList.contains('card-read')) {
                card.removeAttribute('class', 'card-read');
                card.setAttribute('class', 'card card-unread');
                button.textContent = 'Mark as read';
                myLib[bookIndex].isRead = false;
            } else {
                card.removeAttribute('class', 'card-unread');
                card.setAttribute('class', 'card card-read');
                button.textContent = 'Mark as unread';
                myLib[bookIndex].isRead = true;
            }
            saveLocal();
        });
    });
}

function removeCard() {
    const removeButton = document.querySelectorAll('.btn-remove');
    removeButton.forEach((button) => {
        button.addEventListener('click', (event) => {
            const bookTitle = event.target.parentNode.firstChild.textContent;
            // Remove the selected book from the myLibrarry
            myLibrary = myLibrary.filter((book) => book.title !== bookTitle);
            saveLocal();
            updateBookCards(myLibrary);
            removeCard();
            toggleStatus(myLibrary);
        });
    });
}

function addBookToLibrary(book) {
    myLibrary.push(book);
    saveLocal();
}

function initDefaultBooks() {
    const book1 = new Book('Way of the Peaceful Warrior', 'Dan Millman', '216', true);
    const book2 = new Book('Peaceful Heart, Warrior Spirit', 'Dan Millman', '143', false);
    addBookToLibrary(book1);
    addBookToLibrary(book2);
}

// Restore from Local Storage
function restoreLocal() {
    myLibrary = JSON.parse(localStorage.getItem('Library'));

    if (myLibrary == null) {
        // If localstorage is empty, add default books into the library
        myLibrary = [];
        initDefaultBooks();
        updateBookCards(myLibrary);
        removeCard();
        toggleStatus(myLibrary);
    } else {
        updateBookCards(myLibrary);
        removeCard();
        toggleStatus(myLibrary);
    }
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

function getTheTitles(library) {
    return library.map((book) => book.title);
}

function isExistBook(newBook) {
    const booksTitle = getTheTitles(myLibrary);
    return booksTitle.some((title) => title === newBook.title);
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

        updateBookCards(myLibrary);
        removeCard();
        toggleStatus(myLibrary);
    }
});

// Restore myLibrary from Local Storage
restoreLocal();
