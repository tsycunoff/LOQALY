import React, { FC, useState } from 'react';
import { faqData } from '../data/content.ts';

const FAQItem: FC<{ q: string, a: string }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={styles.faqItem}>
            <button style={styles.faqQuestion} onClick={() => setIsOpen(!isOpen)}>
                <span style={{color: 'var(--text-dark)'}}>{q}</span>
                <span style={{...styles.faqIcon, transform: isOpen ? 'rotate(45deg)' : 'rotate(0)'}}>+</span>
            </button>
            {isOpen && <div style={styles.faqAnswer}><p>{a}</p></div>}
        </div>
    );
};

export const FAQ: FC = () => (
    <section id="faq" className="page-section" style={{...styles.features, backgroundColor: 'var(--bg-light)'}}>
        <div className="container">
            <h2 className="section-title">Часто задаваемые вопросы</h2>
            <div style={styles.faqContainer}>
                {faqData.map(item => <FAQItem key={item.q} q={item.q} a={item.a} />)}
            </div>
        </div>
    </section>
);

const styles: { [key: string]: React.CSSProperties } = {
  features: {
    padding: '80px 0',
  },
  faqContainer: {
      maxWidth: '800px',
      margin: '48px auto 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
  },
  faqItem: {
      background: 'var(--bg-white)',
      borderRadius: 'var(--border-radius)',
      border: '1px solid var(--border-color)',
      transition: 'box-shadow 0.2s ease',
  },
  faqQuestion: {
      width: '100%',
      background: 'transparent',
      border: 'none',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      textAlign: 'left',
      fontSize: '18px',
      fontWeight: 600,
      cursor: 'pointer',
  },
  faqIcon: {
      fontSize: '24px',
      fontWeight: 400,
      color: 'var(--primary-color)',
      transition: 'transform 0.2s ease',
  },
  faqAnswer: {
      padding: '0 20px 20px 20px',
      color: 'var(--text-light)',
      lineHeight: 1.7,
      animation: 'fadeIn 0.4s ease',
  },
};