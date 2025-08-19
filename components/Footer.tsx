import React, { FC } from 'react';
import { Logo } from './Logo.tsx';
import { useNav } from '../hooks/useRouter.tsx';

export const Footer: FC = () => {
    const navigate = useNav();
    
    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        navigate(path);
        // If it's a link with a hash, scroll to it.
        const hash = path.split('#')[1];
        if (hash) {
            setTimeout(() => {
                const element = document.getElementById(hash);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 0);
        }
    }

    return (
        <footer style={styles.footer} className="fade-in">
            <div className="container">
                <div style={styles.footerGrid}>
                    <div style={styles.footerBrand}>
                        <Logo onDark />
                        <p style={styles.footerText}>Платформа для роста вашего бизнеса.</p>
                         <div style={styles.footerSocials}>
                            <a href="#" style={styles.footerLink}>TG</a>
                            <a href="#" style={styles.footerLink}>VC</a>
                        </div>
                    </div>
                    <div style={styles.footerLinksGroup}>
                        <h4 style={styles.footerTitle}>Продукт</h4>
                        <a href="/#features" onClick={(e) => handleNav(e, '/#features')} style={styles.footerLink}>Возможности</a>
                        <a href="/pricing" onClick={(e) => handleNav(e, '/pricing')} style={styles.footerLink}>Тарифы</a>
                        <a href="/#how-it-works" onClick={(e) => handleNav(e, '/#how-it-works')} style={styles.footerLink}>Как это работает</a>
                    </div>
                     <div style={styles.footerLinksGroup}>
                        <h4 style={styles.footerTitle}>Компания</h4>
                        <a href="#" style={styles.footerLink}>О нас</a>
                        <a href="#" style={styles.footerLink}>Контакты</a>
                        <a href="#" style={styles.footerLink}>Партнерам</a>
                    </div>
                </div>
                <div style={styles.footerBottom}>
                     <p style={{...styles.footerText, opacity: 0.5}}>© {new Date().getFullYear()} LOQALY. Все права защищены.</p>
                     <a href="#" style={{...styles.footerLink, opacity: 0.5}}>Политика конфиденциальности</a>
                </div>
            </div>
        </footer>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: 'var(--text-dark)',
    color: 'var(--bg-light)',
    padding: '60px 0 30px 0',
    borderTop: '1px solid var(--border-color)',
    marginTop: 'auto',
  },
  footerGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      gap: '64px',
      paddingBottom: '40px',
      marginBottom: '40px',
      borderBottom: '1px solid #4B5563',
  },
  footerBrand: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      alignItems: 'flex-start'
  },
  footerTitle: {
      fontSize: '16px',
      fontWeight: 700,
      marginBottom: '16px',
      color: 'var(--bg-white)',
  },
  footerLinksGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
  },
  footerSocials: {
      display: 'flex',
      gap: '16px',
      marginTop: '8px',
  },
  footerBottom: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
  },
  footerText: {
    opacity: 0.7,
  },
  footerLink: {
    color: 'var(--bg-light)',
    textDecoration: 'none',
    opacity: 0.7,
    transition: 'opacity 0.3s ease',
  }
};
