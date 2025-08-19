import React, { FC } from 'react';
import { useNav } from '../hooks/useRouter.tsx';

export const Hero: FC = () => {
  const navigate = useNav();

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
    const hash = path.split('#')[1];
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section style={styles.hero} className="fade-in">
        <div style={styles.heroBg}></div>
        <div className="container" style={styles.heroGrid}>
            <div style={styles.heroContent}>
              <h1 style={styles.heroTitle}>Увеличивайте прибыль и&nbsp;возвращайте гостей</h1>
              <p style={styles.heroSubtitle}>LOQALY — это единая платформа для управления рестораном: от QR-меню и сбора отзывов до AI-аналитики и автоматического удержания клиентов.</p>
              <div style={styles.heroButtons}>
                <a href="/#contact" onClick={(e) => handleNav(e, '/#contact')} className="btn btn-primary">Получить демо</a>
                <a href="/pricing" onClick={(e) => handleNav(e, '/pricing')} className="btn btn-secondary">Смотреть тарифы</a>
              </div>
              <p style={styles.heroFootnote}>14 дней бесплатно, кредитная карта не требуется</p>
            </div>
            <div style={styles.heroImageContainer}>
                <img src="https://storage.googleapis.com/maker-studio-project-media-prod/1f5a2a53-4752-4712-a7f4-7546a1504886/images/loqaly-dashboard.png" alt="Панель управления LOQALY" style={styles.heroImage} />
            </div>
        </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  hero: {
    padding: '80px 0',
    background: 'var(--bg-white)',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(270deg, #f0fff4, #f6f7ff, #f0f8ff)',
    backgroundSize: '600% 600%',
    animation: 'gradient 16s ease infinite',
    zIndex: -1,
  },
  heroGrid: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      alignItems: 'center',
      gap: '64px',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '24px',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: '52px',
    fontWeight: 800,
    lineHeight: 1.2,
    color: 'var(--text-dark)',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'var(--text-light)',
    maxWidth: '500px',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
  },
  heroFootnote: {
      fontSize: '14px',
      color: 'var(--text-light)',
      opacity: 0.8,
  },
  heroImageContainer: {
      borderRadius: 'var(--border-radius)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
      transform: 'perspective(1500px) rotateY(-15deg) rotateX(5deg)',
      border: '1px solid var(--border-color)',
  },
  heroImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
  },
};
