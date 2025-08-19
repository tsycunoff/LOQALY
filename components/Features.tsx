import React, { FC, useState, useRef, useEffect } from 'react';
import { featureData } from '../data/content.ts';
import { useNav } from '../hooks/useRouter.tsx';

// 3D Tilt effect hook
const useTilt = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
};

// Interactive particle background for cards
const ParticleBackground: FC<{ isActive: boolean; color: string }> = ({ isActive, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isActive) {
        particles.forEach((particle, index) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.opacity = Math.min(0.8, particle.opacity + 0.02);

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
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
              ctx.strokeStyle = color + '20';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        });
      } else {
        particles.forEach(particle => {
          particle.opacity = Math.max(0, particle.opacity - 0.05);
          if (particle.opacity > 0) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
            ctx.fill();
          }
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, color]);

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
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
};

// Feature icon with advanced animations
const FeatureIcon: FC<{ icon: string; isActive: boolean; color: string }> = ({ icon, isActive, color }) => {
  const icons: { [key: string]: React.ReactNode } = {
    qr: (
      <g>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="5" y="5" width="3" height="3" />
        <rect x="5" y="16" width="3" height="3" />
        <rect x="16" y="5" width="3" height="3" />
        <path d="M13 13h1v1h-1z" />
        <path d="M15 13h1v1h-1z" />
        <path d="M13 15h1v1h-1z" />
        <path d="M15 15h1v1h-1z" />
        <path d="M19 13h2v8h-8v-2" />
      </g>
    ),
    feedback: (
      <g>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="15" cy="12" r="1" />
        <path d="M12 8v4l-2 2" strokeLinecap="round" />
      </g>
    ),
    ai: (
      <g>
        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" strokeLinecap="round" />
      </g>
    ),
    campaign: (
      <g>
        <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <path d="M6 1v3M10 1v3M14 1v3" strokeLinecap="round" />
        <circle cx="8" cy="11" r="1" />
        <circle cx="12" cy="11" r="1" />
        <circle cx="16" cy="11" r="1" />
      </g>
    ),
    aggregate: (
      <g>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M7 8h10M7 12h10M7 16h6" strokeLinecap="round" />
        <circle cx="18" cy="8" r="2" />
      </g>
    ),
    integration: (
      <g>
        <path d="M17 8l4 4-4 4M7 8l-4 4 4 4M14 4l-4 16" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" />
      </g>
    )
  };

  return (
    <div 
      style={{
        ...styles.iconWrapper,
        background: isActive ? color : 'rgba(52, 211, 153, 0.1)',
        transform: isActive ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
        boxShadow: isActive ? `0 8px 25px ${color}40` : '0 4px 15px rgba(0, 0, 0, 0.1)'
      }}
    >
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={isActive ? 'white' : color} 
        strokeWidth="2"
        style={{
          transition: 'all 0.3s ease',
          filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none'
        }}
      >
        {icons[icon] || icons.qr}
      </svg>
    </div>
  );
};

// Main feature card component
const FeatureCard: FC<{ feature: any; index: number; isInView: boolean }> = ({ feature, index, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNav();
  const cardRef = useRef<HTMLDivElement>(null);

  useTilt(cardRef);

  const colors = [
    '#34D399', // Green
    '#FBBF24', // Yellow
    '#8B5CF6', // Purple
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#F59E0B'  // Orange
  ];

  const cardColor = colors[index % colors.length];

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsActive(true), index * 200);
      return () => clearTimeout(timer);
    }
  }, [isInView, index]);

  const handleClick = () => {
    navigate(`/features/${feature.id}`);
  };

  return (
    <div
      ref={cardRef}
      style={{
        ...styles.featureCard,
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s ease ${index * 0.1}s`,
        borderColor: isHovered ? cardColor : 'transparent',
        background: isHovered 
          ? `linear-gradient(135deg, white, ${cardColor}08)` 
          : 'white'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <ParticleBackground isActive={isHovered} color={cardColor} />
      
      <div style={styles.cardContent}>
        <div style={styles.cardHeader}>
          <FeatureIcon icon={feature.icon} isActive={isHovered} color={cardColor} />
          <div style={styles.cardBadge}>
            Новинка
          </div>
        </div>

        <h3 style={{
          ...styles.featureTitle,
          color: isHovered ? cardColor : 'var(--text-dark)'
        }}>
          {feature.title}
        </h3>

        <p style={styles.featureText}>
          {feature.text}
        </p>

        <div style={styles.cardFooter}>
          <div style={styles.learnMore}>
            <span style={{ color: cardColor }}>Узнать больше</span>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={cardColor} 
              strokeWidth="2"
              style={{
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
              }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: isHovered ? '100%' : '0%',
                background: cardColor
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div 
        style={{
          ...styles.floatingElement,
          opacity: isHovered ? 1 : 0,
          background: cardColor + '20'
        }}
      />
    </div>
  );
};

// Interactive demo preview
const DemoPreview: FC<{ activeFeature: number }> = ({ activeFeature }) => {
  const demoContent = [
    { title: "QR-меню в действии", content: "Сканируйте → Заказывайте → Оплачивайте" },
    { title: "Сбор отзывов", content: "Автоматические опросы после каждого визита" },
    { title: "AI-анализ", content: "Умная аналитика выявляет скрытые проблемы" },
    { title: "Кампании", content: "Персонализированные предложения для каждого гостя" },
    { title: "Агрегация", content: "Все отзывы из интернета в одном месте" },
    { title: "Интеграции", content: "Бесшовная работа с вашей POS-системой" }
  ];

  return (
    <div style={styles.demoPreview}>
      <div style={styles.demoHeader}>
        <h4>Демо: {demoContent[activeFeature]?.title}</h4>
      </div>
      <div style={styles.demoContent}>
        <div style={styles.demoMockup}>
          <div style={styles.phoneFrame}>
            <div style={styles.screenContent}>
              <div style={styles.demoText}>
                {demoContent[activeFeature]?.content}
              </div>
              <div style={styles.demoAnimation}>
                <div 
                  style={{
                    ...styles.pulseCircle,
                    animationDelay: '0s'
                  }}
                />
                <div 
                  style={{
                    ...styles.pulseCircle,
                    animationDelay: '0.5s'
                  }}
                />
                <div 
                  style={{
                    ...styles.pulseCircle,
                    animationDelay: '1s'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Features component
export const Features: FC = () => {
  const [inViewFeatures, setInViewFeatures] = useState<boolean[]>(new Array(featureData.length).fill(false));
  const [activeDemo, setActiveDemo] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Intersection observer for animations
  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInViewFeatures(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  // Auto-rotate demo
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo(prev => (prev + 1) % featureData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
    <section id="features" ref={sectionRef} style={styles.section}>
      {/* Background */}
      <div style={styles.backgroundPattern} />
      
      <div className="container">
        <div style={styles.header}>
          <div style={styles.badge}>
            ⚡ Полный функционал
          </div>
          <h2 style={styles.title}>
            Что умеет <span style={styles.gradientText}>LOQALY</span>
          </h2>
          <p style={styles.subtitle}>
            Все инструменты для роста вашего заведения в одной платформе. 
            От автоматизации до аналитики — мы покрываем весь цикл работы с клиентами.
          </p>
        </div>

        {/* Demo Preview */}
        <DemoPreview activeFeature={activeDemo} />

        {/* Features grid */}
        <div style={styles.featuresGrid}>
          {featureData.map((feature, index) => (
            <div
              key={feature.id}
              ref={el => { cardRefs.current[index] = el; }}
            >
              <FeatureCard
                feature={feature}
                index={index}
                isInView={inViewFeatures[index]}
              />
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div style={styles.statsSection}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🚀</div>
              <div style={styles.statNumber}>2.5x</div>
              <div style={styles.statLabel}>Быстрее запуск новых кампаний</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>⭐</div>
              <div style={styles.statNumber}>+0.4</div>
              <div style={styles.statLabel}>Средний рост рейтинга</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>💰</div>
              <div style={styles.statNumber}>87%</div>
              <div style={styles.statLabel}>Клиентов видят рост выручки</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🎯</div>
              <div style={styles.statNumber}>15%</div>
              <div style={styles.statLabel}>Увеличение retention rate</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={styles.ctaSection}>
          <h3 style={styles.ctaTitle}>Готовы протестировать все возможности?</h3>
          <p style={styles.ctaText}>
            Получите доступ ко всем функциям на 14 дней бесплатно
          </p>
          <div style={styles.ctaButtons}>
            <a href="/#contact" onClick={(e) => handleNav(e, '/#contact')} style={styles.ctaPrimary}>
              Начать бесплатно
              <span style={styles.ctaIcon}>🚀</span>
            </a>
            <a href="/pricing" onClick={(e) => handleNav(e, '/pricing')} style={styles.ctaSecondary}>
              Смотреть демо
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
    position: 'relative',
    overflow: 'hidden',
    padding: '100px 0',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 25% 25%, rgba(52, 211, 153, 0.1) 0%, transparent 25%),
      radial-gradient(circle at 75% 75%, rgba(251, 191, 36, 0.1) 0%, transparent 25%)
    `,
    backgroundSize: '400px 400px',
    animation: 'drift 20s ease-in-out infinite',
  },
  header: {
    textAlign: 'center',
    marginBottom: '80px',
  },
  badge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '99px',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(52, 211, 153, 0.3)',
  },
  title: {
    fontSize: '48px',
    fontWeight: 800,
    marginBottom: '24px',
    color: 'var(--text-dark)',
    lineHeight: 1.2,
  },
  gradientText: {
    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '20px',
    color: 'var(--text-light)',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  demoPreview: {
    background: 'linear-gradient(135deg, white, rgba(52, 211, 153, 0.02))',
    borderRadius: '24px',
    padding: '40px',
    marginBottom: '60px',
    border: '1px solid rgba(52, 211, 153, 0.1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
  },
  demoHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  demoContent: {
    display: 'flex',
    justifyContent: 'center',
  },
  demoMockup: {
    position: 'relative',
  },
  phoneFrame: {
    width: '200px',
    height: '300px',
    background: 'linear-gradient(135deg, #1f2937, #374151)',
    borderRadius: '24px',
    padding: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },
  screenContent: {
    width: '100%',
    height: '100%',
    background: 'white',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
  },
  demoText: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-dark)',
    textAlign: 'center',
    padding: '0 16px',
  },
  demoAnimation: {
    display: 'flex',
    gap: '8px',
  },
  pulseCircle: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'var(--primary-color)',
    animation: 'pulse 2s infinite',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '32px',
    marginBottom: '80px',
  },
  featureCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '2px solid transparent',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transformStyle: 'preserve-3d',
  },
  cardContent: {
    position: 'relative',
    zIndex: 2,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  },
  cardBadge: {
    background: 'rgba(52, 211, 153, 0.1)',
    color: 'var(--primary-color)',
    padding: '4px 12px',
    borderRadius: '99px',
    fontSize: '12px',
    fontWeight: 600,
  },
  iconWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  featureTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '16px',
    transition: 'color 0.3s ease',
    lineHeight: 1.3,
  },
  featureText: {
    color: 'var(--text-light)',
    lineHeight: 1.7,
    fontSize: '16px',
    marginBottom: '24px',
  },
  cardFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  learnMore: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: 600,
  },
  progressBar: {
    height: '3px',
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '99px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '99px',
    transition: 'width 0.4s ease',
  },
  floatingElement: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    transition: 'all 0.4s ease',
    transform: 'scale(0)',
  },
  statsSection: {
    marginBottom: '80px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
  },
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(52, 211, 153, 0.1)',
    transition: 'transform 0.3s ease',
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 800,
    color: 'var(--primary-color)',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  ctaSection: {
    textAlign: 'center',
    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
    borderRadius: '24px',
    padding: '60px 40px',
    color: 'white',
    maxWidth: '800px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontSize: '32px',
    fontWeight: 700,
    marginBottom: '16px',
  },
  ctaText: {
    fontSize: '18px',
    marginBottom: '32px',
    opacity: 0.9,
  },
  ctaButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimary: {
    background: 'white',
    color: 'var(--primary-dark)',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
  },
  ctaSecondary: {
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
  },
  ctaIcon: {
    fontSize: '16px',
  },
};

// CSS animations
const animationStyles = `
  @keyframes drift {
    0%, 100% { transform: translateX(0) translateY(0); }
    25% { transform: translateX(20px) translateY(-20px); }
    50% { transform: translateX(-20px) translateY(20px); }
    75% { transform: translateX(20px) translateY(20px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }
  
  .featureCard:hover .floatingElement {
    transform: scale(1) !important;
    opacity: 1 !important;
  }
  
  .statCard:hover {
    transform: translateY(-4px);
  }
  
  .ctaPrimary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .ctaSecondary:hover {
    background: white;
    color: var(--primary-dark);
  }
  
  @media (max-width: 768px) {
    .featuresGrid {
      grid-template-columns: 1fr !important;
      gap: 20px;
    }
    
    .title {
      font-size: 36px !important;
    }
    
    .demoPreview {
      padding: 24px !important;
    }
    
    .ctaButtons {
      flex-direction: column;
      align-items: center;
    }
    
    .statsGrid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('features-animation-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'features-animation-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
}