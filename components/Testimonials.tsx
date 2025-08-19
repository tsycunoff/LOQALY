import React, { FC, useState, useRef, useEffect } from 'react';

// Individual testimonial card with 3D effects
const TestimonialCard: FC<{
  testimonial: {
    id: number;
    name: string;
    role: string;
    company: string;
    avatar: string;
    text: string;
    rating: number;
    metrics: { label: string; value: string; color: string }[];
    tags: string[];
    verified: boolean;
  };
  isActive: boolean;
  isNext: boolean;
  isPrev: boolean;
  onClick: () => void;
}> = ({ testimonial, isActive, isNext, isPrev, onClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isActive]);

  const getCardTransform = () => {
    if (isActive) return 'translateX(0) scale(1) rotateY(0deg)';
    if (isNext) return 'translateX(120%) scale(0.8) rotateY(-15deg)';
    if (isPrev) return 'translateX(-120%) scale(0.8) rotateY(15deg)';
    return 'translateX(200%) scale(0.6) rotateY(-30deg)';
  };

  return (
    <div
      ref={cardRef}
      style={{
        ...styles.testimonialCard,
        transform: getCardTransform(),
        opacity: isActive ? 1 : isPrev || isNext ? 0.7 : 0.3,
        zIndex: isActive ? 10 : isPrev || isNext ? 5 : 1,
      }}
      onClick={onClick}
    >
      {/* Floating gradient overlay */}
      {isActive && (
        <div
          style={{
            ...styles.gradientOverlay,
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(52, 211, 153, 0.1) 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Header with avatar and info */}
      <div style={styles.cardHeader}>
        <div style={styles.avatarContainer}>
          <div style={styles.avatar}>
            <span style={styles.avatarEmoji}>{testimonial.avatar}</span>
            {testimonial.verified && (
              <div style={styles.verifiedBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#10B981">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
          <div style={styles.userInfo}>
            <h4 style={styles.userName}>{testimonial.name}</h4>
            <p style={styles.userRole}>{testimonial.role}</p>
            <p style={styles.company}>{testimonial.company}</p>
          </div>
        </div>

        {/* Rating stars */}
        <div style={styles.rating}>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              style={{
                ...styles.star,
                color: i < testimonial.rating ? '#FBBF24' : '#E5E7EB',
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Quote text */}
      <div style={styles.quoteContainer}>
        <div style={styles.quoteIcon}>"</div>
        <p style={styles.quoteText}>{testimonial.text}</p>
      </div>

      {/* Metrics */}
      <div style={styles.metricsGrid}>
        {testimonial.metrics.map((metric, index) => (
          <div key={index} style={styles.metricItem}>
            <div style={{...styles.metricValue, color: metric.color}}>
              {metric.value}
            </div>
            <div style={styles.metricLabel}>{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div style={styles.tagsContainer}>
        {testimonial.tags.map((tag, index) => (
          <span key={index} style={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      {/* Floating elements */}
      {isActive && (
        <div style={styles.floatingElements}>
          <div style={styles.floatingIcon}>💬</div>
          <div style={{...styles.floatingIcon, animationDelay: '1s'}}>⭐</div>
          <div style={{...styles.floatingIcon, animationDelay: '2s'}}>📈</div>
        </div>
      )}
    </div>
  );
};

// Interactive review stats
const ReviewStats: FC<{ activeTestimonial: number }> = ({ activeTestimonial }) => {
  const [animatedStats, setAnimatedStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    satisfaction: 0,
    retention: 0
  });

  const targetStats = {
    totalReviews: 1247,
    averageRating: 4.9,
    satisfaction: 98,
    retention: 94
  };

  useEffect(() => {
    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setAnimatedStats({
          totalReviews: Math.floor(targetStats.totalReviews * easeOut),
          averageRating: +(targetStats.averageRating * easeOut).toFixed(1),
          satisfaction: Math.floor(targetStats.satisfaction * easeOut),
          retention: Math.floor(targetStats.retention * easeOut)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedStats(targetStats);
        }
      }, interval);

      return () => clearInterval(timer);
    };

    const timer = setTimeout(animateStats, activeTestimonial * 300);
    return () => clearTimeout(timer);
  }, [activeTestimonial]);

  return (
    <div style={styles.statsContainer}>
      <h3 style={styles.statsTitle}>Что говорят цифры</h3>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statNumber}>{animatedStats.totalReviews.toLocaleString()}</div>
          <div style={styles.statLabel}>Отзывов собрано</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⭐</div>
          <div style={styles.statNumber}>{animatedStats.averageRating}</div>
          <div style={styles.statLabel}>Средняя оценка</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>😊</div>
          <div style={styles.statNumber}>{animatedStats.satisfaction}%</div>
          <div style={styles.statLabel}>Довольных клиентов</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔄</div>
          <div style={styles.statNumber}>{animatedStats.retention}%</div>
          <div style={styles.statLabel}>Остались с нами</div>
        </div>
      </div>
    </div>
  );
};

// Video testimonial component
const VideoTestimonial: FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div style={styles.videoContainer}>
      <div style={styles.videoFrame}>
        {!isPlaying ? (
          <div style={styles.videoPlaceholder}>
            <div style={styles.playButton} onClick={() => setIsPlaying(true)}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div style={styles.videoOverlay}>
              <h4 style={styles.videoTitle}>Видеоотзыв от Анны Викторовой</h4>
              <p style={styles.videoSubtitle}>Владелица "Уютная кофейня"</p>
            </div>
          </div>
        ) : (
          <div style={styles.videoPlayer}>
            <div style={styles.videoControls}>
              <button style={styles.pauseButton} onClick={() => setIsPlaying(false)}>
                ⏸️
              </button>
              <div style={styles.progressBar}>
                <div style={styles.progress} />
              </div>
              <span style={styles.timeIndicator}>1:23 / 2:45</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Testimonials component
export const Testimonials: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Анна Викторова",
      role: "Владелица",
      company: "Уютная кофейня",
      avatar: "👩‍💼",
      text: "LOQALY полностью изменил наш подход к работе с клиентами. За первые 2 месяца средний чек вырос на 18%, а количество постоянных клиентов увеличилось в 2 раза. Система сама находит проблемы и предлагает решения!",
      rating: 5,
      metrics: [
        { label: "Рост чека", value: "+18%", color: "#34D399" },
        { label: "Постоянные клиенты", value: "×2", color: "#FBBF24" },
        { label: "Рейтинг", value: "4.8★", color: "#8B5CF6" }
      ],
      tags: ["Кофейня", "Средний чек", "Удержание"],
      verified: true
    },
    {
      id: 2,
      name: "Иван Петров",
      role: "Управляющий",
      company: "Гастробар 42",
      avatar: "👨‍🍳",
      text: "Забыл про Excel-таблицы с отзывами! Теперь вся аналитика в одном месте, а AI показывает что именно нужно улучшить. Команда экономит 15 часов в неделю, которые раньше тратили на ручной анализ.",
      rating: 5,
      metrics: [
        { label: "Экономия времени", value: "15 ч/нед", color: "#34D399" },
        { label: "Автоматизация", value: "90%", color: "#FBBF24" },
        { label: "ROI", value: "340%", color: "#EF4444" }
      ],
      tags: ["Гастробар", "Автоматизация", "Аналитика"],
      verified: true
    },
    {
      id: 3,
      name: "Елена Смирнова",
      role: "Директор по развитию",
      company: "Сеть Fresh Food",
      avatar: "👩‍💻",
      text: "Автоматические кампании работают круглосуточно. Клиенты возвращаются чаще, а мы тратим меньше времени на маркетинг. За год увеличили retention на 25% и открыли еще 3 точки благодаря росту прибыли.",
      rating: 5,
      metrics: [
        { label: "Retention", value: "+25%", color: "#34D399" },
        { label: "Новые точки", value: "+3", color: "#FBBF24" },
        { label: "Прибыль", value: "+67%", color: "#8B5CF6" }
      ],
      tags: ["Сеть", "Retention", "Масштабирование"],
      verified: true
    },
    {
      id: 4,
      name: "Алексей Морозов",
      role: "Франчайзи",
      company: "Pizza Perfect",
      avatar: "👨‍💼",
      text: "Внедрили LOQALY во всех 8 пиццериях франшизы. Система автоматически собирает отзывы и запускает кампании возврата. Теперь видим полную картину по всей сети и можем быстро реагировать на проблемы.",
      rating: 5,
      metrics: [
        { label: "Точек в сети", value: "8", color: "#34D399" },
        { label: "Автоматизация", value: "95%", color: "#FBBF24" },
        { label: "Скорость реакции", value: "2 часа", color: "#EF4444" }
      ],
      tags: ["Франшиза", "Пиццерия", "Мониторинг"],
      verified: true
    }
  ];

  // Auto-advance testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setActiveIndex(prev => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setActiveIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const getVisibleTestimonials = () => {
    return testimonials.map((testimonial, index) => ({
      ...testimonial,
      isActive: index === activeIndex,
      isNext: index === (activeIndex + 1) % testimonials.length,
      isPrev: index === (activeIndex - 1 + testimonials.length) % testimonials.length
    }));
  };

  return (
    <section 
      style={styles.section}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div style={styles.backgroundPattern} />
      
      <div className="container">
        <div style={styles.header}>
          <div style={styles.badge}>
            💬 Реальные истории
          </div>
          <h2 style={styles.title}>
            Что говорят наши <span style={styles.gradientText}>партнеры</span>
          </h2>
          <p style={styles.subtitle}>
            Более 950 заведений уже получают результат. Послушайте истории успеха от владельцев, 
            которые увеличили прибыль благодаря LOQALY.
          </p>
        </div>

        {/* 3D Carousel */}
        <div style={styles.carouselContainer}>
          <div style={styles.carouselWrapper}>
            {getVisibleTestimonials().map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isActive={testimonial.isActive}
                isNext={testimonial.isNext}
                isPrev={testimonial.isPrev}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>

          {/* Navigation controls */}
          <div style={styles.navigationControls}>
            <button style={styles.navButton} onClick={prevTestimonial}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            <div style={styles.indicators}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  style={{
                    ...styles.indicator,
                    background: index === activeIndex ? '#34D399' : '#E5E7EB',
                    transform: index === activeIndex ? 'scale(1.2)' : 'scale(1)',
                  }}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            
            <button style={styles.navButton} onClick={nextTestimonial}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Review stats */}
        <ReviewStats activeTestimonial={activeIndex} />

        {/* Video testimonial section */}
        <div style={styles.videoSection}>
          <h3 style={styles.videoSectionTitle}>Видеоотзывы от клиентов</h3>
          <VideoTestimonial />
        </div>

        {/* CTA */}
        <div style={styles.ctaSection}>
          <h3 style={styles.ctaTitle}>Станьте следующей историей успеха</h3>
          <p style={styles.ctaText}>
            Присоединяйтесь к растущему сообществу успешных ресторанов
          </p>
          <div style={styles.ctaButtons}>
            <a href="/#contact" style={styles.ctaPrimary}>
              Получить результат как у них
              <span style={styles.ctaIcon}>🚀</span>
            </a>
            <a href="/#testimonials" style={styles.ctaSecondary}>
              Читать все отзывы
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
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
      radial-gradient(circle at 25% 25%, rgba(52, 211, 153, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 75% 75%, rgba(251, 191, 36, 0.1) 0%, transparent 40%)
    `,
    backgroundSize: '600px 600px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '80px',
  },
  badge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #10B981, #34D399)',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '99px',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
  },
  title: {
    fontSize: '48px',
    fontWeight: 800,
    marginBottom: '24px',
    color: 'var(--text-dark)',
    lineHeight: 1.2,
  },
  gradientText: {
    background: 'linear-gradient(135deg, #10B981, #34D399)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '20px',
    color: 'var(--text-light)',
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  carouselContainer: {
    position: 'relative',
    height: '600px',
    marginBottom: '80px',
    perspective: '1000px',
  },
  carouselWrapper: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testimonialCard: {
    position: 'absolute',
    width: '400px',
    height: '500px',
    background: 'white',
    borderRadius: '32px',
    padding: '32px',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(52, 211, 153, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    transformStyle: 'preserve-3d',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    position: 'relative',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1), rgba(52, 211, 153, 0.2))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    flexShrink: 0,
  },
  avatarEmoji: {
    fontSize: '28px',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-dark)',
    marginBottom: '4px',
  },
  userRole: {
    fontSize: '14px',
    color: 'var(--text-light)',
    marginBottom: '2px',
    margin: 0,
  },
  company: {
    fontSize: '14px',
    color: 'var(--primary-color)',
    fontWeight: 600,
    margin: 0,
  },
  rating: {
    display: 'flex',
    gap: '2px',
  },
  star: {
    fontSize: '16px',
    transition: 'color 0.3s ease',
  },
  quoteContainer: {
    position: 'relative',
    marginBottom: '24px',
  },
  quoteIcon: {
    position: 'absolute',
    top: '-10px',
    left: '-10px',
    fontSize: '40px',
    color: 'rgba(52, 211, 153, 0.2)',
    fontFamily: 'serif',
    lineHeight: 1,
  },
  quoteText: {
    fontSize: '16px',
    lineHeight: 1.6,
    color: 'var(--text-dark)',
    fontStyle: 'italic',
    paddingLeft: '20px',
    margin: 0,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  metricItem: {
    background: 'rgba(52, 211, 153, 0.05)',
    borderRadius: '12px',
    padding: '12px',
    textAlign: 'center',
    border: '1px solid rgba(52, 211, 153, 0.1)',
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: '4px',
  },
  metricLabel: {
    fontSize: '11px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  tag: {
    background: 'rgba(139, 92, 246, 0.1)',
    color: '#8B5CF6',
    padding: '4px 12px',
    borderRadius: '99px',
    fontSize: '12px',
    fontWeight: 600,
    border: '1px solid rgba(139, 92, 246, 0.2)',
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingIcon: {
    position: 'absolute',
    fontSize: '20px',
    animation: 'float 4s ease-in-out infinite',
    opacity: 0.6,
  },
  navigationControls: {
    position: 'absolute',
    bottom: '-60px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'white',
    border: '2px solid rgba(52, 211, 153, 0.2)',
    color: 'var(--primary-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  indicators: {
    display: 'flex',
    gap: '8px',
  },
  indicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  statsContainer: {
    background: 'white',
    borderRadius: '24px',
    padding: '40px',
    marginBottom: '60px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(52, 211, 153, 0.1)',
  },
  statsTitle: {
    fontSize: '28px',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '32px',
    color: 'var(--text-dark)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
  },
  statCard: {
    background: 'rgba(52, 211, 153, 0.05)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    border: '1px solid rgba(52, 211, 153, 0.1)',
    transition: 'transform 0.3s ease',
  },
  statIcon: {
    fontSize: '28px',
    marginBottom: '12px',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 800,
    color: 'var(--primary-color)',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  videoSection: {
    marginBottom: '80px',
  },
  videoSectionTitle: {
    fontSize: '28px',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '32px',
    color: 'var(--text-dark)',
  },
  videoContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  videoFrame: {
    width: '600px',
    height: '360px',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    position: 'relative',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1f2937, #374151)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
  },
  playButton: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(52, 211, 153, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '20px',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    right: '20px',
    color: 'white',
  },
  videoTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '4px',
  },
  videoSubtitle: {
    fontSize: '14px',
    opacity: 0.8,
    margin: 0,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    background: '#000',
    display: 'flex',
    alignItems: 'end',
    padding: '20px',
  },
  videoControls: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    color: 'white',
  },
  pauseButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  progressBar: {
    flex: 1,
    height: '4px',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progress: {
    width: '45%',
    height: '100%',
    background: 'var(--primary-color)',
    borderRadius: '2px',
    animation: 'progress 3s linear infinite',
  },
  timeIndicator: {
    fontSize: '14px',
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
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg); 
      opacity: 0.6;
    }
    33% { 
      transform: translateY(-15px) rotate(2deg); 
      opacity: 0.8;
    }
    66% { 
      transform: translateY(-8px) rotate(-2deg); 
      opacity: 0.4;
    }
  }
  
  @keyframes progress {
    0% { width: 0%; }
    100% { width: 100%; }
  }
  
  .floatingIcon:nth-child(1) {
    top: 15%;
    right: 10%;
    animation-delay: 0s;
  }
  
  .floatingIcon:nth-child(2) {
    top: 60%;
    right: 5%;
    animation-delay: 1.5s;
  }
  
  .floatingIcon:nth-child(3) {
    bottom: 20%;
    right: 15%;
    animation-delay: 3s;
  }
  
  .navButton:hover {
    background: var(--primary-color);
    color: white;
    transform: scale(1.1);
  }
  
  .playButton:hover {
    transform: scale(1.1);
    background: var(--primary-color);
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
  
  .testimonialCard:hover {
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 1024px) {
    .title {
      font-size: 36px !important;
    }
    
    .carouselContainer {
      height: 500px !important;
    }
    
    .testimonialCard {
      width: 350px !important;
      height: 450px !important;
    }
  }
  
  @media (max-width: 768px) {
    .carouselContainer {
      height: 400px !important;
    }
    
    .testimonialCard {
      width: 300px !important;
      height: 380px !important;
      padding: 24px !important;
    }
    
    .videoFrame {
      width: 100% !important;
      height: 250px !important;
    }
    
    .navigationControls {
      position: static !important;
      transform: none !important;
      justify-content: center;
      margin-top: 40px;
    }
    
    .ctaButtons {
      flex-direction: column;
      align-items: center;
    }
    
    .statsGrid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 16px;
    }
    
    .metricsGrid {
      grid-template-columns: 1fr !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('testimonials-animation-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'testimonials-animation-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
}