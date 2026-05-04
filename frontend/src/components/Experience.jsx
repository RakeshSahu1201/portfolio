import React, { useState } from 'react';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const formatExperienceDate = (value) => {
  if (!value) return '';

  const normalizedValue = typeof value === 'string' ? value.trim() : String(value);
  const date = normalizedValue.includes('T')
    ? new Date(normalizedValue)
    : new Date(`${normalizedValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return `${MONTH_NAMES[date.getMonth()]} - ${date.getFullYear()}`;
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

const styles = {
  section: {
    padding: '100px 0',
    borderBottom: '1px solid var(--border)',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 2 },
  item: {
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    transition: 'border-color var(--transition)',
  },
  itemActive: { borderColor: 'var(--accent)' },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '20px 24px',
    cursor: 'pointer',
    background: 'var(--bg2)',
    transition: 'background var(--transition)',
    gap: 16,
  },
  headerActive: { background: 'var(--bg3)' },
  left: { flex: 1 },
  role: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 18,
    color: 'var(--text)',
    marginBottom: 4,
  },
  company: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--accent)',
    letterSpacing: '0.05em',
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  date: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  },
  badge: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: 2,
    background: 'var(--accent-glow)',
    color: 'var(--accent)',
    border: '1px solid var(--accent)',
  },
  chevron: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text-dim)',
    transition: 'transform var(--transition)',
    marginTop: 2,
  },
  body: {
    padding: '0 24px 24px',
    background: 'var(--bg2)',
  },
  location: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-dim)',
    letterSpacing: '0.08em',
    marginBottom: 16,
    paddingTop: 4,
  },
  bullets: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 },
  bullet: {
    display: 'flex',
    gap: 12,
    color: 'var(--text-muted)',
    fontSize: 13,
    lineHeight: 1.7,
  },
  bulletDot: {
    color: 'var(--accent)',
    flexShrink: 0,
    marginTop: 3,
    fontFamily: 'var(--font-mono)',
  },
};

function ExperienceItem({ exp }) {
  const [open, setOpen] = useState(!exp.endDate && !exp.end_date);
  const role = exp.title || exp.role;
  const start = exp.startDate || exp.start_date;
  const end = exp.endDate || exp.end_date;
  const isCurrent = exp.is_current || (!end && Boolean(start));
  const bulletItems = exp.bullets?.length
    ? exp.bullets
    : splitDescriptionLines(exp.description);

  const dateRange = isCurrent
    ? `${formatExperienceDate(start)} → Present`
    : `${formatExperienceDate(start)} → ${formatExperienceDate(end)}`;

  return (
    <div className={`glass glass-hover ${open ? 'item-active' : ''}`} style={{
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      marginBottom: '16px'
    }}>
      <div
        style={{ ...styles.header, ...(open ? styles.headerActive : {}) }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={styles.left}>
          <div style={styles.role}>{role}</div>
          <div style={styles.company}>{exp.company}</div>
        </div>
        <div style={styles.meta}>
          {isCurrent && <span style={styles.badge}>Current</span>}
          <span style={styles.date}>{dateRange}</span>
        </div>
        <span style={{ ...styles.chevron, transform: open ? 'rotate(90deg)' : 'none' }}>▶</span>
      </div>
      {open && (
        <div style={styles.body}>
          {exp.location && <div style={styles.location}>📍 {exp.location}</div>}
          <ul style={styles.bullets}>
            {bulletItems.map((b, i) => (
              <li key={i} style={styles.bullet}>
                <span style={styles.bulletDot}>→</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Experience({ experience }) {
  if (!experience?.length) return null;

  return (
    <section id="experience" style={styles.section}>
      <div className="container">
        <div className="section-label">Experience</div>
        <div style={styles.list}>
          {experience?.map(exp => (
            <ExperienceItem key={exp.id} exp={exp} />
          ))}
        </div>
      </div>
    </section>
  );
}
