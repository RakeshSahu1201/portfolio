import React from 'react';

const CATEGORY_COLORS = {
  'Languages': 'var(--accent)',
  'Backend & Frameworks': 'var(--blue)',
  'Frontend': 'var(--orange)',
  'Databases': '#c084fc',
  'DevOps & Cloud': '#fb923c',
  'Architecture & Tools': '#34d399',
};

const styles = {
  section: {
    padding: '100px 0',
    borderBottom: '1px solid var(--border)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 16,
  },
  card: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    transition: 'border-color var(--transition)',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    flexShrink: 0,
  },
  categoryName: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    padding: '5px 10px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    background: 'var(--bg3)',
    color: 'var(--text)',
    transition: 'all var(--transition)',
    cursor: 'default',
  },
};

export default function Skills({ skills }) {
  if (!skills?.length) return null;

  return (
    <section id="skills" style={styles.section}>
      <div className="container">
        <div className="section-label">Skills</div>
        <div style={styles.grid}>
          {skills?.map(group => {
            const color = CATEGORY_COLORS[group.category] || 'var(--accent)';
            return (
              <div
                key={group.id}
                className="glass glass-hover"
                style={{
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  transition: 'border-color var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = color}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={styles.categoryHeader}>
                  <span style={{ ...styles.categoryDot, background: color, boxShadow: `0 0 6px ${color}` }} />
                  <span style={styles.categoryName}>{group.category}</span>
                </div>
                <div style={styles.tags}>
                  {group.items?.map((item, i) => (
                    <span
                      key={i}
                      style={styles.tag}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = color;
                        e.currentTarget.style.color = color;
                        e.currentTarget.style.background = 'var(--bg2)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.color = 'var(--text)';
                        e.currentTarget.style.background = 'var(--bg3)';
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
