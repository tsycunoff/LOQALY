import React, { FC, useRef } from 'react';
import { useCountUp } from '../hooks/useCountUp.ts';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.ts';

const AnimatedCounter: FC<{end: number, duration?: number, suffix?: string, prefix?: string}> = ({ end, duration=2000, suffix="", prefix="" }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useIntersectionObserver(ref, { threshold: 0.5 });
    const count = useCountUp(isInView ? end : 0, duration);
    return <span ref={ref}>{prefix}{Math.round(count).toLocaleString('ru-RU')}{suffix}</span>
}

export const Trust: FC = () => (
    <section style={styles.trustSection}>
        <div className="container" style={styles.trustContainer}>
            <div style={styles.metricsGrid}>
                <div style={styles.metricItem}>
                    <div style={styles.metricValue}><AnimatedCounter end={254012} suffix="+" /></div>
                    <div style={styles.metricLabel}>Отзывов собрано</div>
                </div>
                <div style={styles.metricItem}>
                    <div style={styles.metricValue}><AnimatedCounter end={48} /></div>
                    <div style={styles.metricLabel}>Городов присутствия</div>
                </div>
                <div style={styles.metricItem}>
                    <div style={styles.metricValue}><AnimatedCounter end={17} suffix="%" /></div>
                    <div style={styles.metricLabel}>Средний рост выручки</div>
                </div>
                 <div style={styles.metricItem}>
                    <div style={styles.metricValue}><AnimatedCounter end={950} prefix=">" /></div>
                    <div style={styles.metricLabel}>Подключено ресторанов</div>
                </div>
            </div>
             <div style={styles.logoCloud}>
                <p style={styles.logoCloudTitle}>Нам доверяют лидеры индустрии</p>
                <div style={styles.logoCloudGrid}>
                    {['COFFEE BEAN', 'GreenLeaf', 'Pizza Palace', 'UrbanEat', 'The Bistro'].map(name => (
                        <span key={name} style={styles.logoCloudItem}>{name}</span>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

const styles: { [key: string]: React.CSSProperties } = {
  trustSection: {
      padding: '60px 0',
      backgroundColor: 'var(--bg-light)',
      borderTop: '1px solid var(--border-color)',
      borderBottom: '1px solid var(--border-color)',
  },
  trustContainer: {
      textAlign: 'center',
  },
  metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '32px',
      marginBottom: '60px',
  },
  metricItem: {
      textAlign: 'center',
  },
  metricValue: {
      fontSize: '42px',
      fontWeight: 800,
      color: 'var(--primary-dark)',
  },
  metricLabel: {
      fontSize: '16px',
      color: 'var(--text-light)',
  },
  logoCloud: {},
  logoCloudTitle: {
      fontSize: '14px',
      fontWeight: 600,
      color: 'var(--text-light)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '24px',
  },
  logoCloudGrid: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '48px',
  },
  logoCloudItem: {
      fontSize: '20px',
      fontWeight: 600,
      color: 'var(--text-light)',
      opacity: 0.6,
      filter: 'grayscale(100%)',
  },
};
