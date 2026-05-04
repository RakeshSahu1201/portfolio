const { createExperienceRepository } = require('../repositories/ExperienceRepository');

// Pure function factory to create Experience service
const createExperienceService = (db, cacheOps) => {
  const repo = createExperienceRepository(db);

  const getCacheKey = (id = 'all') => `experience:${id}`;

  const getAll = async () => {
    const key = getCacheKey();
    const cached = await cacheOps.get(key);
    if (cached) return cached;

    const data = await repo.findAll();
    await cacheOps.set(key, data);
    return data;
  };

  const getById = async (id) => {
    const key = getCacheKey(id);
    const cached = await cacheOps.get(key);
    if (cached) return cached;

    const data = await repo.findById(id);
    if (data) await cacheOps.set(key, data);
    return data;
  };

  const create = async (data) => {
    const experience = await repo.create(data);
    await cacheOps.invalidate('experience:*');
    return experience;
  };

  const update = async (id, data) => {
    const experience = await repo.updateById(id, data);
    await cacheOps.invalidate('experience:*');
    return experience;
  };

  const remove = async (id) => {
    await repo.deleteById(id);
    await cacheOps.invalidate('experience:*');
    return { success: true };
  };

  return { getAll, getById, create, update, remove };
};

module.exports = { createExperienceService };
