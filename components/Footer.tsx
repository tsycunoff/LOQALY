import React, { FC, useState, useEffect, useRef } from 'react';
import { Logo } from './Logo.tsx';
import { useNav } from '../hooks/useRouter.tsx';

// Animated background waves
const AnimatedWaves: FC = () => {
  return (
    <div style={styles.wavesContainer}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={styles.wave}
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          fill="rgba(52, 211, 153, 0.1)"
          style={{
            animation: 'wave 8s ease-in-out infinite'
          }}
        />
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          fill="rgba(251, 191, 36, 0.08)"
          style={{
            animation: 'wave 12s ease-in-out infinite reverse'
          }}
        />
        <path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          fill="rgba(139, 92, 246, 0.06)"
          style={{
            animation: 'wave 15s ease-in-out infinite'
          }}
        />
      </svg>
    </div>
  );
};

// Interactive newsletter signup
const NewsletterSignup: FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1500);
  };

  if (isSubscribed) {
    return (
      <div style={styles.newsletterSuccess}>
        <div style={styles.successIcon}>✨</div>
        <h3 style={styles.successTitle}>Спасибо за подписку!</h3>
        <p style={styles.successText}>
          Вы первыми узнаете о новых возможностях LOQALY
        </p>
      </div>
    );
  }

  return (
    <div style={styles.newsletterContainer}>
      <div style={styles.newsletterHeader}>
        <h3 style={styles.newsletterTitle}>Будьте в курсе обновлений</h3>
        <p style={styles.newsletterSubtitle}>
          Получайте советы по ресторанному бизнесу и новости о платформе
        </p>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.newsletterForm}>
        <div style={styles.inputWrapper}>
          <input
            type="email"
            placeholder="Ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.newsletterInput}
            required
          />
          <button 
            type="submit" 
            style={styles.newsletterButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <div style={styles.spinner} />
            ) : (
              <>
                Подписаться
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>
        <p style={styles.privacyText}>
          Отправляя форму, вы соглашаетесь с{' '}
          <a href="#" style={styles.privacyLink}>политикой конфиденциальности</a>
        </p>
      </form>
    </div>
  );
};

// Social media links with animations
const SocialLinks: FC = () => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const socialData = [
    {
      name: 'Telegram',
      icon: '📱',
      url: '#',
      color: '#0088cc',
      hoverText: 'Новости и обновления'
    },
    {
      name: 'VK',
      icon: '🔵',
      url: '#',
      color: '#4c75a3',
      hoverText: 'Сообщество рестораторов'
    },
    {
      name: 'YouTube',
      icon: '🎥',
      url: '#',
      color: '#ff0000',
      hoverText: 'Видео-туториалы'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: '#',
      color: '#0077b5',
      hoverText: 'Бизнес-контент'
    }
  ];

  return (
    <div style={styles.socialContainer}>
      <h4 style={styles.socialTitle}>Следите за нами</h4>
      <div style={styles.socialLinks}>
        {socialData.map((social) => (
          <div
            key={social.name}
            style={styles.socialLinkWrapper}
            onMouseEnter={() => setHoveredIcon(social.name)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <a
              href={social.url}
              style={{
                ...styles.socialLink,
                transform: hoveredIcon === social.name ? 'translateY(-4px) scale(1.1)' : 'translateY(0) scale(1)',
                boxShadow: hoveredIcon === social.name 
                  ? `0 8px 25px ${social.color}40` 
                  : '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <span style={styles.socialIcon}>{social.icon}</span>
            </a>
            
            {hoveredIcon === social.name && (
              <div style={styles.socialTooltip}>
                {social.hoverText}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick stats ticker
const StatsTicker: FC = () => {
  const [currentStat, setCurrentStat] = useState(0);
  
  const stats = [
    { label: 'Активных ресторанов', value: '950+', icon: '🏪' },
    { label: 'Отзывов обработано', value: '254K+', icon: '💬' },
    { label: 'Средний рост выручки', value: '17%', icon: '📈' },
    { label: 'Время работы системы', value: '99.9%', icon: '⚡' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div style={styles.statsTickerContainer}>
      <div style={styles.tickerLabel}>📊 Статистика в реальном времени:</div>
      <div style={styles.statDisplay}>
        <span style={styles.statIcon}>{stats[currentStat].icon}</span>
        <span style={styles.statValue}>{stats[currentStat].value}</span>
        <span style={styles.statLabel}>{stats[currentStat].label}</span>
      </div>
    </div>
  );
};

// Interactive footer links with hover effects
const FooterSection: FC<{
  title: string;
  links: Array<{ label: string; href: string; isNew?: boolean }>;
  onNavigate: (path: string) => void;
}> = ({ title, links, onNavigate }) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <div style={styles.footerSection}>
      <h4 style={styles.footerSectionTitle}>{title}</h4>
      <div style={styles.footerLinks}>
        {links.map((link) => (
          <div
            key={link.label}
            style={styles.footerLinkWrapper}
            onMouseEnter={() => setHoveredLink(link.label)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <a
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.href);
              }}
              style={{
                ...styles.footerLink,
                transform: hoveredLink === link.label ? 'translateX(8px)' : 'translateX(0)',
                color: hoveredLink === link.label ? 'var(--primary-color)' : 'var(--bg-light)'
              }}
            >
              <span style={styles.linkIcon}>→</span>
              {link.label}
              {link.isNew && <span style={styles.newBadge}>NEW</span>}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Footer component
export const Footer: FC = () => {
  const navigate = useNav();
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLFooterElement>(null);
  
  const handleNav = (path: string) => {
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const footerSections = [
    {
      title: 'Продукт',
      links: [
        { label: 'Возможности', href: '/#features' },
        { label: 'Тарифы', href: '/pricing' },
        { label: 'Интеграции', href: '/#integrations' },
        { label: 'API', href: '/api', isNew: true }
      ]
    },
    {
      title: 'Ресурсы',
      links: [
        { label: 'Блог', href: '/blog' },
        { label: 'Кейсы', href: '/cases' },
        { label: 'Вебинары', href: '/webinars' },
        { label: 'Поддержка', href: '/support' }
      ]
    },
    {
      title: 'Компания',
      links: [
        { label: 'О нас', href: '/about' },
        { label: 'Карьера', href: '/careers', isNew: true },
        { label: 'Партнерам', href: '/partners' },
        { label: 'Пресса', href: '/press' }
      ]
    }
  ];

  return (
    <footer 
      ref={footerRef}
      style={{
        ...styles.footer,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: isVisible ? 1 : 0.8
      }}
    >
      <AnimatedWaves />
      
      <div className="container" style={styles.footerContainer}>
        {/* Top section with newsletter and stats */}
        <div style={styles.footerTop}>
          <div style={styles.footerTopLeft}>
            <div style={styles.footerBrand}>
              <Logo onDark />
              <p style={styles.footerBrandText}>
                Платформа нового поколения для управления рестораном. 
                Автоматизируйте процессы и увеличивайте прибыль с помощью AI.
              </p>
              <SocialLinks />
            </div>
          </div>
          
          <div style={styles.footerTopRight}>
            <NewsletterSignup />
          </div>
        </div>

        {/* Stats ticker */}
        <StatsTicker />

        {/* Main footer content */}
        <div style={styles.footerMain}>
          <div style={styles.footerGrid}>
            {footerSections.map((section) => (
              <FooterSection
                key={section.title}
                title={section.title}
                links={section.links}
                onNavigate={handleNav}
              />
            ))}

            {/* Contact section */}
            <div style={styles.footerSection}>
              <h4 style={styles.footerSectionTitle}>Контакты</h4>
              <div style={styles.contactInfo}>
                <div style={styles.contactItem}>
                  <span style={styles.contactIcon}>📧</span>
                  <a href="mailto:hello@loqaly.ru" style={styles.contactLink}>
                    hello@loqaly.ru
                  </a>
                </div>
                <div style={styles.contactItem}>
                  <span style={styles.contactIcon}>📞</span>
                  <a href="tel:+78001234567" style={styles.contactLink}>
                    8 (800) 123-45-67
                  </a>
                </div>
                <div style={styles.contactItem}>
                  <span style={styles.contactIcon}>📍</span>
                  <span style={styles.contactText}>
                    Москва, БЦ "Технопарк"
                  </span>
                </div>
                <div style={styles.contactItem}>
                  <span style={styles.contactIcon}>🕒</span>
                  <span style={styles.contactText}>
                    Поддержка 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div style={styles.footerBottom}>
          <div style={styles.footerBottomLeft}>
            <p style={styles.copyright}>
              © {new Date().getFullYear()} LOQALY. Все права защищены.
            </p>
            <div style={styles.legalLinks}>
              <a href="/privacy" style={styles.legalLink}>Политика конфиденциальности</a>
              <span style={styles.legalDivider}>•</span>
              <a href="/terms" style={styles.legalLink}>Условия использования</a>
              <span style={styles.legalDivider}>•</span>
              <a href="/cookies" style={styles.legalLink}>Cookie</a>
            </div>
          </div>
          
          <div style={styles.footerBottomRight}>
            <div style={styles.badges}>
              <div style={styles.badge}>
                <span style={styles.badgeIcon}>🔒</span>
                <span style={styles.badgeText}>SSL защищено</span>
              </div>
              <div style={styles.badge}>
                <span style={styles.badgeIcon}>🏆</span>
                <span style={styles.badgeText}>Рейтинг 4.9</span>
              </div>
              <div style={styles.badge}>
                <span style={styles.badgeIcon}>✅</span>
                <span style={styles.badgeText}>ISO 27001</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    color: 'var(--bg-light)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.6s ease',
  },
  wavesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '120px',
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  footerContainer: {
    position: 'relative',
    zIndex: 2,
    paddingTop: '140px',
    paddingBottom: '40px',
  },
  footerTop: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '60px',
    marginBottom: '60px',
    alignItems: 'start',
  },
  footerTopLeft: {},
  footerTopRight: {},
  footerBrand: {
    marginBottom: '32px',
  },
  footerBrandText: {
    fontSize: '16px',
    lineHeight: 1.6,
    opacity: 0.8,
    marginTop: '16px',
    marginBottom: '24px',
    maxWidth: '400px',
  },
  newsletterContainer: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(52, 211, 153, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  newsletterHeader: {
    marginBottom: '24px',
  },
  newsletterTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '8px',
    color: 'white',
  },
  newsletterSubtitle: {
    fontSize: '14px',
    opacity: 0.7,
    lineHeight: 1.5,
  },
  newsletterForm: {},
  inputWrapper: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
  },
  newsletterInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  newsletterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--primary-color)',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  privacyText: {
    fontSize: '12px',
    opacity: 0.6,
    textAlign: 'center',
  },
  privacyLink: {
    color: 'var(--primary-color)',
    textDecoration: 'none',
  },
  newsletterSuccess: {
    textAlign: 'center',
    padding: '40px 32px',
  },
  successIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '8px',
    color: 'white',
  },
  successText: {
    opacity: 0.8,
    fontSize: '16px',
  },
  socialContainer: {
    marginTop: '24px',
  },
  socialTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '16px',
    color: 'white',
  },
  socialLinks: {
    display: 'flex',
    gap: '16px',
  },
  socialLinkWrapper: {
    position: 'relative',
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    backdropFilter: 'blur(10px)',
  },
  socialIcon: {
    fontSize: '20px',
  },
  socialTooltip: {
    position: 'absolute',
    bottom: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    animation: 'fadeIn 0.3s ease',
  },
  statsTickerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    background: 'rgba(52, 211, 153, 0.1)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '60px',
    border: '1px solid rgba(52, 211, 153, 0.2)',
  },
  tickerLabel: {
    fontSize: '14px',
    fontWeight: 600,
    opacity: 0.8,
  },
  statDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statIcon: {
    fontSize: '20px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 800,
    color: 'var(--primary-color)',
  },
  statLabel: {
    fontSize: '14px',
    opacity: 0.9,
  },
  footerMain: {},
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '40px',
    marginBottom: '60px',
  },
  footerSection: {},
  footerSectionTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '20px',
    color: 'white',
  },
  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  footerLinkWrapper: {},
  footerLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    textDecoration: 'none',
    opacity: 0.8,
    transition: 'all 0.3s ease',
    padding: '4px 0',
  },
  linkIcon: {
    fontSize: '12px',
    opacity: 0.6,
    transition: 'all 0.3s ease',
  },
  newBadge: {
    background: 'var(--secondary-color)',
    color: 'black',
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '4px',
    marginLeft: '8px',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  contactIcon: {
    fontSize: '16px',
    width: '24px',
  },
  contactLink: {
    color: 'var(--bg-light)',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.3s ease',
  },
  contactText: {
    fontSize: '14px',
    opacity: 0.8,
  },
  footerBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '40px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    flexWrap: 'wrap',
    gap: '20px',
  },
  footerBottomLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  copyright: {
    fontSize: '14px',
    opacity: 0.6,
    margin: 0,
  },
  legalLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legalLink: {
    fontSize: '12px',
    color: 'var(--bg-light)',
    textDecoration: 'none',
    opacity: 0.6,
    transition: 'opacity 0.3s ease',
  },
  legalDivider: {
    opacity: 0.4,
    fontSize: '12px',
  },
  footerBottomRight: {},
  badges: {
    display: 'flex',
    gap: '16px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  badgeIcon: {
    fontSize: '14px',
  },
  badgeText: {
    fontSize: '12px',
    fontWeight: 600,
    opacity: 0.8,
  },
};

// CSS animations
const animationStyles = `
  @keyframes wave {
    0% { transform: translateX(0); }
    50% { transform: translateX(-25%); }
    100% { transform: translateX(-50%); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .newsletterInput:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.1);
  }
  
  .newsletterButton:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(52, 211, 153, 0.3);
  }
  
  .contactLink:hover {
    color: var(--primary-color);
  }
  
  .legalLink:hover {
    opacity: 1;
    color: var(--primary-color);
  }
  
  .badge:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    .footerTop {
      grid-template-columns: 1fr !important;
      gap: 40px;
    }
    
    .footerGrid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 32px;
    }
    
    .inputWrapper {
      flex-direction: column;
      gap: 12px;
    }
    
    .newsletterButton {
      width: 100%;
      justify-content: center;
    }
    
    .socialLinks {
      justify-content: center;
    }
    
    .statsTickerContainer {
      flex-direction: column;
      text-align: center;
      gap: 12px;
    }
    
    .footerBottom {
      flex-direction: column;
      text-align: center;
      gap: 16px;
    }
    
    .badges {
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .legalLinks {
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    .footerGrid {
      grid-template-columns: 1fr !important;
    }
    
    .newsletterContainer {
      padding: 24px !important;
    }
    
    .footerContainer {
      paddingTop: 120px !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('footer-animation-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'footer-animation-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
}