// Pure function to create Project table accessor
const getProjectTable = (db) => {
  return {
    findAll: () => db('projects').orderBy('order', 'asc'),
    findById: (id) => db('projects').where({ id }).first(),
    findByTitle: (title) => db('projects').where({ title }).first(),
    create: (data) => db('projects').insert(data).returning('*'),
    updateById: (id, data) => db('projects').where({ id }).update(data).returning('*'),
    deleteById: (id) => db('projects').where({ id }).delete(),
    deleteAll: () => db('projects').delete(),
  };
};

module.exports = { getProjectTable };
