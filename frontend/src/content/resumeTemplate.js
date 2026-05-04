export const createResumeTemplate = () => ({
  basics: {
    fullName: 'Your Name',
    title: 'Software Engineer',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
  },
  summary: 'Write a short professional summary here.',
  experience: [
    {
      company: 'Company Name',
      role: 'Role Title',
      startDate: '2024-01',
      endDate: '',
      highlights: [
        'Describe an impact, project, or measurable win.',
      ],
    },
  ],
  education: [
    {
      institution: 'University Name',
      degree: 'Degree',
      field: 'Field of Study',
      startDate: '2020',
      endDate: '2024',
      grade: '',
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: ['JavaScript', 'Node.js'],
    },
  ],
  projects: [
    {
      title: 'Project Name',
      link: '',
      github: '',
      technologies: ['React', 'PostgreSQL'],
      description: 'Add a concise project description.',
    },
  ],
});
