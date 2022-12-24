/* eslint-disable no-undef */
const { nanoid } = require('nanoid');
const notes = require('./notes');

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus, id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id)[0];

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'succes',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan, id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'ok',
      message: 'notes berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const respone = h.respone({
    status: 'fail',
    message: 'gagal menambahkan catatan',
  });
  respone.code(500);
  response.header('Access-Control-Allow-Origin', '*');
  return respone;
};
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

module.exports = {
  addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editByIdHandler, deleteNoteByIdHandler,
};
