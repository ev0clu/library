import { initializeApp } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    query,
    where,
    onSnapshot,
    setDoc,
    updateDoc,
    doc
} from 'firebase/firestore';

import getFirebaseConfig from './firebase-config';

// --------- Variable declarations  --------- //

let myLibrary = [];

// --------- Document methods --------- //
const userPicElement = document.getElementById('user-pic');
const userNameElement = document.getElementById('user-name');
const signInButtonElement = document.querySelector('.btn-sign-in');
const signOutButtonElement = document.querySelector('.btn-sign-out');

const addButton = document.querySelector('.btn-add');
const closeButton = document.getElementById('btn-close');

const form = document.getElementById('form-content');
const popUpMenu = document.getElementById('modal');

const content = document.getElementById('content');
const warning = document.getElementById('warning');

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');

// Firebase

const firebaseAppConfig = getFirebaseConfig();
const app = initializeApp(firebaseAppConfig);
const database = getFirestore(app);

// Firebase Auth.
async function signIn() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
}

function signOutUser() {
    signOut(getAuth());
}

function getProfilePicUrl() {
    return getAuth().currentUser.photoURL || 'profile_placeholder.png';
}

function getUserName() {
    return getAuth().currentUser.displayName;
}

function getUserId() {
    return getAuth().currentUser.uid;
}

function isUserSignedIn() {
    return !!getAuth().currentUser;
}

function checkSignedInWithMessage() {
    // Return true if the user is signed in Firebase
    if (isUserSignedIn()) {
        return true;
    }

    // Display a message to the user using a Toast.
    alert('You must sign-in first');

    return false;
}

function addSizeToGoogleProfilePic(url) {
    if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
        return url + '?sz=150';
    }
    return url;
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
    if (user) {
        restoreFirebase();
        // User is signed in!
        // Get the signed-in user's profile pic and name.
        const profilePicUrl = getProfilePicUrl();
        const userName = getUserName();

        // Set the user's profile pic and name.
        userPicElement.style.backgroundImage =
            'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
        userNameElement.textContent = userName;

        // Show user's profile
        userNameElement.style.display = 'block';
        userPicElement.style.display = 'block';

        // Hide sign-in button and show sign-out button
        signInButtonElement.style.display = 'none';
        signOutButtonElement.style.display = 'flex';

        addButton.classList.remove('inactive');
    } else {
        resetContentField();
        // User is signed out!
        // Hide user's profile
        userNameElement.style.display = 'none';
        userPicElement.style.display = 'none';

        // Show sign-in button  and sign-out button.
        signInButtonElement.style.display = 'flex';
        signOutButtonElement.style.display = 'none';

        addButton.classList.add('inactive');
    }
}

function initFirebaseAuth() {
    onAuthStateChanged(getAuth(), authStateObserver);
}

// Firebase operations

async function getBooksFromFirebase(db) {
    const bookCollection = collection(db, 'book');
    const querryBookCollection = query(bookCollection, where('userId', '==', getUserId()));
    const bookSnapshot = await getDocs(querryBookCollection);
    const bookList = bookSnapshot.docs.map((doc) => doc.data());

    return bookList;
}

async function deleteBookFromFirebase(book) {
    await deleteDoc(doc(database, 'book', book));
}

async function saveBookToFirebase(book) {
    // Add a new entry to the Firebase database.
    try {
        await setDoc(doc(database, 'book', book.title), {
            userId: getUserId(),
            title: book.title,
            author: book.author,
            pages: book.pages,
            isRead: book.isRead
        });
    } catch (error) {
        console.error('Error writing new book to Firebase Database', error);
    }
}

async function toggleStatusFirebase(book, state) {
    await updateDoc(doc(database, 'book', book.title), {
        isRead: state
    });
}

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
            let state = false;
            if (card.classList.contains('card-read')) {
                card.removeAttribute('class', 'card-read');
                card.setAttribute('class', 'card card-unread');
                button.textContent = 'Mark as read';
                state = false;
            } else {
                card.removeAttribute('class', 'card-unread');
                card.setAttribute('class', 'card card-read');
                button.textContent = 'Mark as unread';
                state = true;
            }
            myLib[bookIndex].isRead = state;
            toggleStatusFirebase(myLib[bookIndex], state);
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
            deleteBookFromFirebase(bookTitle);
            updateBookCards(myLibrary);
            removeCard();
            toggleStatus(myLibrary);
        });
    });
}

async function addBookToLibrary(book) {
    myLibrary.push(book);
}

function initDefaultBooks() {
    const book1 = new Book('Way of the Peaceful Warrior', 'Dan Millman', '216', true);
    const book2 = new Book('Peaceful Heart, Warrior Spirit', 'Dan Millman', '143', false);
    addBookToLibrary(book1);
    addBookToLibrary(book2);
    saveBookToFirebase(book1);
    saveBookToFirebase(book2);
}

// Restore data from Firebase
async function restoreFirebase() {
    myLibrary = await getBooksFromFirebase(database);

    if (!myLibrary.length) {
        // If storage is empty, add default books into the library
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
signOutButtonElement.addEventListener('click', signOutUser);
signInButtonElement.addEventListener('click', signIn);

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
        if (checkSignedInWithMessage()) {
            saveBookToFirebase(newBook);
        }
    }
});

initFirebaseAuth();
