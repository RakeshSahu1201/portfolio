const fs = require('fs/promises');
const path = require('path');
const { getProjectTable } = require('../models/Project');
const { getExperienceTable } = require('../models/Experience');
const { getAboutTable } = require('../models/About');

const portfolioDataPath = path.join(__dirname, '../data/portfolio.json');

const readPortfolioBootstrapFile = async () => {
  const content = await fs.readFile(portfolioDataPath, 'utf8');
  return JSON.parse(content);
};

const serializeAbout = (about = {}) => ({
  ...about,
  social: JSON.stringify(about.social || {}),
  skills: JSON.stringify(Array.isArray(about.skills) ? about.skills : []),
  education: JSON.stringify(Array.isArray(about.education) ? about.education : []),
});

const serializeProject = (project = {}) => {
  const images = Array.isArray(project.images) ? project.images : [];

  return {
    ...project,
    technologies: JSON.stringify(Array.isArray(project.technologies) ? project.technologies : []),
    images: JSON.stringify(images),
    image: images[0] || '',
    link: project.link || '',
    github: project.github || '',
    order: Number.isFinite(Number(project.order)) ? Number(project.order) : 0,
  };
};

const serializeExperience = (experience = {}) => ({
  ...experience,
  endDate: experience.endDate || null,
  description: experience.description || '',
  order: Number.isFinite(Number(experience.order)) ? Number(experience.order) : 0,
});

const syncPortfolioBootstrapData = async (db) => {
  const data = await readPortfolioBootstrapFile();
  const projectsTable = getProjectTable(db);
  const experienceTable = getExperienceTable(db);
  const aboutTable = getAboutTable(db);

  await projectsTable.deleteAll();
  await experienceTable.deleteAll();
  await aboutTable.deleteOne();

  for (const project of data.projects || []) {
    await projectsTable.create(serializeProject(project));
  }

  for (const item of data.experience || []) {
    await experienceTable.create(serializeExperience(item));
  }

  await aboutTable.create(serializeAbout(data.about || {}));

  return {
    projects: Array.isArray(data.projects) ? data.projects.length : 0,
    experience: Array.isArray(data.experience) ? data.experience.length : 0,
  };
};

module.exports = {
  portfolioDataPath,
  readPortfolioBootstrapFile,
  syncPortfolioBootstrapData,
};
