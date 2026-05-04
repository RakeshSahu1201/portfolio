// Pure function to create About table accessor
const getAboutTable = (db) => {
  return {
    find: () => db('about').first(),
    create: async (data) => {
      const result = await db('about').insert(data).returning('*');
      return Array.isArray(result) ? result[0] : result;
    },
    update: async (data) => {
      const existing = await db('about').first();
      if (!existing) {
        const result = await db('about').insert(data).returning('*');
        return Array.isArray(result) ? result[0] : result;
      }
      const result = await db('about').where({ id: existing.id }).update(data).returning('*');
      return Array.isArray(result) ? result[0] : result;
    },
    deleteOne: async () => {
      const existing = await db('about').first();
      if (existing) {
        return await db('about').where({ id: existing.id }).delete();
      }
      return null;
    },
  };
};

module.exports = { getAboutTable };
