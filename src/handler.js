const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message:  'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:   'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }



  if (typeof name !== 'string' ||
        typeof year !== 'number' ||
        typeof author !== 'string' ||
        typeof summary !== 'string' ||
        typeof publisher !== 'string' ||
        typeof pageCount !== 'number' ||
        typeof readPage !== 'number' ||
        typeof reading !== 'boolean') {

    const response = h.response({
      status: 'fail',
      message:  'Gagal menambahkan buku. Tipe data tidak sesuai'
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const finished = pageCount === readPage;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBooks);



  const isSuccess = books.filter((books) => books.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  else {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });

    response.code(500);
    return response;
  }


};

const getAllBookHandler = (request) => {
  let filteredBooks = books;

  const { reading, finished, name  } = request.query;

  if (reading !== undefined) {
    const isReading = reading === '1' ? true : reading === '0' ? false : null;

    if (isReading !== null) {
      filteredBooks = books.filter((book) => book.reading === isReading);
    }
  }

  if (finished !== undefined) {
    const isFinished = finished === '1' ? true : finished === '0' ? false : null;

    if (isFinished !== null) {
      filteredBooks = books.filter((book) => book.finished === isFinished);
    }
  }

  if (name !== undefined) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return {
    status: 'success',
    data: {
      books: filteredBooks.map(({ id, name, publisher }) => ({
        id,
        name,
        publisher
      })),
    },
  };
};


const getBooksByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};


const editBooksByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message:  'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:   'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  if (typeof name !== 'string' ||
      typeof year !== 'number' ||
      typeof author !== 'string' ||
      typeof summary !== 'string' ||
      typeof publisher !== 'string' ||
      typeof pageCount !== 'number' ||
      typeof readPage !== 'number' ||
      typeof reading !== 'boolean') {

    const response = h.response({
      status: 'fail',
      message:  'Gagal menambahkan buku. Tipe data tidak sesuai'
    });
    response.code(400);
    return response;
  }


  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    return {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBooksByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { addBookHandler,
  getAllBookHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler
};