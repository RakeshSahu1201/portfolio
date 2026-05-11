import { useState, useCallback, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const ADMIN_TOKEN_KEY = 'adminToken';

const getStoredAuthToken = () => {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(ADMIN_TOKEN_KEY) || '';
};

const setStoredAuthToken = (token) => {
  if (typeof window === 'undefined') return;

  if (token) {
    window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
    return;
  }

  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
};

/**
 * Pure function to make API requests with error handling
 */
const apiCall = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    includeCredentials = true,
  } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (includeCredentials) {
    config.credentials = 'include';
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  const token = getStoredAuthToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    const err = new Error(error.error || `HTTP ${response.status}`);
    err.status = response.status;
    err.fields = error.fields || {};
    throw err;
  }

  return response.json();
};

const normalizeProject = (project) => ({
  ...project,
  technologies: Array.isArray(project?.technologies) ? project.technologies : [],
  images: Array.isArray(project?.images) ? project.images : (project?.image ? [project.image] : []),
  image: project?.image || project?.images?.[0] || '',
});

/**
 * Custom hook for fetching projects
 */
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiCall('/api/projects');
        setProjects(Array.isArray(data) ? data.map(normalizeProject) : []);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const addProject = useCallback(async (projectData) => {
    try {
      const newProject = await apiCall('/api/projects', {
        method: 'POST',
        body: projectData,
      });
      const normalized = normalizeProject(newProject);
      setProjects(prev => [...prev, normalized]);
      return normalized;
    } catch (err) {
      console.error('Failed to add project:', err);
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (id, projectData) => {
    try {
      const updated = await apiCall(`/api/projects/${id}`, {
        method: 'PUT',
        body: projectData,
      });
      const normalized = normalizeProject(updated);
      setProjects(prev => prev.map(p => p.id === id ? normalized : p));
      return normalized;
    } catch (err) {
      console.error('Failed to update project:', err);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id) => {
    try {
      await apiCall(`/api/projects/${id}`, { method: 'DELETE' });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete project:', err);
      throw err;
    }
  }, []);

  return { projects, loading, error, addProject, updateProject, deleteProject };
};

/**
 * Custom hook for fetching experience
 */
export const useExperience = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await apiCall('/api/experience');
        setExperience(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch experience:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  const addExperience = useCallback(async (expData) => {
    try {
      const newExp = await apiCall('/api/experience', {
        method: 'POST',
        body: expData,
      });
      setExperience(prev => [...prev, newExp]);
      return newExp;
    } catch (err) {
      console.error('Failed to add experience:', err);
      throw err;
    }
  }, []);

  const updateExperience = useCallback(async (id, expData) => {
    try {
      const updated = await apiCall(`/api/experience/${id}`, {
        method: 'PUT',
        body: expData,
      });
      setExperience(prev => prev.map(e => e.id === id ? updated : e));
      return updated;
    } catch (err) {
      console.error('Failed to update experience:', err);
      throw err;
    }
  }, []);

  const deleteExperience = useCallback(async (id) => {
    try {
      await apiCall(`/api/experience/${id}`, { method: 'DELETE' });
      setExperience(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Failed to delete experience:', err);
      throw err;
    }
  }, []);

  return { experience, loading, error, addExperience, updateExperience, deleteExperience };
};

/**
 * Custom hook for fetching about section
 */
export const useAbout = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await apiCall('/api/about');
        setAbout(data);
      } catch (err) {
        console.error('Failed to fetch about:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const updateAbout = useCallback(async (aboutData) => {
    try {
      const updated = await apiCall('/api/about', {
        method: 'PUT',
        body: aboutData,
      });
      setAbout(updated);
      return updated;
    } catch (err) {
      console.error('Failed to update about:', err);
      throw err;
    }
  }, []);

  return { about, loading, error, updateAbout };
};

/**
 * Custom hook for contact form submission
 */
export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const submitContact = useCallback(async (contactData) => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      await apiCall('/api/contact', {
        method: 'POST',
        body: contactData,
      });
      setSuccess(true);
      return true;
    } catch (err) {
      console.error('Failed to submit contact:', err);
      setError(err.message);
      setFieldErrors(err.fields || {});
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitContact, loading, error, fieldErrors, success };
};

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getStoredAuthToken()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setStoredAuthToken(data.token);
      setIsAuthenticated(true);
      return data.token;
    } catch (err) {
      console.error('Login failed:', err);
      setStoredAuthToken('');
      setError(err.message);
      setIsAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiCall('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setStoredAuthToken('');
      setIsAuthenticated(false);
    }
  }, []);

  return { isAuthenticated, loading, error, login, logout };
};

/**
 * Custom hook for contact messages admin panel
 */
export const useContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await apiCall('/api/contact');
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await apiCall(`/api/contact/${id}/read`, { method: 'PATCH' });
      setMessages(prev =>
        prev.map(m => m.id === id ? { ...m, isRead: true } : m)
      );
    } catch (err) {
      console.error('Failed to mark message as read:', err);
      throw err;
    }
  }, []);

  const deleteMessage = useCallback(async (id) => {
    try {
      await apiCall(`/api/contact/${id}`, { method: 'DELETE' });
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete message:', err);
      throw err;
    }
  }, []);

  return { messages, loading, error, markAsRead, deleteMessage };
};

export { apiCall };
export { getStoredAuthToken };
