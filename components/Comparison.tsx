import React, { FC, useState, useRef, useEffect } from 'react';
import { comparisonData } from '../data/content.ts';

// 3D Card component for each competitor
const CompetitorCard: FC<{
  name: string;
  index: number;
  isActive: boolean;
  onClick: () => void;
  score: number;
}> = ({ name, index, isActive, onClick, score }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    if (isActive) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isActive]);

  const getCardColor = (index: number) => {
    const colors = ['#34D399', '#FBBF24', '#8B5CF6'];
    return colors[index] || '#6B7280';
  };

  const getCompetitorIcon = (name: string) => {
    if (name === 'LOQALY') return '🚀';
    if (name.includes('POS')) return '💳';
    if (name.includes('бот')) return '🤖';
    return '🏢';
  };

  return (
    <div
      ref={cardRef}
      style={{
        ...styles.competitorCard,
        borderColor: isActive ? getCardColor(index) : 'transparent',
        background: isActive 
          ? `linear-gradient(135deg, white, ${getCardColor(index)}08)` 
          : 'white',
        transform: isActive ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isActive 
          ? `0 20px 60px ${getCardColor(index)}20` 
          : '0 10px 40px rgba(0, 0, 0, 0.1)',
      }}
      onClick={onClick}
    >
      {/* Floating gradient overlay */}
      {isActive && (
        <div
          style={{
            ...styles.gradientOverlay,
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${getCardColor(index)}15 0%, transparent 50%)`,
          }}
        />
      )}

      <div style={styles.cardHeader}>
        <span style={{...styles.competitorIcon, color: getCardColor(index)}}>
          {getCompetitorIcon(name)}
        </span>
        <h3 style={{...styles.competitorName, color: isActive ? getCardColor(index) : 'var(--text-dark)'}}>
          {name}
        </h3>
      </div>

      <div style={styles.scoreSection}>
        <div style={styles.scoreRing}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="#f1f5f9"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke={getCardColor(index)}
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${score * 2.2} 220`}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dasharray 1s ease',
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%'
              }}
            />
          </svg>
          <div style={styles.scoreText}>
            <span style={{...styles.scoreNumber, color: getCardColor(index)}}>{score}</span>
            <span style={styles.scoreLabel}>из 6</span>
          </div>
        </div>
      </div>

      {index === 0 && (
        <div style={styles.winnerBadge}>
          <span>👑 Лидер</span>
        </div>
      )}
    </div>
  );
};

// Animated feature row
const FeatureRow: FC<{
  feature: string;
  competitors: (boolean | 'partial')[];
  isVisible: boolean;
  delay: number;
}> = ({ feature, competitors, isVisible, delay }) => {
  const [animationTriggered, setAnimationTriggered] = useState(false);

  useEffect(() => {
    if (isVisible && !animationTriggered) {
      setTimeout(() => setAnimationTriggered(true), delay);
    }
  }, [isVisible, animationTriggered, delay]);

  const getIcon = (value: boolean | 'partial', index: number) => {
    const colors = ['#34D399', '#FBBF24', '#8B5CF6'];
    const color = colors[index] || '#6B7280';

    if (value === true) {
      return (
        <div style={{...styles.iconContainer, background: `${color}20`, borderColor: color}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
    
    if (value === 'partial') {
      return (
        <div style={{...styles.iconContainer, background: '#FEF3C7', borderColor: '#F59E0B'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="2"/>
            <path d="M8 12h8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      );
    }

    return (
      <div style={{...styles.iconContainer, background: '#FEE2E2', borderColor: '#EF4444'}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  return (
    <tr
      style={{
        ...styles.tableRow,
        opacity: animationTriggered ? 1 : 0,
        transform: animationTriggered ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.6s ease ${delay}ms`,
      }}
    >
      <td style={styles.featureCell}>
        <div style={styles.featureContent}>
          <span style={styles.featureName}>{feature}</span>
          <div style={styles.featureIndicator} />
        </div>
      </td>
      {competitors.map((competitor, index) => (
        <td key={index} style={styles.competitorCell}>
          {getIcon(competitor, index)}
        </td>
      ))}
    </tr>
  );
};

// Interactive comparison table
const ComparisonTable: FC<{ activeCompetitor: number }> = ({ activeCompetitor }) => {
  const [visibleRows, setVisibleRows] = useState<boolean[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger rows one by one
          comparisonData.rows.forEach((_, index) => {
            setTimeout(() => {
              setVisibleRows(prev => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }, index * 200);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div style={styles.tableContainer}>
      <table ref={tableRef} style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.featureHeader}>Возможность</th>
            {comparisonData.headers.map((header, index) => (
              <th
                key={header}
                style={{
                  ...styles.competitorHeader,
                  background: index === activeCompetitor 
                    ? ['#34D399', '#FBBF24', '#8B5CF6'][index] + '20'
                    : 'transparent',
                  color: index === activeCompetitor 
                    ? ['#34D399', '#FBBF24', '#8B5CF6'][index]
                    : 'var(--text-dark)',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonData.rows.map((row, index) => (
            <FeatureRow
              key={row.feature}
              feature={row.feature}
              competitors={row.competitors}
              isVisible={visibleRows[index] || false}
              delay={index * 100}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Detailed feature breakdown
const FeatureBreakdown: FC<{ activeCompetitor: number }> = ({ activeCompetitor }) => {
  const breakdowns = [
    {
      title: "LOQALY - Полнофункциональная платформа",
      description: "Единая экосистема для управления всеми аспектами взаимодействия с клиентами",
      features: [
        "AI-анализ отзывов с выделением тенденций",
        "Автоматические триггерные кампании",
        "Агрегация всех отзывов из интернета",
        "Интеллектуальный перехват негатива",
        "Бесшовная интеграция с POS-системами",
        "Детальная ROI-аналитика каждой кампании"
      ],
      color: "#34D399",
      pros: ["Все в одном", "AI-powered", "Автоматизация"],
      cons: ["Премиум решение"]
    },
    {
      title: "Стандартная POS - Базовый функционал",
      description: "Основные возможности учета и простая аналитика продаж",
      features: [
        "Базовый учет транзакций",
        "Простые отчеты по продажам",
        "Ограниченная работа с клиентами",
        "Нет AI-анализа",
        "Минимальная автоматизация",
        "Нет работы с отзывами"
      ],
      color: "#FBBF24",
      pros: ["Проверено временем", "Простота"],
      cons: ["Устаревший подход", "Нет автоматизации", "Ограниченная аналитика"]
    },
    {
      title: "Конструктор ботов - Узкая специализация",
      description: "Инструменты для создания чат-ботов и автоматизации переписки",
      features: [
        "Создание простых чат-ботов",
        "Базовые триггерные сообщения",
        "Ограниченная аналитика",
        "Нет интеграции с POS",
        "Нет работы с отзывами",
        "Требует технических знаний"
      ],
      color: "#8B5CF6",
      pros: ["Автоматизация чатов", "Гибкость"],
      cons: ["Узкая специализация", "Сложность настройки", "Нет комплексного подхода"]
    }
  ];

  const currentBreakdown = breakdowns[activeCompetitor];

  return (
    <div style={styles.breakdownContainer}>
      <div 
        style={{
          ...styles.breakdownCard,
          borderColor: currentBreakdown.color,
          background: `linear-gradient(135deg, white, ${currentBreakdown.color}05)`
        }}
      >
        <div style={styles.breakdownHeader}>
          <h3 style={{...styles.breakdownTitle, color: currentBreakdown.color}}>
            {currentBreakdown.title}
          </h3>
          <p style={styles.breakdownDescription}>
            {currentBreakdown.description}
          </p>
        </div>

        <div style={styles.breakdownContent}>
          <div style={styles.featuresSection}>
            <h4 style={styles.sectionTitle}>Ключевые возможности</h4>
            <div style={styles.featuresList}>
              {currentBreakdown.features.map((feature, index) => (
                <div key={index} style={styles.featureItem}>
                  <span style={{...styles.featureBullet, background: currentBreakdown.color}}>
                    {index + 1}
                  </span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.prosConsSection}>
            <div style={styles.prosSection}>
              <h4 style={{...styles.sectionTitle, color: '#10B981'}}>✓ Преимущества</h4>
              {currentBreakdown.pros.map((pro, index) => (
                <div key={index} style={styles.proItem}>
                  <span style={styles.proIcon}>✓</span>
                  <span>{pro}</span>
                </div>
              ))}
            </div>

            <div style={styles.consSection}>
              <h4 style={{...styles.sectionTitle, color: '#EF4444'}}>✗ Ограничения</h4>
              {currentBreakdown.cons.map((con, index) => (
                <div key={index} style={styles.conItem}>
                  <span style={styles.conIcon}>✗</span>
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Comparison component
export const Comparison: FC = () => {
  const [activeCompetitor, setActiveCompetitor] = useState(0);
  const [isTableVisible, setIsTableVisible] = useState(false);

  // Calculate scores for each competitor
  const competitorScores = comparisonData.headers.map((_, headerIndex) => {
    return comparisonData.rows.reduce((score, row) => {
      const value = row.competitors[headerIndex];
      if (value === true) return score + 1;
      if (value === 'partial') return score + 0.5;
      return score;
    }, 0);
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsTableVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section style={styles.section}>
      <div style={styles.backgroundPattern} />
      
      <div className="container">
        <div style={styles.header}>
          <div style={styles.badge}>
            ⚔️ Честное сравнение
          </div>
          <h2 style={styles.title}>
            Сравните <span style={styles.gradientText}>возможности</span>
          </h2>
          <p style={styles.subtitle}>
            Посмотрите, как LOQALY выглядит на фоне стандартных решений для автоматизации и маркетинга
          </p>
        </div>

        {/* Competitor cards */}
        <div style={styles.competitorCards}>
          {comparisonData.headers.map((competitor, index) => (
            <CompetitorCard
              key={competitor}
              name={competitor}
              index={index}
              isActive={activeCompetitor === index}
              onClick={() => setActiveCompetitor(index)}
              score={competitorScores[index]}
            />
          ))}
        </div>

        {/* Interactive comparison table */}
        <ComparisonTable activeCompetitor={activeCompetitor} />

        {/* Detailed breakdown */}
        <FeatureBreakdown activeCompetitor={activeCompetitor} />

        {/* Quick stats */}
        <div style={styles.quickStats}>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>3x</div>
              <div style={styles.statLabel}>Больше возможностей чем у конкурентов</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>100%</div>
              <div style={styles.statLabel}>Покрытие всего цикла работы с клиентами</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>0</div>
              <div style={styles.statLabel}>Дополнительных инструментов не нужно</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={styles.ctaSection}>
          <div style={styles.ctaCard}>
            <h3 style={styles.ctaTitle}>Убедитесь сами в превосходстве LOQALY</h3>
            <p style={styles.ctaText}>
              Получите доступ ко всем функциям на 14 дней и сравните с вашим текущим решением
            </p>
            <div style={styles.ctaButtons}>
              <button style={styles.ctaPrimary}>
                Начать сравнение
                <span style={styles.ctaIcon}>🚀</span>
              </button>
              <button style={styles.ctaSecondary}>
                Заказать демо
              </button>
            </div>
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
    background: 'radial-gradient(circle at 20% 20%, rgba(52, 211, 153, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.03) 0%, transparent 50%)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  badge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #EF4444, #F59E0B)',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '99px',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
  },
  title: {
    fontSize: '48px',
    fontWeight: 800,
    marginBottom: '24px',
    color: 'var(--text-dark)',
    lineHeight: 1.2,
  },
  gradientText: {
    background: 'linear-gradient(135deg, #EF4444, #F59E0B)',
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
  competitorCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '60px',
  },
  competitorCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transformStyle: 'preserve-3d',
    border: '2px solid transparent',
    position: 'relative',
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
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  competitorIcon: {
    fontSize: '32px',
  },
  competitorName: {
    fontSize: '20px',
    fontWeight: 700,
    transition: 'color 0.3s ease',
  },
  scoreSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  scoreRing: {
    position: 'relative',
    width: '80px',
    height: '80px',
  },
  scoreText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  scoreNumber: {
    display: 'block',
    fontSize: '20px',
    fontWeight: 800,
    lineHeight: 1,
  },
  scoreLabel: {
    fontSize: '12px',
    color: 'var(--text-light)',
  },
  winnerBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '99px',
    fontSize: '12px',
    fontWeight: 600,
  },
  tableContainer: {
    background: 'white',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    marginBottom: '60px',
    border: '1px solid rgba(52, 211, 153, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
  },
  featureHeader: {
    padding: '24px 32px',
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-dark)',
    borderBottom: '1px solid #e5e7eb',
  },
  competitorHeader: {
    padding: '24px 32px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 700,
    borderBottom: '1px solid #e5e7eb',
    transition: 'all 0.3s ease',
  },
  tableRow: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.3s ease',
  },
  featureCell: {
    padding: '20px 32px',
  },
  featureContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  featureName: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-dark)',
  },
  featureIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--primary-color)',
    animation: 'pulse 2s infinite',
  },
  competitorCell: {
    padding: '20px 32px',
    textAlign: 'center',
  },
  iconContainer: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    border: '2px solid',
    transition: 'all 0.3s ease',
  },
  breakdownContainer: {
    marginBottom: '60px',
  },
  breakdownCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '40px',
    border: '2px solid',
    transition: 'all 0.6s ease',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
  },
  breakdownHeader: {
    marginBottom: '32px',
  },
  breakdownTitle: {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '12px',
  },
  breakdownDescription: {
    fontSize: '18px',
    color: 'var(--text-light)',
    lineHeight: 1.6,
  },
  breakdownContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '40px',
  },
  featuresSection: {},
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '16px',
    color: 'var(--text-dark)',
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: 'var(--text-dark)',
  },
  featureBullet: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px',
    fontWeight: 600,
    flexShrink: 0,
  },
  prosConsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  prosSection: {},
  consSection: {},
  proItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--text-dark)',
    marginBottom: '8px',
  },
  proIcon: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  conItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--text-dark)',
    marginBottom: '8px',
  },
  conIcon: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  quickStats: {
    background: 'linear-gradient(135deg, white, rgba(52, 211, 153, 0.05))',
    borderRadius: '24px',
    padding: '40px',
    marginBottom: '60px',
    border: '1px solid rgba(52, 211, 153, 0.1)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '32px',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '48px',
    fontWeight: 800,
    color: 'var(--primary-color)',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '16px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  ctaSection: {
    textAlign: 'center',
  },
  ctaCard: {
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
  .tableRow:hover {
    background-color: rgba(52, 211, 153, 0.05);
  }
  
  .iconContainer:hover {
    transform: scale(1.1);
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
    .title {
      font-size: 36px !important;
    }
    
    .competitorCards {
      grid-template-columns: 1fr !important;
    }
    
    .breakdownContent {
      grid-template-columns: 1fr !important;
      gap: 24px;
    }
    
    .ctaButtons {
      flex-direction: column;
      align-items: center;
    }
    
    .statsGrid {
      grid-template-columns: 1fr !important;
      gap: 20px;
    }
    
    .featureHeader,
    .competitorHeader,
    .featureCell,
    .competitorCell {
      padding: 16px !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('comparison-animation-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'comparison-animation-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
}
