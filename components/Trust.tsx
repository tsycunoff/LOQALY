import React, { FC, useRef, useState, useEffect } from 'react';
import { useCountUp } from '../hooks/useCountUp.ts';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.ts';

// Enhanced animated counter with more visual effects
const AnimatedCounter: FC<{
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon?: string;
  color?: string;
}> = ({ end, duration = 3000, suffix = "", prefix = "", label, icon, color = "var(--primary-color)" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.3 });
  const count = useCountUp(isInView ? end : 0, duration);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const displayValue = Math.round(count).toLocaleString('ru-RU');

  return (
    <div
      ref={ref}
      style={{
        ...styles.metricCard,
        transform: hasAnimated ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        opacity: hasAnimated ? 1 : 0,
      }}
    >
      <div style={styles.metricHeader}>
        {icon && <span style={{...styles.metricIcon, color}}>{icon}</span>}
      </div>
      <div style={{...styles.metricValue, color}}>
        {prefix}{displayValue}{suffix}
      </div>
      <div style={styles.metricLabel}>{label}</div>
    </div>
  );
};

// Interactive world map showing presence
const WorldMap: FC = () => {
  const [activeCity, setActiveCity] = useState<string | null>(null);
  
  const cities = [
    { name: 'Москва', x: 55, y: 35, count: 287, color: '#34D399' },
    { name: 'СПб', x: 53, y: 32, count: 156, color: '#FBBF24' },
    { name: 'Казань', x: 60, y: 40, count: 89, color: '#8B5CF6' },
    { name: 'Екатеринбург', x: 68, y: 38, count: 67, color: '#EF4444' },
    { name: 'Новосибирск', x: 78, y: 42, count: 45, color: '#3B82F6' },
    { name: 'Краснодар', x: 58, y: 50, count: 78, color: '#F59E0B' },
  ];

  return (
    <div style={styles.mapContainer}>
      <h3 style={styles.mapTitle}>География присутствия</h3>
      <div style={styles.mapWrapper}>
        <svg viewBox="0 0 100 60" style={styles.mapSvg}>
          {/* Simplified Russia outline */}
          <path
            d="M10,25 Q15,20 25,22 Q35,18 45,20 Q55,15 65,18 Q75,20 85,25 Q90,30 88,40 Q85,50 75,52 Q65,55 55,53 Q45,55 35,52 Q25,54 15,50 Q8,45 10,35 Z"
            fill="rgba(52, 211, 153, 0.1)"
            stroke="rgba(52, 211, 153, 0.3)"
            strokeWidth="0.5"
          />
          
          {/* Cities */}
          {cities.map((city, index) => (
            <g key={city.name}>
              {/* Pulse animation */}
              <circle
                cx={city.x}
                cy={city.y}
                r="2"
                fill="none"
                stroke={city.color}
                strokeWidth="0.5"
                opacity="0.6"
                style={{
                  animation: `mapPulse 2s infinite ${index * 0.3}s`
                }}
              >
                <animate
                  attributeName="r"
                  values="2;4;2"
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${index * 0.3}s`}
                />
              </circle>
              
              {/* City dot */}
              <circle
                cx={city.x}
                cy={city.y}
                r="1.5"
                fill={city.color}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveCity(city.name)}
                onMouseLeave={() => setActiveCity(null)}
              />
              
              {/* City label */}
              {(activeCity === city.name) && (
                <g>
                  <rect
                    x={city.x - 3}
                    y={city.y - 6}
                    width="6"
                    height="3"
                    fill="white"
                    stroke={city.color}
                    strokeWidth="0.3"
                    rx="0.5"
                  />
                  <text
                    x={city.x}
                    y={city.y - 4}
                    textAnchor="middle"
                    fontSize="1.5"
                    fill={city.color}
                    fontWeight="600"
                  >
                    {city.count}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
        
        {/* City legend */}
        <div style={styles.cityLegend}>
          {cities.map(city => (
            <div
              key={city.name}
              style={{
                ...styles.cityItem,
                opacity: activeCity === city.name || !activeCity ? 1 : 0.5
              }}
              onMouseEnter={() => setActiveCity(city.name)}
              onMouseLeave={() => setActiveCity(null)}
            >
              <div style={{...styles.cityDot, background: city.color}} />
              <span>{city.name}</span>
              <span style={{...styles.cityCount, color: city.color}}>{city.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Real-time activity feed
const ActivityFeed: FC = () => {
  const [activities, setActivities] = useState([
    { id: 1, text: "Новый отзыв в 'Coffee Bean'", time: "2 мин назад", type: "review" },
    { id: 2, text: "Запущена кампания в 'Bistro Plus'", time: "5 мин назад", type: "campaign" },
    { id: 3, text: "Подключен новый ресторан", time: "8 мин назад", type: "connect" },
    { id: 4, text: "AI выявил тренд: 'быстрое обслуживание'", time: "12 мин назад", type: "ai" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        text: [
          "Новый отзыв в случайном ресторане",
          "Сработал триггер 'день рождения'",
          "Повышен рейтинг заведения",
          "Запущена автоматическая кампания"
        ][Math.floor(Math.random() * 4)],
        time: "только что",
        type: ["review", "campaign", "rating", "auto"][Math.floor(Math.random() * 4)]
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 3)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    const icons = {
      review: "💬",
      campaign: "🎯",
      connect: "🔗",
      ai: "🤖",
      rating: "⭐",
      auto: "⚡"
    };
    return icons[type as keyof typeof icons] || "📊";
  };

  return (
    <div style={styles.activityFeed}>
      <h3 style={styles.activityTitle}>Активность в реальном времени</h3>
      <div style={styles.activityList}>
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            style={{
              ...styles.activityItem,
              transform: index === 0 ? 'translateX(0)' : 'translateX(0)',
              opacity: 1 - (index * 0.2),
            }}
          >
            <span style={styles.activityIcon}>{getActivityIcon(activity.type)}</span>
            <div style={styles.activityContent}>
              <div style={styles.activityText}>{activity.text}</div>
              <div style={styles.activityTime}>{activity.time}</div>
            </div>
            <div style={styles.activityPulse} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Interactive testimonial carousel
const TestimonialCarousel: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      name: "Анна Викторова",
      role: "Владелица 'Уютная кофейня'",
      avatar: "👩‍💼",
      text: "LOQALY увеличил наш средний чек на 18% за первый месяц. Система сама находит проблемы и предлагает решения.",
      rating: 5,
      metric: "+18% к чеку",
      color: "#34D399"
    },
    {
      name: "Иван Петров",
      role: "Управляющий 'Гастробар 42'",
      avatar: "👨‍🍳",
      text: "Забыл про Excel-таблицы с отзывами. Теперь вся аналитика в одном месте, а AI показывает что улучшить.",
      rating: 5,
      metric: "4.8★ рейтинг",
      color: "#FBBF24"
    },
    {
      name: "Елена Смирнова",
      role: "Сеть 'Fresh Food'",
      avatar: "👩‍💻",
      text: "Автоматические кампании работают круглосуточно. Клиенты возвращаются чаще, а мы тратим меньше времени на маркетинг.",
      rating: 5,
      metric: "+25% retention",
      color: "#8B5CF6"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div 
      style={styles.testimonialCarousel}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div style={styles.testimonialCard}>
        <div style={styles.testimonialHeader}>
          <div style={styles.avatarContainer}>
            <span style={styles.avatar}>{currentTestimonial.avatar}</span>
            <div style={styles.testimonialInfo}>
              <div style={styles.testimonialName}>{currentTestimonial.name}</div>
              <div style={styles.testimonialRole}>{currentTestimonial.role}</div>
            </div>
          </div>
          <div style={{...styles.testimonialMetric, color: currentTestimonial.color}}>
            {currentTestimonial.metric}
          </div>
        </div>

        <div style={styles.testimonialText}>
          "{currentTestimonial.text}"
        </div>

        <div style={styles.testimonialFooter}>
          <div style={styles.stars}>
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} style={{color: '#FBBF24'}}>★</span>
            ))}
          </div>
          
          <div style={styles.testimonialNav}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                style={{
                  ...styles.navDot,
                  background: index === currentIndex ? currentTestimonial.color : '#e5e7eb'
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tab navigation component
const TabNavigation: FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'metrics', label: 'Метрики' },
    { id: 'geography', label: 'География' },
    { id: 'activity', label: 'Активность' },
    { id: 'testimonials', label: 'Отзывы' }
  ];

  return (
    <div style={styles.tabNavigation}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          style={{
            ...styles.tabButton,
            ...(activeTab === tab.id ? styles.activeTab : {})
          }}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// Main Trust component
export const Trust: FC = () => {
  const [activeTab, setActiveTab] = useState('metrics');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'metrics':
        return (
          <div style={styles.metricsGrid}>
            <AnimatedCounter
              end={254012}
              suffix="+"
              label="Отзывов собрано"
              icon="💬"
              color="#34D399"
            />
            <AnimatedCounter
              end={48}
              label="Городов присутствия"
              icon="🏙️"
              color="#FBBF24"
            />
            <AnimatedCounter
              end={17}
              suffix="%"
              label="Средний рост выручки"
              icon="📈"
              color="#8B5CF6"
            />
            <AnimatedCounter
              end={950}
              prefix=">"
              label="Подключено ресторанов"
              icon="🏪"
              color="#EF4444"
            />
          </div>
        );
      case 'geography':
        return <WorldMap />;
      case 'activity':
        return <ActivityFeed />;
      case 'testimonials':
        return <TestimonialCarousel />;
      default:
        return null;
    }
  };

  return (
    <section style={styles.trustSection}>
      <div style={styles.backgroundOverlay} />
      
      <div className="container">
        <div style={styles.header}>
          <h2 style={styles.title}>Нам доверяют по всей России</h2>
          <p style={styles.subtitle}>
            Более 950 заведений уже используют LOQALY для роста своего бизнеса
          </p>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {renderTabContent()}
        </div>

        {/* Partner logos */}
        <div style={styles.partnersSection}>
          <h3 style={styles.partnersTitle}>Партнеры и интеграции</h3>
          <div style={styles.partnersGrid}>
            {[
              { name: 'iiko', logo: '🍽️' },
              { name: 'r_keeper', logo: '💳' },
              { name: 'FrontPad', logo: '📱' },
              { name: 'Яндекс.Еда', logo: '🛵' },
              { name: 'Delivery Club', logo: '🚚' },
              { name: 'СБЕР', logo: '🏛️' }
            ].map((partner, index) => (
              <div
                key={partner.name}
                style={{
                  ...styles.partnerCard,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <span style={styles.partnerLogo}>{partner.logo}</span>
                <span style={styles.partnerName}>{partner.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div style={styles.socialProof}>
          <div style={styles.proofGrid}>
            <div style={styles.proofItem}>
              <div style={styles.proofNumber}>4.9★</div>
              <div style={styles.proofLabel}>Средняя оценка клиентов</div>
            </div>
            <div style={styles.proofItem}>
              <div style={styles.proofNumber}>99.9%</div>
              <div style={styles.proofLabel}>Время работы системы</div>
            </div>
            <div style={styles.proofItem}>
              <div style={styles.proofNumber}>24/7</div>
              <div style={styles.proofLabel}>Техническая поддержка</div>
            </div>
            <div style={styles.proofItem}>
              <div style={styles.proofNumber}>&lt; 2 мин</div>
              <div style={styles.proofLabel}>Среднее время ответа</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  trustSection: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    position: 'relative',
    overflow: 'hidden',
    padding: '100px 0',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 20%, rgba(52, 211, 153, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)
    `,
    backgroundSize: '600px 600px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  title: {
    fontSize: '42px',
    fontWeight: 800,
    marginBottom: '16px',
    background: 'linear-gradient(135deg, var(--text-dark), var(--primary-dark))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '20px',
    color: 'var(--text-light)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  tabNavigation: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '40px',
    background: 'white',
    padding: '8px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    maxWidth: 'fit-content',
    margin: '0 auto 40px auto',
  },
  tabButton: {
    background: 'transparent',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: 'var(--text-light)',
  },
  activeTab: {
    background: 'var(--primary-color)',
    color: 'white',
    transform: 'scale(1.05)',
  },
  tabContent: {
    marginBottom: '60px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  metricCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'center',
    border: '1px solid rgba(52, 211, 153, 0.1)',
  },
  metricHeader: {
    marginBottom: '16px',
  },
  metricIcon: {
    fontSize: '32px',
  },
  metricValue: {
    fontSize: '36px',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: '8px',
  },
  metricLabel: {
    fontSize: '14px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  mapContainer: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
  },
  mapTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '24px',
    textAlign: 'center',
    color: 'var(--text-dark)',
  },
  mapWrapper: {
    position: 'relative',
  },
  mapSvg: {
    width: '100%',
    height: '300px',
    marginBottom: '24px',
  },
  cityLegend: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
  },
  cityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontWeight: 500,
  },
  cityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  cityCount: {
    marginLeft: 'auto',
    fontWeight: 700,
  },
  testimonialCarousel: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  testimonialCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(52, 211, 153, 0.1)',
  },
  testimonialHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    fontSize: '48px',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(52, 211, 153, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testimonialInfo: {},
  testimonialName: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-dark)',
  },
  testimonialRole: {
    fontSize: '14px',
    color: 'var(--text-light)',
  },
  testimonialMetric: {
    fontSize: '18px',
    fontWeight: 800,
    padding: '8px 16px',
    borderRadius: '99px',
    background: 'rgba(52, 211, 153, 0.1)',
  },
  testimonialText: {
    fontSize: '20px',
    lineHeight: 1.6,
    fontStyle: 'italic',
    color: 'var(--text-dark)',
    marginBottom: '24px',
  },
  testimonialFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stars: {
    fontSize: '18px',
  },
  testimonialNav: {
    display: 'flex',
    gap: '8px',
  },
  navDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  activityFeed: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
  },
  activityTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '24px',
    color: 'var(--text-dark)',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    borderRadius: '12px',
    background: 'rgba(52, 211, 153, 0.05)',
    border: '1px solid rgba(52, 211, 153, 0.1)',
    transition: 'all 0.6s ease',
    position: 'relative',
  },
  activityIcon: {
    fontSize: '24px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-dark)',
    marginBottom: '4px',
  },
  activityTime: {
    fontSize: '14px',
    color: 'var(--text-light)',
  },
  activityPulse: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--primary-color)',
    animation: 'pulse 2s infinite',
  },
  partnersSection: {
    marginBottom: '60px',
  },
  partnersTitle: {
    fontSize: '24px',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '32px',
    color: 'var(--text-dark)',
  },
  partnersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  partnerCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.3s ease',
    animation: 'slideUp 0.6s ease forwards',
  },
  partnerLogo: {
    fontSize: '24px',
  },
  partnerName: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-dark)',
  },
  socialProof: {
    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
    borderRadius: '24px',
    padding: '48px 32px',
    color: 'white',
  },
  proofGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '32px',
  },
  proofItem: {
    textAlign: 'center',
  },
  proofNumber: {
    fontSize: '32px',
    fontWeight: 800,
    marginBottom: '8px',
  },
  proofLabel: {
    fontSize: '14px',
    opacity: 0.9,
  },
};

// CSS animations
const animationStyles = `
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.1); }
  }
  
  @keyframes mapPulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  
  .partnerCard:hover {
    transform: translateY(-4px);
  }
  
  .metricCard:hover {
    transform: translateY(-8px) scale(1.02);
  }
  
  .testimonialCard {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .cityItem:hover {
    background: rgba(52, 211, 153, 0.1);
  }
  
  @media (max-width: 768px) {
    .title {
      font-size: 32px !important;
    }
    
    .tabNavigation {
      flex-wrap: wrap;
      gap: 4px;
    }
    
    .tabButton {
      padding: 8px 16px !important;
      font-size: 14px !important;
    }
    
    .metricsGrid {
      grid-template-columns: 1fr !important;
      gap: 16px;
    }
    
    .proofGrid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 20px;
    }
    
    .testimonialCard {
      padding: 24px !important;
    }
    
    .testimonialHeader {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .mapSvg {
      height: 200px !important;
    }
    
    .partnersGrid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    
    .activityItem {
      flex-direction: column;
      text-align: center;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('trust-animation-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'trust-animation-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
}