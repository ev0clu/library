// --------- Variable declarations  --------- //

let myLibrary = [];

// --------- Document methods --------- //
const addButton = document.getElementById('btn-add');
const closeButton = document.getElementById('btn-close');
const form = document.getElementById('form-content');
const popUpMenu = document.getElementById('popup');

const title = document.getElementById('title');
const author = document.getElementById('author');
const pages = document.getElementById('pages');
const read = document.getElementById('read');

// --------- Functions declaration  --------- //

function Book(titleValue, authorValue, pagesValue, readValue) {
    // the constructor...
    this.titleValue = titleValue;
    this.authorValue = authorValue;
    this.pagesValue = pagesValue;
    this.readValue = readValue;
}

Book.prototype.bookInfo = function () {
    console.log(this.titleValue, this.authorValue, this.pagesValue, this.readValue);
};

function addBookToLibrary() {
    // do stuff here
}

function resetPopUp() {
    popUpMenu.style.display = 'none';
    title.value = '';
    author.value = '';
    pages.value = '';
    read.checked = false;
}

// --------- Event listeners --------- //

// Pressed 'Add button' open the Pop up menu
addButton.addEventListener('click', () => {
    popUpMenu.style.display = 'block';
});

// Pressed 'Close button' close the Pop up menu
closeButton.addEventListener('click', () => {
    resetPopUp();
});

// Pressed 'Submit button' send book infos
form.addEventListener('submit', (event) => {
    // default button action should not be taken
    // button does not let to 'submit' the page
    event.preventDefault();
    console.log(title.value, author.value, pages.value, read.checked);
    const newBook = new Book(title.value, author.value, pages.value, read.checked);
    newBook.bookInfo();

    resetPopUp();
});
