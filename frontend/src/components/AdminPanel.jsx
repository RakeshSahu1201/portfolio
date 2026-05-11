import React, { useMemo, useState } from 'react';
import {
  getStoredAuthToken,
  useAbout,
  useAuth,
  useContactMessages,
  useExperience,
  useProjects,
} from '../hooks/useApi';
import ResumeWorkspace from './ResumeWorkspace';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg1)',
    color: 'var(--text)',
    padding: '32px 0 64px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(32px, 5vw, 48px)',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    margin: 0,
  },
  subtitle: {
    margin: '8px 0 0',
    color: 'var(--text-muted)',
    fontSize: 14,
  },
  card: {
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--bg2)',
    padding: 24,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 20,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: 12,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontFamily: 'var(--font-mono)',
  },
  input: {
    background: 'var(--bg3)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px 14px',
    fontSize: 14,
    fontFamily: 'var(--font-base)',
  },
  textarea: {
    minHeight: 120,
    resize: 'vertical',
    background: 'var(--bg3)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px 14px',
    fontSize: 14,
    fontFamily: 'var(--font-base)',
  },
  buttonRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    border: '1px solid var(--border)',
    background: 'var(--bg3)',
    color: 'var(--text)',
    borderRadius: 'var(--radius)',
    padding: '10px 16px',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  primaryButton: {
    borderColor: 'var(--accent)',
    background: 'var(--accent)',
    color: 'var(--bg1)',
  },
  dangerButton: {
    borderColor: 'var(--red)',
    color: 'var(--red)',
  },
  message: {
    padding: '12px 14px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    fontSize: 14,
  },
  success: {
    background: 'rgba(16, 185, 129, 0.12)',
    color: '#86efac',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.12)',
    color: '#fca5a5',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  item: {
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 16,
    background: 'var(--bg3)',
  },
  itemTitle: {
    margin: 0,
    fontFamily: 'var(--font-display)',
    fontSize: 18,
    fontWeight: 700,
  },
  itemMeta: {
    margin: '6px 0 0',
    color: 'var(--text-muted)',
    fontSize: 13,
  },
  itemBody: {
    margin: '12px 0 0',
    color: 'var(--text-muted)',
    fontSize: 14,
    lineHeight: 1.6,
  },
};

const splitLines = (value) => value
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

const joinLines = (value) => Array.isArray(value) ? value.join('\n') : '';
const getFieldMessage = (error, field) => error?.fields?.[field] || '';
const formatApiErrorMessage = (error, fallback) => {
  if (error?.fields && Object.keys(error.fields).length > 0) {
    return Object.values(error.fields).join(' ');
  }

  if (error?.message && error.message !== 'Validation failed') {
    return error.message;
  }

  return fallback;
};

const projectToForm = (project) => ({
  title: project.title || '',
  description: project.description || '',
  technologies: joinLines(project.technologies || project.tech_stack || []),
  images: joinLines(project.images || (project.image ? [project.image] : [])),
  link: project.link || project.live_url || '',
  github: project.github || project.github_url || '',
  order: String(project.order ?? 0),
});

const experienceToForm = (item) => ({
  title: item.title || '',
  company: item.company || '',
  startDate: item.startDate || item.start_date || '',
  endDate: item.endDate || item.end_date || '',
  description: item.description || '',
  order: String(item.order ?? 0),
});

function AdminLogin({ onSuccess }) {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = await login(form.email, form.password);
    if (token) onSuccess();
  };

  return (
    <div className="container" style={styles.page}>
      <div style={{ ...styles.card, maxWidth: 480, margin: '48px auto 0' }}>
        <h1 style={styles.title}>Admin Login</h1>
        <p style={styles.subtitle}>Sign in to manage portfolio data and messages.</p>
        <form style={{ ...styles.form, marginTop: 24 }} onSubmit={handleSubmit}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              style={styles.input}
              required
            />
          </label>
          {error && <div style={{ ...styles.message, ...styles.error }}>{error}</div>}
          <button type="submit" style={{ ...styles.button, ...styles.primaryButton }} disabled={loading}>
            {loading ? 'Signing In' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }) {
  const { logout } = useAuth();
  const { about, updateAbout } = useAbout();
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
  } = useProjects();
  const {
    experience,
    addExperience,
    updateExperience,
    deleteExperience,
  } = useExperience();
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    markAsRead,
    deleteMessage,
  } = useContactMessages();

  const [aboutForm, setAboutForm] = useState({
    title: about?.title || '',
    bio: about?.bio || '',
    email: about?.email || '',
    phone: about?.phone || '',
    location: about?.location || '',
    avatar: about?.avatar || '',
    github: '',
    linkedin: '',
    twitter: '',
  });
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    images: '',
    link: '',
    github: '',
    order: '0',
  });
  const [experienceForm, setExperienceForm] = useState({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
    order: '0',
  });
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');
  const [aboutErrors, setAboutErrors] = useState({});
  const [projectErrors, setProjectErrors] = useState({});
  const [experienceErrors, setExperienceErrors] = useState({});
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectDraft, setProjectDraft] = useState(null);
  const [projectDraftErrors, setProjectDraftErrors] = useState({});
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [experienceDraft, setExperienceDraft] = useState(null);
  const [experienceDraftErrors, setExperienceDraftErrors] = useState({});

  React.useEffect(() => {
    setAboutForm({
      title: about?.title || '',
      bio: about?.bio || '',
      email: about?.email || '',
      phone: about?.phone || '',
      location: about?.location || '',
      avatar: about?.avatar || '',
      github: about?.social?.github || '',
      linkedin: about?.social?.linkedin || '',
      twitter: about?.social?.twitter || '',
    });
  }, [about]);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => Number(a.isRead) - Number(b.isRead)),
    [messages]
  );

  const showFeedback = (message, type = 'success') => {
    setFeedback(message);
    setFeedbackType(type);
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const submitAbout = async (event) => {
    event.preventDefault();
    try {
      setAboutErrors({});
      await updateAbout({
        title: aboutForm.title,
        bio: aboutForm.bio,
        email: aboutForm.email || undefined,
        phone: aboutForm.phone || undefined,
        location: aboutForm.location || undefined,
        avatar: aboutForm.avatar || '',
        social: Object.fromEntries(
          Object.entries({
            github: aboutForm.github,
            linkedin: aboutForm.linkedin,
            twitter: aboutForm.twitter,
          }).filter(([, value]) => value)
        ),
      });
      showFeedback('About section updated.');
    } catch (error) {
      setAboutErrors(error.fields || {});
      showFeedback(formatApiErrorMessage(error, 'Failed to update about section.'), 'error');
    }
  };

  const submitProject = async (event) => {
    event.preventDefault();
    try {
      setProjectErrors({});
      await addProject({
        title: projectForm.title,
        description: projectForm.description,
        technologies: splitLines(projectForm.technologies),
        images: splitLines(projectForm.images),
        link: projectForm.link,
        github: projectForm.github,
        order: Number(projectForm.order || 0),
      });
      setProjectForm({
        title: '',
        description: '',
        technologies: '',
        images: '',
        link: '',
        github: '',
        order: '0',
      });
      showFeedback('Project created.');
    } catch (error) {
      setProjectErrors(error.fields || {});
      showFeedback(formatApiErrorMessage(error, 'Failed to create project.'), 'error');
    }
  };

  const submitExperience = async (event) => {
    event.preventDefault();
    try {
      setExperienceErrors({});
      await addExperience({
        title: experienceForm.title,
        company: experienceForm.company,
        startDate: experienceForm.startDate,
        endDate: experienceForm.endDate || undefined,
        description: experienceForm.description || undefined,
        order: Number(experienceForm.order || 0),
      });
      setExperienceForm({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
        order: '0',
      });
      showFeedback('Experience created.');
    } catch (error) {
      setExperienceErrors(error.fields || {});
      showFeedback(formatApiErrorMessage(error, 'Failed to create experience.'), 'error');
    }
  };

  const startProjectEdit = (project) => {
    setEditingProjectId(project.id);
    setProjectDraft(projectToForm(project));
  };

  const cancelProjectEdit = () => {
    setEditingProjectId(null);
    setProjectDraft(null);
  };

  const saveProjectEdit = async (projectId) => {
    if (!projectDraft) return;

    try {
      setProjectDraftErrors({});
      await updateProject(projectId, {
        title: projectDraft.title,
        description: projectDraft.description,
        technologies: splitLines(projectDraft.technologies),
        images: splitLines(projectDraft.images),
        link: projectDraft.link,
        github: projectDraft.github,
        order: Number(projectDraft.order || 0),
      });
      setEditingProjectId(null);
      setProjectDraft(null);
      showFeedback(`Project "${projectDraft.title}" saved.`);
    } catch (error) {
      setProjectDraftErrors(error.fields || {});
      showFeedback(formatApiErrorMessage(error, 'Failed to save project.'), 'error');
    }
  };

  const startExperienceEdit = (item) => {
    setEditingExperienceId(item.id);
    setExperienceDraft(experienceToForm(item));
  };

  const cancelExperienceEdit = () => {
    setEditingExperienceId(null);
    setExperienceDraft(null);
  };

  const saveExperienceEdit = async (itemId) => {
    if (!experienceDraft) return;

    try {
      setExperienceDraftErrors({});
      await updateExperience(itemId, {
        title: experienceDraft.title,
        company: experienceDraft.company,
        startDate: experienceDraft.startDate,
        endDate: experienceDraft.endDate || undefined,
        description: experienceDraft.description || '',
        order: Number(experienceDraft.order || 0),
      });
      setEditingExperienceId(null);
      setExperienceDraft(null);
      showFeedback(`Experience "${experienceDraft.title}" saved.`);
    } catch (error) {
      setExperienceDraftErrors(error.fields || {});
      showFeedback(formatApiErrorMessage(error, 'Failed to save experience.'), 'error');
    }
  };

  return (
    <div className="container" style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Portfolio Admin</h1>
          <p style={styles.subtitle}>Manage profile content, projects, experience, and inbound contact messages.</p>
        </div>
        <div style={styles.buttonRow}>
          <a href="/" style={{ ...styles.button, textDecoration: 'none' }}>View Site</a>
          <button type="button" style={styles.button} onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      {feedback && (
        <div style={{ ...styles.message, ...(feedbackType === 'error' ? styles.error : styles.success) }}>
          {feedback}
        </div>
      )}

      <div style={styles.grid}>
        <ResumeWorkspace styles={styles} onFeedback={showFeedback} />

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>About</h2>
          <form style={styles.form} onSubmit={submitAbout}>
            <label style={styles.label}>
              Title
              <input
                style={styles.input}
                value={aboutForm.title}
                onChange={(event) => setAboutForm((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </label>
            <label style={styles.label}>
              Bio
              <textarea
                style={styles.textarea}
                value={aboutForm.bio}
                onChange={(event) => setAboutForm((prev) => ({ ...prev, bio: event.target.value }))}
                required
              />
              {getFieldMessage({ fields: aboutErrors }, 'bio') && <div style={{ ...styles.message, ...styles.error }}>{aboutErrors.bio}</div>}
            </label>
            <div style={styles.row}>
              <label style={styles.label}>
                Email
                <input style={styles.input} value={aboutForm.email} onChange={(event) => setAboutForm((prev) => ({ ...prev, email: event.target.value }))} />
              </label>
              <label style={styles.label}>
                Phone
                <input style={styles.input} value={aboutForm.phone} onChange={(event) => setAboutForm((prev) => ({ ...prev, phone: event.target.value }))} />
              </label>
            </div>
            <div style={styles.row}>
              <label style={styles.label}>
                Location
                <input style={styles.input} value={aboutForm.location} onChange={(event) => setAboutForm((prev) => ({ ...prev, location: event.target.value }))} />
              </label>
              <label style={styles.label}>
                Avatar Url
                <input style={styles.input} value={aboutForm.avatar} onChange={(event) => setAboutForm((prev) => ({ ...prev, avatar: event.target.value }))} />
              </label>
            </div>
            <div style={styles.row}>
              <label style={styles.label}>
                GitHub
                <input style={styles.input} value={aboutForm.github} onChange={(event) => setAboutForm((prev) => ({ ...prev, github: event.target.value }))} />
              </label>
              <label style={styles.label}>
                LinkedIn
                <input style={styles.input} value={aboutForm.linkedin} onChange={(event) => setAboutForm((prev) => ({ ...prev, linkedin: event.target.value }))} />
              </label>
            </div>
            <label style={styles.label}>
              Twitter
              <input style={styles.input} value={aboutForm.twitter} onChange={(event) => setAboutForm((prev) => ({ ...prev, twitter: event.target.value }))} />
            </label>
            <button type="submit" style={{ ...styles.button, ...styles.primaryButton }}>Save About</button>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Add Project</h2>
          <form style={styles.form} onSubmit={submitProject}>
            <label style={styles.label}>
              Title
              <input style={styles.input} value={projectForm.title} onChange={(event) => setProjectForm((prev) => ({ ...prev, title: event.target.value }))} required />
            </label>
            <label style={styles.label}>
              Description
              <textarea style={styles.textarea} value={projectForm.description} onChange={(event) => setProjectForm((prev) => ({ ...prev, description: event.target.value }))} required />
              {getFieldMessage({ fields: projectErrors }, 'description') && <div style={{ ...styles.message, ...styles.error }}>{projectErrors.description}</div>}
            </label>
            <label style={styles.label}>
              Technologies
              <textarea style={styles.textarea} value={projectForm.technologies} onChange={(event) => setProjectForm((prev) => ({ ...prev, technologies: event.target.value }))} placeholder="One per line" required />
            </label>
            <label style={styles.label}>
              Images
              <textarea style={styles.textarea} value={projectForm.images} onChange={(event) => setProjectForm((prev) => ({ ...prev, images: event.target.value }))} placeholder="One image URL per line" />
            </label>
            <div style={styles.row}>
              <label style={styles.label}>
                Live Link
                <input style={styles.input} value={projectForm.link} onChange={(event) => setProjectForm((prev) => ({ ...prev, link: event.target.value }))} />
              </label>
              <label style={styles.label}>
                GitHub Link
                <input style={styles.input} value={projectForm.github} onChange={(event) => setProjectForm((prev) => ({ ...prev, github: event.target.value }))} />
              </label>
            </div>
            <div style={styles.row}>
              <label style={styles.label}>
                Order
                <input style={styles.input} type="number" value={projectForm.order} onChange={(event) => setProjectForm((prev) => ({ ...prev, order: event.target.value }))} />
              </label>
            </div>
            <button type="submit" style={{ ...styles.button, ...styles.primaryButton }}>Create Project</button>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Add Experience</h2>
          <form style={styles.form} onSubmit={submitExperience}>
            <div style={styles.row}>
              <label style={styles.label}>
                Title
                <input style={styles.input} value={experienceForm.title} onChange={(event) => setExperienceForm((prev) => ({ ...prev, title: event.target.value }))} required />
              </label>
              <label style={styles.label}>
                Company
                <input style={styles.input} value={experienceForm.company} onChange={(event) => setExperienceForm((prev) => ({ ...prev, company: event.target.value }))} required />
              </label>
            </div>
            <div style={styles.row}>
              <label style={styles.label}>
                Start Date
                <input style={styles.input} type="date" value={experienceForm.startDate} onChange={(event) => setExperienceForm((prev) => ({ ...prev, startDate: event.target.value }))} required />
              </label>
              <label style={styles.label}>
                End Date
                <input style={styles.input} type="date" value={experienceForm.endDate} onChange={(event) => setExperienceForm((prev) => ({ ...prev, endDate: event.target.value }))} />
              </label>
            </div>
            <label style={styles.label}>
              Description
              <textarea style={styles.textarea} value={experienceForm.description} onChange={(event) => setExperienceForm((prev) => ({ ...prev, description: event.target.value }))} />
              {getFieldMessage({ fields: experienceErrors }, 'description') && <div style={{ ...styles.message, ...styles.error }}>{experienceErrors.description}</div>}
            </label>
            <label style={styles.label}>
              Order
              <input style={styles.input} type="number" value={experienceForm.order} onChange={(event) => setExperienceForm((prev) => ({ ...prev, order: event.target.value }))} />
            </label>
            <button type="submit" style={{ ...styles.button, ...styles.primaryButton }}>Create Experience</button>
          </form>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Projects</h2>
        <div style={styles.list}>
          {projects.map((project) => (
            <div key={project.id} style={styles.item}>
              {editingProjectId === project.id && projectDraft ? (
                <div style={styles.form}>
                  <label style={styles.label}>
                    Title
                    <input style={styles.input} value={projectDraft.title} onChange={(event) => setProjectDraft((prev) => ({ ...prev, title: event.target.value }))} />
                  </label>
                  <label style={styles.label}>
                    Description
                    <textarea style={styles.textarea} value={projectDraft.description} onChange={(event) => setProjectDraft((prev) => ({ ...prev, description: event.target.value }))} />
                    {getFieldMessage({ fields: projectDraftErrors }, 'description') && <div style={{ ...styles.message, ...styles.error }}>{projectDraftErrors.description}</div>}
                  </label>
                  <label style={styles.label}>
                    Technologies
                    <textarea style={styles.textarea} value={projectDraft.technologies} onChange={(event) => setProjectDraft((prev) => ({ ...prev, technologies: event.target.value }))} />
                  </label>
                  <label style={styles.label}>
                    Images
                    <textarea style={styles.textarea} value={projectDraft.images} onChange={(event) => setProjectDraft((prev) => ({ ...prev, images: event.target.value }))} />
                  </label>
                  <div style={styles.row}>
                    <label style={styles.label}>
                      Live Link
                      <input style={styles.input} value={projectDraft.link} onChange={(event) => setProjectDraft((prev) => ({ ...prev, link: event.target.value }))} />
                    </label>
                    <label style={styles.label}>
                      GitHub Link
                      <input style={styles.input} value={projectDraft.github} onChange={(event) => setProjectDraft((prev) => ({ ...prev, github: event.target.value }))} />
                    </label>
                  </div>
                  <div style={styles.row}>
                    <label style={styles.label}>
                      Order
                      <input style={styles.input} type="number" value={projectDraft.order} onChange={(event) => setProjectDraft((prev) => ({ ...prev, order: event.target.value }))} />
                    </label>
                  </div>
                  <div style={styles.buttonRow}>
                    <button type="button" style={{ ...styles.button, ...styles.primaryButton }} onClick={() => saveProjectEdit(project.id)}>Save</button>
                    <button type="button" style={styles.button} onClick={cancelProjectEdit}>Cancel</button>
                    <button type="button" style={{ ...styles.button, ...styles.dangerButton }} onClick={() => deleteProject(project.id).then(() => {
                      cancelProjectEdit();
                      showFeedback(`Deleted "${project.title}".`);
                    }).catch((error) => showFeedback(error.message || 'Failed to delete project.', 'error'))}>Delete</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 style={styles.itemTitle}>{project.title}</h3>
                  <p style={styles.itemMeta}>{joinLines(project.technologies || project.tech_stack).replace(/\n/g, ', ')}</p>
                  <p style={styles.itemBody}>{project.description}</p>
                  <div style={styles.buttonRow}>
                    <button type="button" style={styles.button} onClick={() => startProjectEdit(project)}>Edit</button>
                    <button type="button" style={{ ...styles.button, ...styles.dangerButton }} onClick={() => deleteProject(project.id).then(() => showFeedback(`Deleted "${project.title}".`)).catch((error) => showFeedback(error.message || 'Failed to delete project.', 'error'))}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
          {projects.length === 0 && <div style={styles.card}>No projects yet.</div>}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Experience</h2>
        <div style={styles.list}>
          {experience.map((item) => (
            <div key={item.id} style={styles.item}>
              {editingExperienceId === item.id && experienceDraft ? (
                <div style={styles.form}>
                  <div style={styles.row}>
                    <label style={styles.label}>
                      Title
                      <input style={styles.input} value={experienceDraft.title} onChange={(event) => setExperienceDraft((prev) => ({ ...prev, title: event.target.value }))} />
                    </label>
                    <label style={styles.label}>
                      Company
                      <input style={styles.input} value={experienceDraft.company} onChange={(event) => setExperienceDraft((prev) => ({ ...prev, company: event.target.value }))} />
                    </label>
                  </div>
                  <div style={styles.row}>
                    <label style={styles.label}>
                      Start Date
                      <input style={styles.input} type="date" value={experienceDraft.startDate} onChange={(event) => setExperienceDraft((prev) => ({ ...prev, startDate: event.target.value }))} />
                    </label>
                    <label style={styles.label}>
                      End Date
                      <input style={styles.input} type="date" value={experienceDraft.endDate} onChange={(event) => setExperienceDraft((prev) => ({ ...prev, endDate: event.target.value }))} />
                    </label>
                  </div>
                  <label style={styles.label}>
                    Description
                    <textarea style={styles.textarea} value={experienceDraft.description} onChange={(event) => setExperienceDraft((prev) => ({ ...prev, description: event.target.value }))} />
                    {getFieldMessage({ fields: experienceDraftErrors }, 'description') && <div style={{ ...styles.message, ...styles.error }}>{experienceDraftErrors.description}</div>}
                  </label>
                  <label style={styles.label}>
                    Order
                    <input style={styles.input} type="number" value={experienceDraft.order} onChange={(event) => setExperienceDraft((prev) => ({ ...prev, order: event.target.value }))} />
                  </label>
                  <div style={styles.buttonRow}>
                    <button type="button" style={{ ...styles.button, ...styles.primaryButton }} onClick={() => saveExperienceEdit(item.id)}>Save</button>
                    <button type="button" style={styles.button} onClick={cancelExperienceEdit}>Cancel</button>
                    <button type="button" style={{ ...styles.button, ...styles.dangerButton }} onClick={() => deleteExperience(item.id).then(() => {
                      cancelExperienceEdit();
                      showFeedback(`Deleted "${item.title}".`);
                    }).catch((error) => showFeedback(error.message || 'Failed to delete experience.', 'error'))}>Delete</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 style={styles.itemTitle}>{item.title}</h3>
                  <p style={styles.itemMeta}>{item.company}</p>
                  <p style={styles.itemBody}>{item.description}</p>
                  <div style={styles.buttonRow}>
                    <button type="button" style={styles.button} onClick={() => startExperienceEdit(item)}>Edit</button>
                    <button type="button" style={{ ...styles.button, ...styles.dangerButton }} onClick={() => deleteExperience(item.id).then(() => showFeedback(`Deleted "${item.title}".`)).catch((error) => showFeedback(error.message || 'Failed to delete experience.', 'error'))}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
          {experience.length === 0 && <div style={styles.card}>No experience records yet.</div>}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Contact Messages</h2>
        {messagesError && <div style={{ ...styles.message, ...styles.error }}>{messagesError}</div>}
        <div style={styles.list}>
          {!messagesLoading && !messagesError && sortedMessages.length === 0 && <div style={styles.card}>No messages yet.</div>}
          {sortedMessages.map((message) => (
            <div key={message.id} style={styles.item}>
              <h3 style={styles.itemTitle}>{message.subject}</h3>
              <p style={styles.itemMeta}>
                {message.name} • {message.email} • {message.isRead ? 'Read' : 'Unread'}
              </p>
              <p style={styles.itemBody}>{message.message}</p>
              <div style={styles.buttonRow}>
                {!message.isRead && (
                  <button
                    type="button"
                    style={styles.button}
                    onClick={() => markAsRead(message.id).then(() => showFeedback('Message marked as read.')).catch((error) => showFeedback(error.message || 'Failed to update message.', 'error'))}
                  >
                    Mark Read
                  </button>
                )}
                <button
                  type="button"
                  style={{ ...styles.button, ...styles.dangerButton }}
                  onClick={() => deleteMessage(message.id).then(() => showFeedback('Message deleted.')).catch((error) => showFeedback(error.message || 'Failed to delete message.', 'error'))}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getStoredAuthToken()));

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
}
