// Pure function to create Experience table accessor
const getExperienceTable = (db) => {
  return {
    findAll: () => db('experience').orderBy('startDate', 'desc').orderBy('order', 'asc'),
    findById: (id) => db('experience').where({ id }).first(),
    create: (data) => db('experience').insert(data).returning('*'),
    updateById: (id, data) => db('experience').where({ id }).update(data).returning('*'),
    deleteById: (id) => db('experience').where({ id }).delete(),
    deleteAll: () => db('experience').delete(),
  };
};

module.exports = { getExperienceTable };
