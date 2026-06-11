/* ==========================================================================
    GLOBAL STATE & DOM ELEMENT SELECTIONS
   ========================================================================== */
const myLibrary = [];

// DOM Elements
// [x] TODO: Keep modal and form element references centralized to support open/close logic and validation.
const library = document.getElementById("library");
const addBookButton = document.getElementById("addBookButton");
const addBookModal = document.getElementById("modal");
const addBookForm = document.getElementById("form");
const closeButton = document.getElementById("modalClose");
const cancelButton = document.getElementById("modalCancel");

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

const initialBooks = [
    new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, true),
    new Book("Invisible Cities", "Italo Calvino", 165, false),
    new Book("The Night Circus", "Erin Morgenstern", 505, true)
];

const getCoverUrl = (title) => {
    const label = encodeURIComponent(title);
    return `https://via.placeholder.com/360x520?text=${label}`;
};

/* ==========================================================================
    CORE BUSINESS LOGIC (DATA MANIPULATION)
   ========================================================================== */
/**
 * Adds a new book object instance directly into the array database.
 * @function addBook
 * @param {Object} book - The book properties submitted from the form layout.
 */
const addBook = (book) => {
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
    library.innerHTML = "";

    myLibrary.forEach((book) => {
        const bookCard = document.createElement("article");
        bookCard.classList.add("book");
        bookCard.dataset.bookId = book.bookId;

        bookCard.innerHTML = `
            <div class="book__header">
                <figure class="book__figure">
                    <img src="${getCoverUrl(book.title)}" alt="Cover for ${book.title}" class="book__image" />
                </figure>
            </div>
            <div class="book__body">
                <h3 class="book__title">${book.title}</h3>
                <p class="book__author">by ${book.author}</p>
                <p class="book__pages">${book.pages} pages</p>
                <p class="book__read">${book.isRead ? "Read" : "Not read yet"}</p>
            </div>
            <footer class="book__footer">
                <div class="book__actions">
                    <button class="book__btn book__btn--toggle" type="button" data-book-action="toggle">Toggle Read</button>
                    <button class="book__btn book__btn--remove" type="button" data-book-action="remove">Remove</button>
                </div>
            </footer>`;

        library.appendChild(bookCard);
    });
};

/* Modal Toggle Helpers */
// [x] TODO: Refactored modal open/close logic to keep overlay handling local and avoid global click conflicts.
const showModal = () => {
    addBookModal.classList.remove('hidden');
};

const hideModal = () => {
    addBookModal.classList.add('hidden');
};

/* ==========================================================================
    EVENT LISTENERS & INITIALIZATION
   ========================================================================== */
if (addBookButton && addBookModal && addBookForm && closeButton) {
    addBookButton.addEventListener('click', showModal);
    closeButton.addEventListener('click', hideModal);

    // [x] FIX: close modal only when clicking the backdrop itself, not on any page-level click.
    addBookModal.addEventListener('click', (event) => {
        if (event.target === addBookModal) {
            hideModal();
        }
    });

    addBookForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const pages = Number(document.getElementById("pages").value);
        const isRead = document.getElementById("read").checked;

        if (!title || !author || !pages) {
            return;
        }

        addBook(new Book(title, author, pages, isRead));
        hideModal();
        addBookForm.reset();
        displayBook();
    });

    if (cancelButton) {
        cancelButton.addEventListener('click', hideModal);
    }
}

if (library) {
    library.addEventListener("click", (event) => {
        // [x] REFACTOR: Use semantic data attributes for book card action buttons instead of relying on classes.
        const clickedButton = event.target instanceof Element ? event.target.closest("[data-book-action]") : null;
        if (!clickedButton) return;

        const bookEl = clickedButton.closest(".book");
        if (!bookEl) return;

        const bookId = bookEl.dataset.bookId;
        const libraryBook = bookId ? myLibrary.find((book) => book.bookId === bookId) : undefined;
        const action = clickedButton.dataset.bookAction;

        if (action === "toggle" && libraryBook) {
            libraryBook.toggleRead();
            bookEl.querySelector(".book__read").textContent = libraryBook.isRead ? "Read" : "Not read yet";
        }

        if (action === "remove" && libraryBook) {
            const removeIndex = myLibrary.findIndex((book) => book.bookId === libraryBook.bookId);
            if (removeIndex !== -1) {
                myLibrary.splice(removeIndex, 1);
                displayBook();
            }
        }
    });
}

initialBooks.forEach((book) => myLibrary.push(book));

displayBook();
