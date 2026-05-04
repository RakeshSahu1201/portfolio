const { getAboutTable } = require('../models/About');

// Pure function factory to create About repository
const createAboutRepository = (db) => {
  const table = getAboutTable(db);

  const find = async () => await table.find();
  const create = async (data) => await table.create(data);
  const update = async (data) => await table.update(data);
  const deleteOne = async () => await table.deleteOne();

  return { find, create, update, deleteOne };
};

module.exports = { createAboutRepository };
