import React, { FC } from 'react';
import { comparisonData } from '../data/content.ts';

const CheckIcon: FC<{ available: boolean | 'partial' }> = ({ available }) => {
  if (available === true) {
    return <span style={{ color: 'var(--primary-color)', fontSize: '24px' }}>✓</span>;
  }
  if (available === 'partial') {
    return <span style={{ color: 'var(--secondary-color)', fontSize: '24px' }}>~</span>;
  }
  return <span style={{ color: 'var(--border-color)', fontSize: '24px' }}>✕</span>;
};

export const Comparison: FC = () => {
  return (
    <section className="page-section" style={{ backgroundColor: 'var(--bg-white)' }}>
      <div className="container">
        <h2 className="section-title">Сравните возможности</h2>
        <p className="section-text">
          Посмотрите, как LOQALY выглядит на фоне стандартных решений для автоматизации и маркетинга.
        </p>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tr}>
                <th style={{...styles.th, textAlign: 'left'}}>Возможность</th>
                {comparisonData.headers.map(header => (
                  <th key={header} style={styles.th}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonData.rows.map((row, rowIndex) => (
                <tr key={rowIndex} style={styles.tr}>
                  <td style={{...styles.td, fontWeight: 600}}>{row.feature}</td>
                  {row.competitors.map((comp, compIndex) => (
                    <td key={compIndex} style={styles.td}>
                      <CheckIcon available={comp} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  tableWrapper: {
    maxWidth: '900px',
    margin: '48px auto 0',
    boxShadow: 'var(--shadow-lg)',
    borderRadius: 'var(--border-radius)',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'center',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
  },
  th: {
    padding: '16px 20px',
    background: 'var(--bg-light)',
    fontWeight: 700,
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--text-light)',
  },
  td: {
    padding: '20px',
    background: 'var(--bg-white)',
  },
};
