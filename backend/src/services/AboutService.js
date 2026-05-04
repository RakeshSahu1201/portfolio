const { createAboutRepository } = require('../repositories/AboutRepository');

const normalizeArrayOfObjects = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  return [];
};

const normalizeObject = (value) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return {};

    try {
      const parsed = JSON.parse(trimmed);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  return {};
};

const serializeAbout = (about) => {
  if (!about) return about;

  return {
    ...about,
    social: normalizeObject(about.social),
    skills: normalizeArrayOfObjects(about.skills),
    education: normalizeArrayOfObjects(about.education),
  };
};

const normalizeAboutWriteData = (data) => {
  const normalized = { ...data };

  if (Object.prototype.hasOwnProperty.call(data, 'social')) {
    normalized.social = JSON.stringify(normalizeObject(data.social));
  }

  if (Object.prototype.hasOwnProperty.call(data, 'skills')) {
    normalized.skills = JSON.stringify(normalizeArrayOfObjects(data.skills));
  }

  if (Object.prototype.hasOwnProperty.call(data, 'education')) {
    normalized.education = JSON.stringify(normalizeArrayOfObjects(data.education));
  }

  return normalized;
};

// Pure function factory to create About service
const createAboutService = (db, cacheOps) => {
  const repo = createAboutRepository(db);

  const getCacheKey = () => 'about:profile';

  const get = async () => {
    const key = getCacheKey();
    const cached = await cacheOps.get(key);
    if (cached) return cached;

    const data = serializeAbout(await repo.find());
    if (data) await cacheOps.set(key, data);
    return data;
  };

  const update = async (data) => {
    const about = serializeAbout(await repo.update(normalizeAboutWriteData(data)));
    await cacheOps.invalidate('about:*');
    return about;
  };

  return { get, update };
};

module.exports = { createAboutService };
