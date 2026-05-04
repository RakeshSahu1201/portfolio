const { createProjectRepository } = require('../repositories/ProjectRepository');

const normalizeTechnologies = (technologies) => {
  if (Array.isArray(technologies)) {
    return technologies.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof technologies === 'string') {
    const trimmed = technologies.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch (error) {
      // Fall back to simple text parsing when the input is not JSON.
    }

    return trimmed
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeImages = (images, image) => {
  if (Array.isArray(images)) {
    return images.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof images === 'string') {
    const trimmed = images.trim();
    if (trimmed) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch (error) {
        // Fall back to simple text parsing when the input is not JSON.
      }

      return trimmed
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  if (typeof image === 'string' && image.trim()) {
    return [image.trim()];
  }

  return [];
};

const serializeProject = (project) => {
  if (!project) return project;

  const technologies = typeof project.technologies === 'string'
    ? normalizeTechnologies(project.technologies)
    : normalizeTechnologies(project.technologies || project.tech_stack);
  const images = typeof project.images === 'string'
    ? normalizeImages(project.images, project.image)
    : normalizeImages(project.images, project.image);

  return {
    ...project,
    technologies,
    images,
    image: images[0] || project.image || '',
  };
};

const normalizeProjectWriteData = (data) => {
  const images = normalizeImages(data.images, data.image);

  return {
    ...data,
    technologies: JSON.stringify(normalizeTechnologies(data.technologies)),
    images: JSON.stringify(images),
    image: images[0] || '',
    link: data.link || '',
    github: data.github || '',
    order: Number.isFinite(Number(data.order)) ? Number(data.order) : 0,
  };
};

// Pure function factory to create Project service
const createProjectService = (db, cacheOps) => {
  const repo = createProjectRepository(db);

  // Pure function to build cache key
  const getCacheKey = (id = 'all') => `projects:${id}`;

  // Pure function to get projects with cache
  const getAll = async () => {
    const key = getCacheKey();
    const cached = await cacheOps.get(key);
    if (cached) return cached;

    const data = (await repo.findAll()).map(serializeProject);
    await cacheOps.set(key, data);
    return data;
  };

  // Pure function to get project by id with cache
  const getById = async (id) => {
    const key = getCacheKey(id);
    const cached = await cacheOps.get(key);
    if (cached) return cached;

    const data = serializeProject(await repo.findById(id));
    if (data) await cacheOps.set(key, data);
    return data;
  };

  // Pure function to create project
  const create = async (data) => {
    const project = serializeProject(await repo.create(normalizeProjectWriteData(data)));
    await cacheOps.invalidate('projects:*');
    return project;
  };

  // Pure function to update project
  const update = async (id, data) => {
    const project = serializeProject(await repo.updateById(id, normalizeProjectWriteData(data)));
    await cacheOps.invalidate('projects:*');
    return project;
  };

  // Pure function to delete project
  const remove = async (id) => {
    await repo.deleteById(id);
    await cacheOps.invalidate('projects:*');
    return { success: true };
  };

  return { getAll, getById, create, update, remove };
};

module.exports = { createProjectService };
