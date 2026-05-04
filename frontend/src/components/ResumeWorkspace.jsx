import React, { useState } from 'react';
import { createResumeTemplate } from '../content/resumeTemplate';
import {
  exportResumeAsJson,
  exportResumeAsMarkdown,
  parseResumeText,
} from '../utils/resume';

const createDownload = (filename, content, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export default function ResumeWorkspace({ styles, onFeedback }) {
  const [rawResume, setRawResume] = useState('');
  const [resumeData, setResumeData] = useState(createResumeTemplate());

  const updateBasics = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      basics: {
        ...prev.basics,
        [field]: value,
      },
    }));
  };

  const handleTemplateReset = () => {
    setResumeData(createResumeTemplate());
    setRawResume('');
    onFeedback?.('Resume template reset.');
  };

  const handleParse = () => {
    setResumeData(parseResumeText(rawResume));
    onFeedback?.('Resume text parsed into the starter template.');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setRawResume(text);
    setResumeData(parseResumeText(text));
    onFeedback?.(`Loaded resume text from "${file.name}".`);
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.sectionTitle}>Resume Workspace</h2>
      <p style={styles.subtitle}>
        Starter template for parsing and exporting resume data. We can deepen the parser and add richer exporters next.
      </p>

      <div style={{ ...styles.form, marginTop: 20 }}>
        <div style={styles.buttonRow}>
          <button type="button" style={styles.button} onClick={handleTemplateReset}>Load Template</button>
          <button type="button" style={{ ...styles.button, ...styles.primaryButton }} onClick={handleParse}>Parse Text</button>
          <button
            type="button"
            style={styles.button}
            onClick={() => createDownload('resume-template.json', exportResumeAsJson(resumeData), 'application/json')}
          >
            Export JSON
          </button>
          <button
            type="button"
            style={styles.button}
            onClick={() => createDownload('resume-template.md', exportResumeAsMarkdown(resumeData), 'text/markdown')}
          >
            Export Markdown
          </button>
        </div>

        <label style={styles.label}>
          Upload Resume Text
          <input type="file" accept=".txt,.md,.json,.rtf,.doc,.docx" style={styles.input} onChange={handleFileUpload} />
        </label>

        <label style={styles.label}>
          Raw Resume Text
          <textarea
            style={styles.textarea}
            value={rawResume}
            onChange={(event) => setRawResume(event.target.value)}
            placeholder="Paste resume text here, then click Parse Text."
          />
        </label>

        <div style={styles.row}>
          <label style={styles.label}>
            Full Name
            <input style={styles.input} value={resumeData.basics.fullName} onChange={(event) => updateBasics('fullName', event.target.value)} />
          </label>
          <label style={styles.label}>
            Title
            <input style={styles.input} value={resumeData.basics.title} onChange={(event) => updateBasics('title', event.target.value)} />
          </label>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>
            Email
            <input style={styles.input} value={resumeData.basics.email} onChange={(event) => updateBasics('email', event.target.value)} />
          </label>
          <label style={styles.label}>
            Phone
            <input style={styles.input} value={resumeData.basics.phone} onChange={(event) => updateBasics('phone', event.target.value)} />
          </label>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>
            LinkedIn
            <input style={styles.input} value={resumeData.basics.linkedin} onChange={(event) => updateBasics('linkedin', event.target.value)} />
          </label>
          <label style={styles.label}>
            GitHub
            <input style={styles.input} value={resumeData.basics.github} onChange={(event) => updateBasics('github', event.target.value)} />
          </label>
        </div>

        <label style={styles.label}>
          Summary
          <textarea
            style={styles.textarea}
            value={resumeData.summary}
            onChange={(event) => setResumeData((prev) => ({ ...prev, summary: event.target.value }))}
          />
        </label>

        <label style={styles.label}>
          Template Preview
          <textarea
            style={{ ...styles.textarea, minHeight: 240, fontFamily: 'var(--font-mono)' }}
            value={exportResumeAsJson(resumeData)}
            readOnly
          />
        </label>
      </div>
    </div>
  );
}
