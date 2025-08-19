import React, { FC } from 'react';
import { featureData } from '../data/content.ts';
import { useNav } from '../hooks/useRouter.tsx';

const FeatureIcon: FC<{icon: string}> = ({ icon }) => {
    const icons: {[key: string]: React.ReactNode} = {
        qr: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7m-3-6h.01M12 18h.01M15 18h.01" />,
        feedback: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
        ai: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
        campaign: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />,
        aggregate: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 12h14M5 16h14" />,
        integration: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    };
    return (
        <div style={styles.featureShowcaseIconWrapper}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                {icons[icon]}
            </svg>
        </div>
    );
}

export const Features: FC = () => {
    const navigate = useNav();

    return (
        <section id="features" className="page-section" style={{ backgroundColor: 'var(--bg-light)' }}>
            <div className="container" style={{textAlign: 'center'}}>
                <h2 className="section-title">Что умеет LOQALY</h2>
                <p className="section-text">Все инструменты для роста вашего заведения в одном месте.</p>
                <div style={styles.featureShowcaseGrid}>
                    {featureData.map(feature => (
                         <div 
                            key={feature.id} 
                            style={styles.featureShowcaseCard}
                            onClick={() => navigate(`/features/${feature.id}`)}
                            >
                            <FeatureIcon icon={feature.icon} />
                            <h3 style={styles.featureTitle}>{feature.title}</h3>
                            <p style={styles.featureText}>{feature.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
  featureShowcaseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '32px',
    marginTop: '48px',
    textAlign: 'left',
  },
  featureShowcaseCard: {
    background: 'var(--bg-white)',
    padding: '24px',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  featureShowcaseIconWrapper: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(52, 211, 153, 0.1)',
      color: 'var(--primary-dark)',
  },
   featureTitle: {
      fontSize: '20px',
      fontWeight: 700,
      marginBottom: '8px',
  },
  featureText: {
      color: 'var(--text-light)',
      lineHeight: 1.6,
  },
};
