const { getProjectTable } = require('../models/Project');

// Pure function factory to create Project repository
const createProjectRepository = (db) => {
  const table = getProjectTable(db);

  const findAll = async () => await table.findAll();
  const findById = async (id) => await table.findById(id);
  const findByTitle = async (title) => await table.findByTitle(title);
  const create = async (data) => {
    const result = await table.create(data);
    return Array.isArray(result) ? result[0] : result;
  };
  const updateById = async (id, data) => {
    const result = await table.updateById(id, data);
    return Array.isArray(result) ? result[0] : result;
  };
  const deleteById = async (id) => await table.deleteById(id);
  const deleteAll = async () => await table.deleteAll();

  return {
    findAll,
    findById,
    findByTitle,
    create,
    updateById,
    deleteById,
    deleteAll,
  };
};

module.exports = { createProjectRepository };
