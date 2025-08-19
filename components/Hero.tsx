import React, { FC, useEffect, useRef, useState } from 'react';
import { useNav } from '../hooks/useRouter.tsx';

// Floating particles component
const FloatingParticles: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Particles system
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
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '#34D399' : '#FBBF24'
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
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
        zIndex: 1
      }}
    />
  );
};

// Floating cards component
const FloatingCards: FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const cards = [
    { icon: '📊', text: 'AI Analytics', delay: 0 },
    { icon: '🎯', text: 'Smart Campaigns', delay: 0.5 },
    { icon: '⭐', text: 'Review Management', delay: 1 },
    { icon: '📱', text: 'QR Ordering', delay: 1.5 }
  ];
  
  return (
    <div style={styles.floatingCards}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            ...styles.floatingCard,
            transform: `translate(${mousePos.x * 0.02 * (index + 1)}px, ${mousePos.y * 0.02 * (index + 1)}px)`,
            animationDelay: `${card.delay}s`
          }}
        >
          <span style={styles.cardIcon}>{card.icon}</span>
          <span style={styles.cardText}>{card.text}</span>
        </div>
      ))}
    </div>
  );
};

// Animated metrics
const AnimatedMetric: FC<{ value: number; suffix: string; label: string; delay: number }> = ({ value, suffix, label, delay }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(counter);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);
  
  return (
    <div ref={ref} style={styles.metricCard}>
      <div style={styles.metricValue}>
        {count.toLocaleString('ru-RU')}{suffix}
      </div>
      <div style={styles.metricLabel}>{label}</div>
    </div>
  );
};

export const Hero: FC = () => {
  const navigate = useNav();
  const [isLoaded, setIsLoaded] = useState(false);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
    const hash = path.split('#')[1];
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <section style={styles.hero} className="fade-in">
      {/* Dynamic background layers */}
      <div style={styles.heroBg}></div>
      <div style={styles.gradientOverlay}></div>
      <FloatingParticles />
      
      <div className="container" style={styles.heroGrid}>
        <div style={{...styles.heroContent, opacity: isLoaded ? 1 : 0, transform: isLoaded ? 'translateY(0)' : 'translateY(30px)'}}>
          <div style={styles.badge}>
            🚀 Новинка: AI-анализ отзывов
          </div>
          
          <h1 style={styles.heroTitle}>
            Увеличивайте прибыль и&nbsp;
            <span style={styles.gradientText}>возвращайте гостей</span>
          </h1>
          
          <p style={styles.heroSubtitle}>
            LOQALY — это единая платформа для управления рестораном: от QR-меню и сбора отзывов до AI-аналитики и автоматического удержания клиентов.
          </p>
          
          {/* Quick metrics */}
          <div style={styles.quickMetrics}>
            <AnimatedMetric value={17} suffix="%" label="Рост выручки" delay={0} />
            <AnimatedMetric value={950} suffix="+" label="Ресторанов" delay={200} />
            <AnimatedMetric value={254} suffix="K" label="Отзывов" delay={400} />
          </div>
          
          <div style={styles.heroButtons}>
            <a 
              href="/#contact" 
              onClick={(e) => handleNav(e, '/#contact')} 
              className="btn btn-primary"
              style={styles.primaryButton}
            >
              <span>Получить демо</span>
              <span style={styles.buttonIcon}>→</span>
            </a>
            <a 
              href="/pricing" 
              onClick={(e) => handleNav(e, '/pricing')} 
              className="btn btn-secondary"
              style={styles.secondaryButton}
            >
              Смотреть тарифы
            </a>
          </div>
          
          <p style={styles.heroFootnote}>
            ✨ 14 дней бесплатно, кредитная карта не требуется
          </p>
        </div>
        
        <div style={styles.heroImageContainer}>
          <FloatingCards />
          <div style={styles.phoneFrame}>
            <img 
              src="https://storage.googleapis.com/maker-studio-project-media-prod/1f5a2a53-4752-4712-a7f4-7546a1504886/images/loqaly-dashboard.png" 
              alt="Панель управления LOQALY" 
              style={styles.heroImage} 
            />
          </div>
          <div style={styles.glowEffect}></div>
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  hero: {
    padding: '120px 0 80px 0',
    background: 'var(--bg-white)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
  },
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse at top left, rgba(52, 211, 153, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
    zIndex: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)',
    zIndex: 0,
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    alignItems: 'center',
    gap: '80px',
    position: 'relative',
    zIndex: 2,
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '24px',
    transition: 'all 0.8s ease',
  },
  badge: {
    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '99px',
    fontSize: '14px',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)',
    animation: 'pulse 2s infinite',
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: 800,
    lineHeight: 1.1,
    color: 'var(--text-dark)',
    letterSpacing: '-0.02em',
  },
  gradientText: {
    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: 'var(--text-light)',
    maxWidth: '520px',
    lineHeight: 1.6,
  },
  quickMetrics: {
    display: 'flex',
    gap: '32px',
    marginTop: '8px',
  },
  metricCard: {
    textAlign: 'center',
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: 800,
    color: 'var(--primary-dark)',
    lineHeight: 1,
  },
  metricLabel: {
    fontSize: '14px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    marginTop: '16px',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 32px',
    fontSize: '18px',
    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
    transform: 'translateY(0)',
    transition: 'all 0.3s ease',
  },
  secondaryButton: {
    padding: '16px 32px',
    fontSize: '18px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(52, 211, 153, 0.2)',
  },
  buttonIcon: {
    transition: 'transform 0.3s ease',
  },
  heroFootnote: {
    fontSize: '16px',
    color: 'var(--text-light)',
    opacity: 0.8,
  },
  heroImageContainer: {
    position: 'relative',
    borderRadius: '24px',
    overflow: 'visible',
  },
  phoneFrame: {
    position: 'relative',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
    transform: 'perspective(1000px) rotateY(-10deg) rotateX(5deg)',
    transition: 'transform 0.3s ease',
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
    backdropFilter: 'blur(10px)',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  glowEffect: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    right: '-50%',
    bottom: '-50%',
    background: 'radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, transparent 70%)',
    animation: 'glow 4s ease-in-out infinite alternate',
    zIndex: -1,
  },
  floatingCards: {
    position: 'absolute',
    top: '10%',
    left: '-20%',
    right: '-20%',
    bottom: '10%',
    pointerEvents: 'none',
    zIndex: 1,
  },
  floatingCard: {
    position: 'absolute',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    animation: 'float 6s ease-in-out infinite',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-dark)',
  },
  cardIcon: {
    fontSize: '20px',
  },
  cardText: {
    whiteSpace: 'nowrap',
  },
};

// Add custom CSS keyframes
const customStyles = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(1deg); }
    66% { transform: translateY(-10px) rotate(-1deg); }
  }
  
  @keyframes glow {
    0% { opacity: 0.3; transform: scale(1); }
    100% { opacity: 0.6; transform: scale(1.1); }
  }
  
  .btn-primary:hover .buttonIcon {
    transform: translateX(4px);
  }
  
  .phoneFrame:hover {
    transform: perspective(1000px) rotateY(-5deg) rotateX(2deg) scale(1.02);
  }
  
  .floatingCard:nth-child(1) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }
  
  .floatingCard:nth-child(2) {
    top: 40%;
    right: 15%;
    animation-delay: 1s;
  }
  
  .floatingCard:nth-child(3) {
    bottom: 30%;
    left: 5%;
    animation-delay: 2s;
  }
  
  .floatingCard:nth-child(4) {
    bottom: 50%;
    right: 10%;
    animation-delay: 3s;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}