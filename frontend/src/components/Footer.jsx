import React from 'react';

const styles = {
  footer: {
    padding: '60px 0',
    borderTop: '1px solid var(--border)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  left: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-dim)',
    letterSpacing: '0.08em',
  },
  links: {
    display: 'flex',
    gap: 20,
  },
  link: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textDecoration: 'none',
    transition: 'color var(--transition)',
  },
};

export default function Footer({ profile }) {
  const hasFooterContent = Boolean(
    profile?.name ||
    profile?.email ||
    profile?.github_url ||
    profile?.linkedin_url
  );

  if (!hasFooterContent) return null;

  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.inner}>
          <span style={styles.left}>
            © {new Date().getFullYear()} {profile?.name || 'Portfolio'} — Built with React + Node.js
          </span>
          <div style={styles.links}>
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                style={styles.link}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                Email
              </a>
            )}
            {profile?.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                style={styles.link}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                GitHub
              </a>
            )}
            {profile?.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                style={styles.link}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
