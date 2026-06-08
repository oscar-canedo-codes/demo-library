//  BOOK CONSTRUCTOR (OBJECTS STORED IN ARRAY)
/* ARRAY -> Book Objects  */
const myLibrary = [];

// [ ] TODO: Implement unique identifiers for easy card manipulation
// [ ] TODO: Bind UUID generation inside the Book constructor function
const bookId = crypto.randomUUID();

// [ ] TODO: Refactor constructor properties to track id instances
/**
 * Constructor for creating a new Book instance.
 * @function Book
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 * @param {number} pages - The number of pages in the book.
 * @param {boolean} isRead - The read status of the book.
 */
function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}


// DISPLAY BOOKS
// [ ] BUG: Fix rendering duplication loop before rewriting DOM nodes
// [] fix: Clear container innerHTML entirely before mapping the array
// [] fix: Add index dataset attribute strings to target specific cards
/**
 * Renders the full collection of books from myLibrary array as DOM element cards.
 * @function displayBook
 */
const displayBook = () => {
    // ! BUG: This will duplicate cards on screen unless the parent container is cleared first

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


// // ADD BOOK
// [ ] TODO: Build input sanitization for user submittals
// [ ] TODO: Prevent adding completely empty input strings
// [ ] TODO: Restrict the pages field to strictly positive number entries
/**
 * Adds a new book object instance directly into the array database and rerenders screen.
 * @function addBook
 * @param {Object} book - The book properties submitted from the form layout.
 */
const addBook = (book) => {
    const newBook = new Book(book.title, book.author, book.pages, book.isRead);
    myLibrary.push(newBook);
    displayBook();
};


//  REMOVE BOOK & TOGGLE READ STATUS
// [ ] TODO: Expand prototype methods to decouple logic blocks from standard event listeners
// [ ] TODO: Attach a toggleRead prototype function directly to the Book object layout
// [ ] TODO: Add smooth transitions or fade animations when elements are wiped from view


//  EVENT LISTENERS & LOGIC BINDINGS
// * MARK: Centralize layout definitions and capture initialization properties here
const library = document.getElementById("library");
const addBookButton = document.getElementById("addBookButton");
const addBookModal = document.getElementById("modal");
const addBookForm = document.getElementById("form");
const closeButton = document.getElementById("modalClose");
const errorMsg = document.getElementById("errorMsg");

/* EVENT HANDLERS & MODAL MANAGEMENT */
if (addBookButton && addBookModal && closeButton) {
    const showModal = () => {
        addBookModal.classList.remove('hidden');
    };

    const hideModal = () => {
        addBookModal.classList.add('hidden');
    };

    addBookButton.addEventListener('click', showModal);
    closeButton.addEventListener('click', hideModal);

    window.addEventListener('click', (event) => {
        if (event.target === addBookModal) {
            hideModal();
        }
    });

    /* FORM SUBMISSION HANDLING */
    addBookForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const pages = document.getElementById("pages").value;
        const isRead = document.getElementById("read").checked;

        const newBook = new Book(title, author, pages, isRead);
        
        // ! BUG: Array duplication happening here. newBook pushed to array twice via lines below.
        // [] fix: Strip out direct myLibrary.push out of this event block
        myLibrary.push(newBook);
        addBook(newBook);

        hideModal();
        addBookForm.reset();
    });
} else {
    console.error("One or more elements are missing:", { addBookButton, addBookModal, closeButton });
}

/* EVENT DELEGATION -> INTERACTIVE CARD UTILITIES */
// [ ] BUG: .toggleRead() function call fails because it is not defined on the Object yet

library.addEventListener("click", (event) => {
    if (event.target.classList.contains("book__toggle-read")) {
        const index = event.target.closest(".book").dataset.index;
        
        // ! BUG: Resolving this line requires fixing the prototype assignment tracked above
        myLibrary[index].toggleRead();

        const bookCard = event.target.closest(".book");
        const readStatusElement = bookCard.querySelector(".book__read");
        readStatusElement.textContent = myLibrary[index].isRead ? "Read" : "Not read yet";
    }

    if (event.target.classList.contains("book__remove")) {
        const index = event.target.closest(".book").dataset.index;
        myLibrary.splice(index, 1);
        displayBook();
    }
});
