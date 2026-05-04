import React, { useState } from 'react';

const styles = {
  section: {
    padding: '100px 0',
    borderBottom: '1px solid var(--border)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: 16,
  },
  card: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    transition: 'border-color var(--transition), transform var(--transition)',
    cursor: 'default',
  },
  imageWrap: {
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    border: '1px solid var(--border)',
    background: 'var(--bg3)',
    aspectRatio: '16 / 9',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  thumbRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  thumbButton: {
    width: 52,
    height: 40,
    padding: 0,
    borderRadius: 6,
    overflow: 'hidden',
    border: '1px solid var(--border)',
    background: 'var(--bg3)',
    cursor: 'pointer',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  description: {
    color: 'var(--text-muted)',
    fontSize: 13,
    lineHeight: 1.7,
    margin: 0,
    flex: 1,
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 18,
    color: 'var(--text)',
    lineHeight: 1.3,
  },
  date: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-dim)',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  stack: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.08em',
    padding: '3px 8px',
    borderRadius: 2,
    background: 'var(--bg3)',
    color: 'var(--blue)',
    border: '1px solid var(--border)',
  },
  bullets: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    flex: 1,
  },
  bullet: {
    display: 'flex',
    gap: 10,
    color: 'var(--text-muted)',
    fontSize: 13,
    lineHeight: 1.7,
  },
  bulletDot: {
    color: 'var(--orange)',
    flexShrink: 0,
    fontFamily: 'var(--font-mono)',
    marginTop: 3,
  },
  footer: {
    display: 'flex',
    gap: 12,
    paddingTop: 8,
    borderTop: '1px solid var(--border)',
    marginTop: 'auto',
  },
  link: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'color var(--transition)',
  },
};

const splitDescriptionLines = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== 'string') return [];

  return value
    .split('\n')
    .map((line) => line.replace(/^[\u2022\-*]\s*/, '').trim())
    .filter(Boolean);
};

function ProjectCard({ project }) {
  const images = Array.isArray(project.images) && project.images.length
    ? project.images
    : project.image
      ? [project.image]
      : [];
  const [activeImage, setActiveImage] = useState(images[0] || '');
  const descriptionLines = splitDescriptionLines(project.description);

  // Mapping tech pillars for high-impact visual
  const pillars = project.title.includes('AI')
    ? ['Automation', 'Reliability']
    : project.title.includes('Chat')
      ? ['Scalability', 'Performance']
      : ['Quality', 'Innovation'];

  return (
    <div className="glass glass-hover" style={{
      borderRadius: 'var(--radius-lg)',
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      height: '100%'
    }}>
      <div style={styles.cardTop}>
        <div style={styles.title}>{project.title}</div>
        <div style={styles.date}>{project.date}</div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {pillars.map((p, i) => (
          <span key={i} style={{
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--accent)',
            fontWeight: 700,
            padding: '2px 6px',
            border: '1px solid var(--accent)',
            borderRadius: '2px'
          }}>{p}</span>
        ))}
      </div>

      {activeImage && (
        <div style={styles.imageWrap}>
          <img src={activeImage} alt={project.title} style={styles.image} />
        </div>
      )}

      {images.length > 1 && (
        <div style={styles.thumbRow}>
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              style={{
                ...styles.thumbButton,
                borderColor: activeImage === image ? 'var(--accent)' : 'var(--border)',
              }}
              onClick={() => setActiveImage(image)}
            >
              <img src={image} alt={`${project.title} ${index + 1}`} style={styles.thumbImage} />
            </button>
          ))}
        </div>
      )}

      <div style={styles.stack}>
        {(project.technologies || project.tech_stack || []).map((t, i) => (
          <span key={i} style={styles.tag}>{t}</span>
        ))}
      </div>

      {descriptionLines.length ? (
        <ul style={styles.bullets}>
          {descriptionLines.map((line, index) => (
            <li key={index} style={styles.bullet}>
              <span style={styles.bulletDot}>→</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul style={styles.bullets}>
          {project.bullets?.map((b, i) => (
            <li key={i} style={styles.bullet}>
              <span style={styles.bulletDot}>→</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {(project.github || project.github_url || project.link || project.live_url) && (
        <div style={styles.footer}>
          {(project.github || project.github_url) && (
            <a
              href={project.github || project.github_url}
              target="_blank"
              rel="noreferrer"
              style={styles.link}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ⌥ GitHub
            </a>
          )}
          {(project.link || project.live_url) && (
            <a
              href={project.link || project.live_url}
              target="_blank"
              rel="noreferrer"
              style={styles.link}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ↗ Live
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function Projects({ projects }) {
  if (!projects?.length) return null;

  return (
    <section id="projects" style={styles.section}>
      <div className="container">
        <div className="section-label">Projects</div>
        <div style={styles.grid}>
          {projects?.map(p => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
