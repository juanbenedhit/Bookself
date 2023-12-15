document.addEventListener('DOMContentLoaded', function () {
  const inputBookTitle = document.getElementById('inputBookTitle');
  const inputBookAuthor = document.getElementById('inputBookAuthor');
  const inputBookYear = document.getElementById('inputBookYear');
  const inputBookIsComplete = document.getElementById('inputBookIsComplete');
  const bookSubmit = document.getElementById('bookSubmit');
  const searchBookTitle = document.getElementById('searchBookTitle');
  const searchSubmit = document.getElementById('searchSubmit');
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');

  let books = getBooksFromStorage();

  renderBooks();

  function getBooksFromStorage() {
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    return storedBooks;
  }

  function saveBooksToStorage(books) {
    localStorage.setItem('books', JSON.stringify(books));
  }

  bookSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    addBook();
  });

  searchSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    searchBooks();
  });

  function addBook() {
    const title = inputBookTitle.value;
    const author = inputBookAuthor.value;
    const year = inputBookYear.value;
    const isComplete = inputBookIsComplete.checked;

    if (title && author && year) {
      const newBook = {
        id: +new Date(),
        title,
        author,
        year: parseInt(year),
        isComplete,
      };

      books.push(newBook);
      saveBooksToStorage(books);

      const bookshelfList = isComplete ? completeBookshelfList : incompleteBookshelfList;
      const bookItem = createBookItem(newBook);
      bookshelfList.appendChild(bookItem);

      inputBookTitle.value = '';
      inputBookAuthor.value = '';
      inputBookYear.value = '';
      inputBookIsComplete.checked = false;
    }
  }

  function searchBooks() {
    const keyword = searchBookTitle.value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(keyword));
    renderBooks(filteredBooks);
  }

  function moveBookToShelf(id, targetShelf) {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
      books[bookIndex].isComplete = targetShelf === 'complete';
      saveBooksToStorage(books);
      renderBooks();
    }
  }

  function deleteBook(id) {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
      const isConfirmed = window.confirm('Apakah Anda yakin ingin menghapus buku ini?');
      if (isConfirmed) {
        books.splice(bookIndex, 1);
        saveBooksToStorage(books);
        renderBooks();
      }
    }
  }

  function createBookItem(book) {
    const bookItem = document.createElement('div');
    bookItem.classList.add('book_item');

    const titleElement = document.createElement('h3');
    titleElement.textContent = book.title;

    const authorElement = document.createElement('p');
    authorElement.textContent = `Penulis: ${book.author}`;

    const yearElement = document.createElement('p');
    yearElement.textContent = `Tahun: ${book.year}`;

    const actionElement = document.createElement('div');
    actionElement.classList.add('action');

    const moveButton = document.createElement('button');
    moveButton.textContent = book.isComplete ? 'Belum Selesai Dibaca' : 'Selesai Dibaca';
    moveButton.classList.add(book.isComplete ? 'green' : 'green');
    moveButton.addEventListener('click', () => moveBookToShelf(book.id, book.isComplete ? 'incomplete' : 'complete'));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hapus';
    deleteButton.classList.add('red');
    deleteButton.addEventListener('click', () => deleteBook(book.id));

    actionElement.appendChild(moveButton);
    actionElement.appendChild(deleteButton);

    bookItem.appendChild(titleElement);
    bookItem.appendChild(authorElement);
    bookItem.appendChild(yearElement);
    bookItem.appendChild(actionElement);

    return bookItem;
  }

  function renderBooks(filteredBooks) {
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    const booksToRender = filteredBooks || books;

    booksToRender.forEach(book => {
      const bookItem = createBookItem(book);

      if (book.isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    });
  }
});
