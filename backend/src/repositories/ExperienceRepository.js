const { getExperienceTable } = require('../models/Experience');

// Pure function factory to create Experience repository
const createExperienceRepository = (db) => {
  const table = getExperienceTable(db);

  const findAll = async () => await table.findAll();
  const findById = async (id) => await table.findById(id);
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
    create,
    updateById,
    deleteById,
    deleteAll,
  };
};

module.exports = { createExperienceRepository };
