/* ==========================================================================
   1. GLOBAL STATE & DOM ELEMENT SELECTIONS
   ========================================================================== */
const myLibrary = [];

// DOM Elements
const library = document.getElementById("library");
const addBookButton = document.getElementById("addBookButton");
const addBookModal = document.getElementById("modal");
const addBookForm = document.getElementById("form");
const closeButton = document.getElementById("modalClose");
const errorMsg = document.getElementById("errorMsg");
const isRead = document.getElementById("isRead");

// Unique ID generation stub
let bookId = crypto.randomUUID();


/* ==========================================================================
   2. DATA MODELS (CONSTRUCTORS & PROTOTYPES)
   ========================================================================== */
/**
 * Constructor for creating a new Book instance.
 * @function Book
 */
function Book(title, author, pages, isRead, bookId) {
    this.bookId = bookId;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

Book.prototype.toggleRead = function() {
    this.isRead = !this.isRead;
};

// Instance testing
const exampleBook = new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, true, bookId);
console.log(exampleBook);


/* ==========================================================================
   3. CORE BUSINESS LOGIC (DATA MANIPULATION)
   ========================================================================== */
/**
 * Adds a new book object instance directly into the array database.
 * @function addBook
 * @param {Object} book - The book properties submitted from the form layout.
 */
const addBook = (book) => {
    const newBook = new Book(book.title, book.author, book.pages, book.isRead);
    myLibrary.push(newBook);
};


/* ==========================================================================
   4. UI RENDER FUNCTIONS (DOM MANIPULATION)
   ========================================================================== */
/**
 * Renders the full collection of books from myLibrary array as DOM element cards.
 * @function displayBook
 */
const displayBook = () => {
    // [x] BUG: This will duplicate cards on screen unless the parent container is cleared first
    myLibrary.textContent = ""; // Clear existing content to prevent duplication

    myLibrary.forEach((book, index) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book");
        bookCard.dataset.index = index;

        bookCard.innerHTML = `
        <h3 class="book__title">${book.title}</h3>
        <p class="book__author">by ${book.author}</p>
        <p class="book__pages">${book.pages} pages</p>
        <p class="book__read">${book.isRead ? "Read" : "Not read yet"}</p>
        <button class="book__toggle-read">Toggle Read</button>
        <button class="book__remove">Remove</button>`;
        library.appendChild(bookCard);
    });
};

/* Modal Toggle Helpers */
const showModal = () => {
    addBookModal.classList.remove('hidden');
};

const hideModal = () => {
    addBookModal.classList.add('hidden');
};


/* ==========================================================================
   5. EVENT LISTENERS & INITIALIZATION
   ========================================================================== */

// Form Submission Execution
if (addBookButton && addBookModal && closeButton) {
    addBookButton.addEventListener('click', showModal);
    closeButton.addEventListener('click', hideModal);

    window.addEventListener('click', (event) => {
        if (event.target === addBookModal) {
            hideModal();
        }
    });

    addBookForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const pages = document.getElementById("pages").value;
        const isRead = document.getElementById("read").checked;

        const newBook = new Book(title, author, pages, isRead);
        
        // ! BUG: Array duplication happening here. 
        addBook(newBook);

        hideModal();
        addBookForm.reset();
    });
} 

// Global/Hardcoded Toggle Listener
isRead.addEventListener("click", () => {
    book.toggleRead();
    library.textContent = ""; 
    displayBook();
});
