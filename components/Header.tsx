import React, { FC, useState, useEffect, useRef } from 'react';
import { Logo } from './Logo.tsx';
import { useNav } from '../hooks/useRouter.tsx';
import { featureData } from '../data/content.ts';

// Animated background particles for header
const HeaderParticles: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 100;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    // Create particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        color: Math.random() > 0.5 ? '#34D399' : '#FBBF24'
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Draw connections
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = particle.color + '15';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.6
      }}
    />
  );
};

// Enhanced dropdown menu with animations
const DropdownMenu: FC<{
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}> = ({ isOpen, onClose, onNavigate }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <div 
      style={styles.dropdownOverlay}
      onClick={onClose}
    >
      <div 
        style={styles.dropdownMenu}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.dropdownHeader}>
          <h3 style={styles.dropdownTitle}>Возможности LOQALY</h3>
          <p style={styles.dropdownSubtitle}>Выберите функцию для подробного изучения</p>
        </div>

        <div style={styles.featuresGrid}>
          {featureData.map((feature, index) => (
            <div
              key={feature.id}
              style={{
                ...styles.featureMenuItem,
                transform: hoveredIndex === index ? 'translateY(-2px)' : 'translateY(0)',
                background: hoveredIndex === index ? 'rgba(52, 211, 153, 0.05)' : 'white'
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                onNavigate(`/features/${feature.id}`);
                onClose();
              }}
            >
              <div style={styles.featureIcon}>
                {getFeatureIcon(feature.icon)}
              </div>
              <div style={styles.featureContent}>
                <h4 style={styles.featureTitle}>{feature.title}</h4>
                <p style={styles.featureDescription}>
                  {feature.text.substring(0, 60)}...
                </p>
              </div>
              <div style={styles.featureArrow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.dropdownFooter}>
          <button 
            style={styles.viewAllButton}
            onClick={() => {
              onNavigate('/#features');
              onClose();
            }}
          >
            Посмотреть все возможности
            <span style={styles.buttonIcon}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Mobile menu component
const MobileMenu: FC<{
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'Возможности', path: '/#features' },
    { label: 'Тарифы', path: '/pricing' },
    { label: 'FAQ', path: '/#faq' },
    { label: 'Контакты', path: '/#contact' },
  ];

  return (
    <div style={styles.mobileMenuOverlay}>
      <div style={styles.mobileMenu}>
        <div style={styles.mobileMenuHeader}>
          <Logo />
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <nav style={styles.mobileNav}>
          {menuItems.map((item, index) => (
            <a
              key={item.path}
              href={item.path}
              style={{
                ...styles.mobileNavLink,
                animationDelay: `${index * 0.1}s`
              }}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.path);
                onClose();
              }}
            >
              {item.label}
              <span style={styles.mobileNavArrow}>→</span>
            </a>
          ))}
        </nav>

        <div style={styles.mobileMenuFooter}>
          <button 
            style={styles.mobileCta}
            onClick={() => {
              onNavigate('/#contact');
              onClose();
            }}
          >
            Получить демо
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function for feature icons
const getFeatureIcon = (iconType: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    qr: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="5" y="5" width="3" height="3" />
        <rect x="5" y="16" width="3" height="3" />
        <rect x="16" y="5" width="3" height="3" />
      </svg>
    ),
    feedback: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="15" cy="12" r="1" />
      </svg>
    ),
    ai: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
      </svg>
    ),
    campaign: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <circle cx="8" cy="11" r="1" />
        <circle cx="12" cy="11" r="1" />
        <circle cx="16" cy="11" r="1" />
      </svg>
    ),
    aggregate: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M7 8h10M7 12h10M7 16h6" strokeLinecap="round" />
      </svg>
    ),
    integration: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 8l4 4-4 4M7 8l-4 4 4 4M14 4l-4 16" strokeLinecap="round" />
      </svg>
    )
  };

  return iconMap[iconType] || iconMap.qr;
};

// Main Header component
export const Header: FC = () => {
  const navigate = useNav();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setDropdownOpen(false);
    navigate(path);
    const hash = path.split('#')[1];
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
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
      setIsScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <header 
        style={{
          ...styles.header,
          ...(isScrolled ? styles.headerScrolled : {}),
          background: isScrolled 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <HeaderParticles />
        
        {/* Mouse follower effect */}
        <div 
          style={{
            ...styles.mouseFollower,
            left: mousePosition.x - 200,
            top: mousePosition.y - 200,
          }}
        />

        <div className="container" style={styles.nav}>
          <div 
            onClick={() => navigate('/')} 
            style={{cursor: 'pointer', position: 'relative', zIndex: 10}}
          >
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav style={styles.navLinks} className="nav-links">
            <div 
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              style={{ position: 'relative' }}
            >
              <a 
                href="/#features" 
                onClick={(e) => handleNav(e, '/#features')} 
                style={{
                  ...styles.navLink,
                  color: isDropdownOpen ? 'var(--primary-color)' : 'var(--text-light)'
                }}
              >
                Возможности
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{
                    marginLeft: '4px',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              <DropdownMenu 
                isOpen={isDropdownOpen}
                onClose={() => setDropdownOpen(false)}
                onNavigate={handleNavigate}
              />
            </div>

            <a 
              href="/pricing" 
              onClick={(e) => handleNav(e, '/pricing')} 
              style={styles.navLink}
            >
              Тарифы
            </a>

            <a 
              href="/#faq" 
              onClick={(e) => handleNav(e, '/#faq')} 
              style={styles.navLink}
            >
              FAQ
            </a>
          </nav>

          {/* Desktop CTA */}
          <div style={styles.ctaContainer}>
            <a 
              href="/#contact" 
              onClick={(e) => handleNav(e, '/#contact')} 
              style={styles.ctaButton}
              className="header-cta"
            >
              <span style={styles.ctaText}>Получить демо</span>
              <div style={styles.ctaIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            style={styles.mobileMenuButton}
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span style={styles.hamburgerLine}></span>
            <span style={styles.hamburgerLine}></span>
            <span style={styles.hamburgerLine}></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={handleNavigate}
      />
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'saturate(180%) blur(20px)',
    borderBottom: '1px solid transparent',
    padding: '16px 0',
    overflow: 'hidden',
  },
  headerScrolled: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderBottomColor: 'rgba(52, 211, 153, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    padding: '12px 0',
  },
  mouseFollower: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(52, 211, 153, 0.03) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    transition: 'all 0.3s ease',
    zIndex: 1,
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
  },
  navLink: {
    color: 'var(--text-light)',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '16px',
    transition: 'all 0.3s ease',
    padding: '8px 0',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  dropdownOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.1)',
    zIndex: 100,
    animation: 'fadeIn 0.3s ease',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    marginTop: '12px',
    minWidth: '600px',
    maxWidth: '800px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(52, 211, 153, 0.1)',
    animation: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  dropdownHeader: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  dropdownTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-dark)',
    marginBottom: '8px',
  },
  dropdownSubtitle: {
    fontSize: '16px',
    color: 'var(--text-light)',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  featureMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(52, 211, 153, 0.1)',
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(52, 211, 153, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--primary-color)',
    flexShrink: 0,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-dark)',
    marginBottom: '4px',
  },
  featureDescription: {
    fontSize: '14px',
    color: 'var(--text-light)',
    lineHeight: 1.4,
  },
  featureArrow: {
    color: 'var(--text-light)',
    transition: 'transform 0.3s ease',
  },
  dropdownFooter: {
    textAlign: 'center',
    paddingTop: '24px',
    borderTop: '1px solid rgba(52, 211, 153, 0.1)',
  },
  viewAllButton: {
    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0 auto',
    transition: 'all 0.3s ease',
  },
  buttonIcon: {
    fontSize: '18px',
    transition: 'transform 0.3s ease',
  },
  ctaContainer: {
    position: 'relative',
  },
  ctaButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
    color: 'white',
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '16px',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  ctaText: {
    position: 'relative',
    zIndex: 2,
  },
  ctaIcon: {
    transition: 'transform 0.3s ease',
    position: 'relative',
    zIndex: 2,
  },
  mobileMenuButton: {
    display: 'none',
    flexDirection: 'column',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
  },
  hamburgerLine: {
    width: '24px',
    height: '3px',
    background: 'var(--text-dark)',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  mobileMenuOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2000,
    animation: 'fadeIn 0.3s ease',
  },
  mobileMenu: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '100%',
    maxWidth: '400px',
    height: '100%',
    background: 'white',
    padding: '24px',
    animation: 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
  },
  mobileMenuHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-color)',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: 'var(--text-light)',
    padding: '8px',
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  mobileNavLink: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    textDecoration: 'none',
    color: 'var(--text-dark)',
    fontSize: '18px',
    fontWeight: 600,
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    animation: 'slideInLeft 0.5s ease forwards',
    opacity: 0,
    transform: 'translateX(20px)',
  },
  mobileNavArrow: {
    fontSize: '20px',
    color: 'var(--text-light)',
    transition: 'transform 0.3s ease',
  },
  mobileMenuFooter: {
    paddingTop: '24px',
    borderTop: '1px solid var(--border-color)',
  },
  mobileCta: {
    width: '100%',
    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
    color: 'white',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

// CSS animations
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideDown {
    from { 
      opacity: 0; 
      transform: translateX(-50%) translateY(-20px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(-50%) translateY(0); 
    }
  }
  
  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  
  @keyframes slideInLeft {
    from { 
      opacity: 0; 
      transform: translateX(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  .header-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(52, 211, 153, 0.4);
  }
  
  .header-cta:hover .ctaIcon {
    transform: translateX(4px);
  }
  
  .header-cta::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  .header-cta:hover::before {
    left: 100%;
  }
  
  .mobile-menu-btn:hover .hamburgerLine {
    background: var(--primary-color);
  }
  
  .mobileNavLink:hover {
    background: rgba(52, 211, 153, 0.05);
    transform: translateX(8px);
  }
  
  .mobileNavLink:hover .mobileNavArrow {
    transform: translateX(4px);
    color: var(--primary-color);
  }
  
  .viewAllButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(52, 211, 153, 0.3);
  }
  
  .viewAllButton:hover .buttonIcon {
    transform: translateX(4px);
  }
  
  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
    
    .mobile-menu-btn {
      display: flex !important;
    }
    
    .featuresGrid {
      grid-template-columns: 1fr !important;
    }
    
    .dropdownMenu {
      min-width: 350px !important;
      max-width: 90vw !important;
      padding: 24px !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('header-animation-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'header-animation-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
}