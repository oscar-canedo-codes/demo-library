/* ==========================================================================
    GLOBAL STATE & DOM ELEMENT SELECTIONS
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

let bookId = crypto.randomUUID(); // Global counter for unique book IDs (if not using crypto.randomUUID)
/* ==========================================================================
    DATA MODELS (CONSTRUCTORS & PROTOTYPES)
   ========================================================================== */
/**
 * Constructor for creating a new Book instance.
 * @function Book
 */
function Book(title, author, pages, isRead, bookId) {
    this.bookId = bookId || crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

Book.prototype.toggleRead = function() {
    this.isRead = !this.isRead;
};

// Instance testing: create and add a hardcoded example so events can be tested
const exampleBook = new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, true, bookId);
console.log(exampleBook);


/* ==========================================================================
    CORE BUSINESS LOGIC (DATA MANIPULATION)
   ========================================================================== */
/**
 * Adds a new book object instance directly into the array database.
 * @function addBook
 * @param {Object} book - The book properties submitted from the form layout.
 */
const addBook = (book) => {
    // Accept either a plain object or an existing Book instance
    if (book instanceof Book) {
        myLibrary.push(book);
        return;
    }

    const newBook = new Book(book.title, book.author, book.pages, book.isRead);
    myLibrary.push(newBook);
};


/* ==========================================================================
    UI RENDER FUNCTIONS (DOM MANIPULATION)
   ========================================================================== */
/**
 * Renders the full collection of books from myLibrary array as DOM element cards.
 * @function displayBook
 */
const displayBook = () => {
    // [x] BUG: This will duplicate cards on screen unless the parent container is cleared first
    // Clear existing content on the container element to prevent duplication
    library.innerHTML = "";

    myLibrary.forEach((book, index) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book");
        // Track unique book id for event delegation and object lookup
        bookCard.dataset.bookId = book.bookId;

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
    EVENT LISTENERS & INITIALIZATION
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
        
        addBook(newBook);

        hideModal();
        addBookForm.reset();
        displayBook(); // Re-render list to show the new card
    });
}

// Event delegation for card interactions (toggle read / remove)
if (library) {
    library.addEventListener("click", (event) => {
        const bookEl = event.target.closest(".book");
        if (!bookEl) return;

        const bookId = bookEl.dataset.bookId;
        const libraryBook = bookId ? myLibrary.find((book) => book.bookId === bookId) : undefined;

        const isToggleButton = event.target.classList.contains("book__toggle-read") || event.target.classList.contains("book__btn--read");
        const isRemoveButton = event.target.classList.contains("book__remove") || event.target.classList.contains("book__btn--remove");

        if (isToggleButton) {
            const readStatusElement = bookEl.querySelector(".book__read");
            if (libraryBook) {
                libraryBook.toggleRead();
                if (readStatusElement) {
                    readStatusElement.textContent = libraryBook.isRead ? "Read" : "Not read yet";
                }
            } else if (readStatusElement) {
                const currentlyRead = readStatusElement.textContent.toLowerCase().includes("read");
                readStatusElement.textContent = currentlyRead ? "Status: Not read yet" : "Status: Read";
            }
        }

        if (isRemoveButton) {
            if (libraryBook) {
                myLibrary.splice(index, 1);
                displayBook();
            } else {
                bookEl.remove();
            }
        }
    });
}
