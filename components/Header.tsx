import React, { FC, useState, useEffect } from 'react';
import { Logo } from './Logo.tsx';
import { useNav } from '../hooks/useRouter.tsx';
import { featureData } from '../data/content.ts';

export const Header: FC = () => {
    const navigate = useNav();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        setDropdownOpen(false);
        navigate(path);
        // If it's a link with a hash, scroll to it.
        const hash = path.split('#')[1];
        if (hash) {
            setTimeout(() => {
                const element = document.getElementById(hash);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 0);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header style={{...styles.header, ...(isScrolled ? styles.headerScrolled : {})}}>
            <div className="container" style={styles.nav}>
                <div onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
                    <Logo />
                </div>
                <nav style={styles.navLinks} className="nav-links">
                    <div 
                        onMouseEnter={() => setDropdownOpen(true)} 
                        onMouseLeave={() => setDropdownOpen(false)}
                        style={{ position: 'relative' }}
                    >
                        <a href="/#features" onClick={(e) => handleNav(e, '/#features')} style={styles.navLink}>Возможности</a>
                        {isDropdownOpen && (
                             <div style={styles.dropdown}>
                                {featureData.map(feature => (
                                    <a key={feature.id} href={`/features/${feature.id}`} onClick={(e) => handleNav(e, `/features/${feature.id}`)} style={styles.dropdownLink}>
                                        {feature.title}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                    <a href="/pricing" onClick={(e) => handleNav(e, '/pricing')} style={styles.navLink}>Тарифы</a>
                    <a href="/#faq" onClick={(e) => handleNav(e, '/#faq')} style={styles.navLink}>FAQ</a>
                </nav>
                <div style={styles.ctaContainer}>
                     <a href="/#contact" onClick={(e) => handleNav(e, '/#contact')} className="btn btn-primary" style={{padding: '8px 16px'}}>Получить демо</a>
                </div>
            </div>
        </header>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    background: 'rgba(255, 255, 255, 0.8)',
    borderBottom: '1px solid transparent',
    padding: '16px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
  },
  headerScrolled: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'saturate(180%) blur(10px)',
    borderBottom: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  navLink: {
    color: 'var(--text-light)',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'color 0.3s ease',
    padding: '8px 0',
  },
  ctaContainer: {},
  dropdown: {
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'var(--bg-white)',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border-color)',
      padding: '8px',
      marginTop: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      width: '250px',
      zIndex: 110,
      animation: 'dropdown-enter 0.2s ease-out',
  },
  dropdownLink: {
      color: 'var(--text-dark)',
      textDecoration: 'none',
      padding: '10px 12px',
      borderRadius: 'calc(var(--border-radius) - 4px)',
      transition: 'background-color 0.2s ease, color 0.2s ease',
      fontWeight: 500,
      whiteSpace: 'nowrap',
  },
};