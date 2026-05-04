import React, { useEffect, useState } from 'react';

const styles = {
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1px solid var(--border)',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    opacity: 0.3,
    pointerEvents: 'none',
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    padding: '120px 0 80px',
  },
  prompt: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    animation: 'fadeUp 0.5s ease both',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 8px var(--accent)',
  },
  name: {
    fontSize: 'clamp(52px, 8vw, 96px)',
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    lineHeight: 1,
    color: 'var(--text)',
    animation: 'fadeUp 0.6s ease 0.1s both',
    marginBottom: 8,
  },
  title: {
    fontSize: 'clamp(18px, 3vw, 28px)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    color: 'var(--accent)',
    letterSpacing: '-0.01em',
    animation: 'fadeUp 0.6s ease 0.2s both',
    marginBottom: 24,
  },
  summary: {
    maxWidth: 580,
    color: 'var(--text-muted)',
    fontSize: 14,
    lineHeight: 1.8,
    animation: 'fadeUp 0.6s ease 0.3s both',
    marginBottom: 40,
  },
  links: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    animation: 'fadeUp 0.6s ease 0.4s both',
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    transition: 'all var(--transition)',
    cursor: 'pointer',
    background: 'transparent',
    textDecoration: 'none',
  },
  linkAccent: {
    borderColor: 'var(--accent)',
    color: 'var(--accent)',
    background: 'var(--accent-glow)',
  },
  location: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-dim)',
    letterSpacing: '0.1em',
    animation: 'fadeUp 0.6s ease 0.5s both',
    marginTop: 32,
  },
  navBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: '0 24px',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(10,10,10,0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
  },
  navLogo: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: 16,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
  },
  navLinks: {
    display: 'flex',
    gap: 24,
    listStyle: 'none',
  },
  navLink: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'color var(--transition)',
    background: 'none',
    border: 'none',
    textDecoration: 'none',
  },
};

function Cursor() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible(v => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{
      display: 'inline-block',
      width: 2,
      height: '1em',
      background: 'var(--accent)',
      marginLeft: 4,
      verticalAlign: 'text-bottom',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.1s',
    }} />
  );
}

const NAV_ITEMS = ['experience', 'projects', 'skills', 'education'];

export default function Hero({ profile, navItems = [] }) {
  const [displayText, setDisplayText] = useState('');
  const fullTitle = profile?.title ?? 'Software Engineer';
  const hasHeroContent = Boolean(
    profile?.name ||
    profile?.title ||
    profile?.summary ||
    profile?.email ||
    profile?.github_url ||
    profile?.linkedin_url ||
    profile?.location
  );

  if (!hasHeroContent) return null;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullTitle.substring(0, i));
      i++;
      if (i > fullTitle.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [fullTitle]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav style={styles.navBar}>
        <span style={styles.navLogo}>{profile?.name?.split(' ')[0] ?? 'RS'}</span>
        <ul style={styles.navLinks}>
          {(navItems.length ? navItems : NAV_ITEMS).map(id => (
            <li key={id}>
              <button
                style={styles.navLink}
                onClick={() => scrollTo(id)}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >
                {id}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section style={styles.hero}>
        <div style={styles.grid} />
        <div className="container">
          <div style={styles.inner}>
            <div style={styles.prompt}>
              <span style={styles.dot} />
              ~/portfolio
              <Cursor />
            </div>
            <h1 style={styles.name}>{profile?.name || 'Your Portfolio'}</h1>
            <p style={styles.title}>
              {displayText}<span style={{ animation: 'blink 1s infinite' }}>_</span>
            </p>
            {profile?.summary && <p style={styles.summary}>{profile.summary}</p>}
            {(profile?.email || profile?.github_url || profile?.linkedin_url) && (
              <div style={styles.links}>
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    style={{ ...styles.link, ...styles.linkAccent }}
                  >
                    ✉ {profile.email}
                  </a>
                )}
                {profile?.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.link}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, { borderColor: 'var(--text-muted)', color: 'var(--text)' })}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, { borderColor: 'var(--border)', color: 'var(--text-muted)' })}
                  >
                    ⌥ GitHub
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.link}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, { borderColor: 'var(--text-muted)', color: 'var(--text)' })}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, { borderColor: 'var(--border)', color: 'var(--text-muted)' })}
                  >
                    ⌘ LinkedIn
                  </a>
                )}
              </div>
            )}
            {profile?.location && <p style={styles.location}>📍 {profile.location}</p>}
          </div>
        </div>
      </section>
    </>
  );
}
