import { createResumeTemplate } from '../content/resumeTemplate';

const clone = (value) => JSON.parse(JSON.stringify(value));

const findMatch = (pattern, text) => text.match(pattern)?.[1]?.trim() || '';

export const parseResumeText = (text) => {
  const template = clone(createResumeTemplate());
  const cleanText = text.trim();

  if (!cleanText) {
    return template;
  }

  const lines = cleanText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  template.basics.fullName = lines[0] || template.basics.fullName;
  template.basics.email = findMatch(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i, cleanText);
  template.basics.phone = findMatch(/(\+?\d[\d\s\-()]{7,}\d)/, cleanText);
  template.basics.linkedin = findMatch(/(https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+)/i, cleanText);
  template.basics.github = findMatch(/(https?:\/\/(?:www\.)?github\.com\/[^\s]+)/i, cleanText);
  template.basics.website = findMatch(/(https?:\/\/[^\s]+)/i, cleanText);

  const likelyTitle = lines.find((line, index) => index > 0 && line.length <= 80);
  if (likelyTitle) {
    template.basics.title = likelyTitle;
  }

  const summaryLine = lines.find((line) =>
    line.length > 80 &&
    !line.includes('@') &&
    !/^https?:\/\//i.test(line)
  );
  if (summaryLine) {
    template.summary = summaryLine;
  }

  return template;
};

export const exportResumeAsJson = (resumeData) => JSON.stringify(resumeData, null, 2);

export const exportResumeAsMarkdown = (resumeData) => {
  const { basics, summary, experience, education, skills, projects } = resumeData;

  return [
    `# ${basics.fullName}`,
    basics.title,
    [basics.email, basics.phone, basics.location].filter(Boolean).join(' | '),
    [basics.linkedin, basics.github, basics.website].filter(Boolean).join(' | '),
    '',
    '## Summary',
    summary,
    '',
    '## Experience',
    ...experience.flatMap((item) => [
      `### ${item.role} - ${item.company}`,
      `${item.startDate || ''}${item.endDate ? ` to ${item.endDate}` : ''}`.trim(),
      ...(item.highlights || []).map((point) => `- ${point}`),
      '',
    ]),
    '## Education',
    ...education.flatMap((item) => [
      `### ${item.degree}${item.field ? `, ${item.field}` : ''}`,
      item.institution,
      `${item.startDate || ''}${item.endDate ? ` to ${item.endDate}` : ''}`.trim(),
      item.grade || '',
      '',
    ]),
    '## Skills',
    ...skills.map((group) => `- ${group.category}: ${(group.items || []).join(', ')}`),
    '',
    '## Projects',
    ...projects.flatMap((project) => [
      `### ${project.title}`,
      project.description || '',
      (project.technologies || []).length ? `Tech: ${project.technologies.join(', ')}` : '',
      [project.link, project.github].filter(Boolean).join(' | '),
      '',
    ]),
  ]
    .filter(Boolean)
    .join('\n');
};
