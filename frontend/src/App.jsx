import React from 'react';
import { useAbout, useProjects, useExperience } from './hooks/useApi';
import Hero from './components/Hero';
import ImpactMetrics from './components/ImpactMetrics';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { buildProfileForUi } from './content/portfolioContent';

export default function App() {
  if (window.location.pathname.startsWith('/admin')) {
    return <AdminPanel />;
  }

  const { about, loading: aboutLoading, error: aboutError } = useAbout();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { experience, loading: experienceLoading, error: experienceError } = useExperience();

  const loading = aboutLoading || projectsLoading || experienceLoading;
  const error = aboutError || projectsError || experienceError;
  const profile = buildProfileForUi(about);
  const education = Array.isArray(about?.education) ? about.education : [];
  const skills = Array.isArray(about?.skills) ? about.skills : [];
  const navItems = [
    experience?.length ? 'experience' : null,
    projects?.length ? 'projects' : null,
    skills.length ? 'skills' : null,
    education.length ? 'education' : null,
  ].filter(Boolean);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;
  if (!about) return <ErrorState message="Failed to load about data" />;

  return (
    <main>
      <div className="bg-mesh" />
      <Hero profile={profile} navItems={navItems} />
      <ImpactMetrics />
      <Experience experience={experience} />
      <Projects projects={projects} />
      <Skills skills={skills} />
      <Education education={education} />
      <Contact />
      <Footer profile={profile} />
    </main>
  );
}

function Loading() {
  return (
    <div className="loading">
      <span>initializing portfolio</span>
      <div className="loading-bar">
        <div className="loading-bar-fill" />
      </div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="error">
      ✕ Failed to load portfolio data — {message}
    </div>
  );
}
