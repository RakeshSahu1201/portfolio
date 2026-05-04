const { z } = require('zod');

// Auth
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Contact
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(100),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

// Project
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  technologies: z.array(z.string()).min(1, 'At least one technology required'),
  link: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  image: z.string().optional().or(z.literal('')),
  images: z.array(z.string().url('Invalid image URL')).optional().default([]),
  order: z.number().int().min(0).default(0),
});

// Experience
const experienceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  company: z.string().min(1, 'Company is required').max(100),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format').optional(),
  description: z.string().max(1000).optional(),
  order: z.number().int().min(0).default(0),
});

// About
const aboutSchema = z.object({
  name: z.string().max(200).optional(),
  title: z.string().min(1, 'Title is required').max(200),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(3000),
  avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  social: z.record(z.string().url('Invalid URL')).optional(),
  skills: z.array(z.object({
    category: z.string(),
    items: z.array(z.string()),
  })).optional(),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    field: z.string().optional().or(z.literal('')),
    start_date: z.string().optional().or(z.literal('')),
    end_date: z.string().optional().or(z.literal('')),
    grade: z.string().optional().or(z.literal('')),
  })).optional(),
});

module.exports = {
  loginSchema,
  contactSchema,
  projectSchema,
  experienceSchema,
  aboutSchema,
};
