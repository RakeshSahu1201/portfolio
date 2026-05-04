import React from 'react';

const styles = {
  section: {
    padding: '100px 0',
    borderBottom: '1px solid var(--border)',
  },
  card: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 32,
    transition: 'border-color var(--transition)',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 'var(--radius)',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    flexShrink: 0,
  },
  body: { flex: 1 },
  institution: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 20,
    color: 'var(--text)',
    marginBottom: 6,
    lineHeight: 1.3,
  },
  degree: {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    color: 'var(--accent)',
    marginBottom: 12,
  },
  meta: {
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap',
  },
  metaItem: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-muted)',
    letterSpacing: '0.06em',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  metaDot: {
    color: 'var(--text-dim)',
  },
};

export default function Education({ education }) {
  if (!education?.length) return null;

  return (
    <section id="education" style={styles.section}>
      <div className="container">
        <div className="section-label">Education</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {education?.map(edu => (
            <div
              key={edu.id}
              style={styles.card}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={styles.icon}>🎓</div>
              <div style={styles.body}>
                <div style={styles.institution}>{edu.institution}</div>
                <div style={styles.degree}>{edu.degree} — {edu.field}</div>
                <div style={styles.meta}>
                  <span style={styles.metaItem}>
                    <span style={styles.metaDot}>◆</span>
                    {edu.start_date} – {edu.end_date}
                  </span>
                  {edu.grade && (
                    <span style={styles.metaItem}>
                      <span style={styles.metaDot}>◆</span>
                      {edu.grade}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
