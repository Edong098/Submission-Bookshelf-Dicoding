// Do your work here...

const STORAGE_KEY = 'books';
let editingBookId = null;

function getBooks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function generateId() {
  return new Date().getTime();
}

function renderBooks(searchQuery = '') {
  const books = getBooks();
  const incompleteList = document.getElementById('incompleteBookList');
  const completeList = document.getElementById('completeBookList');

  // Clear existing
  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  let incompleteCount = 0;
  let completeCount = 0;

  books.forEach(book => {
    if (searchQuery && !book.title.toLowerCase().includes(searchQuery.toLowerCase())) return;

    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');

    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Selesai dibaca ✓' : 'Belum selesai dibaca'}</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    if (book.isComplete) {
      completeList.appendChild(bookItem);
      completeCount++;
    } else {
      incompleteList.appendChild(bookItem);
      incompleteCount++;
    }
  });

  // Add empty state messages
  if (incompleteCount === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'empty-message';
    emptyMsg.textContent = 'Belum ada buku.';
    incompleteList.appendChild(emptyMsg);
  }

  if (completeCount === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'empty-message';
    emptyMsg.textContent = 'Belum ada buku.';
    completeList.appendChild(emptyMsg);
  }
}

function addBook(title, author, year, isComplete) {
  const books = getBooks();
  const newBook = {
    id: generateId(),
    title,
    author,
    year: parseInt(year),
    isComplete
  };
  books.push(newBook);
  saveBooks(books);
  renderBooks();
}

function updateBook(bookId, title, author, year, isComplete) {
  const books = getBooks();
  const book = books.find(b => b.id == bookId);
  if (book) {
    book.title = title;
    book.author = author;
    book.year = parseInt(year);
    book.isComplete = isComplete;
    saveBooks(books);
    renderBooks();
  }
}

function toggleComplete(bookId) {
  const books = getBooks();
  const book = books.find(b => b.id == bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks(books);
    renderBooks();
  }
}

function deleteBook(bookId) {
  let books = getBooks();
  books = books.filter(b => b.id != bookId);
  saveBooks(books);
  renderBooks();
}

function editBook(bookId) {
  const books = getBooks();
  const book = books.find(b => b.id == bookId);
  if (book) {
    editingBookId = bookId;
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;
    const statusText = book.isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca';
    document.querySelector('#bookFormSubmit span').textContent = statusText;
    document.getElementById('bookFormSubmit').textContent = 'Update Buku ke rak ' + statusText;
    window.scrollTo(0, 0);
  }
}

function resetForm() {
  editingBookId = null;
  document.getElementById('bookForm').reset();
  document.querySelector('#bookFormSubmit span').textContent = 'Belum selesai dibaca';
  document.getElementById('bookFormSubmit').textContent = 'Masukkan Buku ke rak Belum selesai dibaca';
}

document.addEventListener('DOMContentLoaded', () => {
  renderBooks();

  // Form submit
  const bookForm = document.getElementById('bookForm');
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = document.getElementById('bookFormYear').value;
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    if (editingBookId) {
      updateBook(editingBookId, title, author, year, isComplete);
    } else {
      addBook(title, author, year, isComplete);
    }
    resetForm();
  });

  // Checkbox change to update button text
  document.getElementById('bookFormIsComplete').addEventListener('change', (e) => {
    const isComplete = e.target.checked;
    const statusText = isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca';
    document.querySelector('#bookFormSubmit span').textContent = statusText;
    if (!editingBookId) {
      document.getElementById('bookFormSubmit').textContent = 'Masukkan Buku ke rak ' + statusText;
    } else {
      document.getElementById('bookFormSubmit').textContent = 'Update Buku ke rak ' + statusText;
    }
  });

  // Search form
  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('searchBookTitle').value;
    renderBooks(query);
  });

  // Delegate events for buttons
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.getAttribute('data-testid') === 'bookItemIsCompleteButton') {
      const bookId = target.closest('[data-bookid]').getAttribute('data-bookid');
      toggleComplete(bookId);
    } else if (target.getAttribute('data-testid') === 'bookItemDeleteButton') {
      const bookId = target.closest('[data-bookid]').getAttribute('data-bookid');
      deleteBook(bookId);
    } else if (target.getAttribute('data-testid') === 'bookItemEditButton') {
      const bookId = target.closest('[data-bookid]').getAttribute('data-bookid');
      editBook(bookId);
    }
  });
});
