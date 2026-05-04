const { getContactMessageTable } = require('../models/ContactMessage');

// Pure function factory to create Contact repository
const createContactRepository = (db) => {
  const table = getContactMessageTable(db);

  const findAll = async () => await table.findAll();
  const findById = async (id) => await table.findById(id);
  const findByEmail = async (email) => await table.findByEmail(email);
  const create = async (data) => await table.create(data);
  const markRead = async (id) => await table.markRead(id);
  const deleteById = async (id) => await table.deleteById(id);
  const deleteAll = async () => await table.deleteAll();

  return {
    findAll,
    findById,
    findByEmail,
    create,
    markRead,
    deleteById,
    deleteAll,
  };
};

module.exports = { createContactRepository };
