import React, { FC, useState, useMemo, useRef, useEffect } from 'react';

// Animated progress ring component
const ProgressRing: FC<{ percentage: number; size: number; strokeWidth: number; color: string }> = ({ 
  percentage, size, strokeWidth, color 
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out',
          }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '18px',
        fontWeight: 'bold',
        color: color
      }}>
        {Math.round(animatedPercentage)}%
      </div>
    </div>
  );
};

// Custom slider component
const CustomSlider: FC<{
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  suffix: string;
  color: string;
}> = ({ min, max, step, value, onChange, label, suffix, color }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div style={styles.sliderContainer}>
      <div style={styles.sliderHeader}>
        <label style={styles.sliderLabel}>{label}</label>
        <span style={{ ...styles.sliderValue, color }}>{value.toLocaleString('ru-RU')} {suffix}</span>
      </div>
      <div style={styles.sliderTrack}>
        <div 
          style={{
            ...styles.sliderFill,
            width: `${percentage}%`,
            background: color
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={styles.sliderInput}
        />
      </div>
    </div>
  );
};

// Impact card component
const ImpactCard: FC<{ 
  icon: string; 
  title: string; 
  value: string; 
  subtitle: string; 
  color: string;
  delay: number;
}> = ({ icon, title, value, subtitle, color, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref}
      style={{
        ...styles.impactCard,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: isVisible ? 1 : 0,
        borderLeft: `4px solid ${color}`
      }}
    >
      <div style={{ ...styles.impactIcon, color }}>{icon}</div>
      <div>
        <h4 style={styles.impactTitle}>{title}</h4>
        <div style={{ ...styles.impactValue, color }}>{value}</div>
        <p style={styles.impactSubtitle}>{subtitle}</p>
      </div>
    </div>
  );
};

export const RoiCalculator: FC = () => {
  const [avgCheck, setAvgCheck] = useState(1500);
  const [guests, setGuests] = useState(2000);
  const [currentRating, setCurrentRating] = useState(4.2);
  const [businessType, setBusinessType] = useState('restaurant');
  const [isCalculating, setIsCalculating] = useState(false);

  const calculations = useMemo(() => {
    // More sophisticated ROI calculation based on real metrics
    const monthlyRevenue = avgCheck * guests;
    
    // Base improvements from LOQALY
    const reviewIncrease = 0.25; // 25% more reviews
    const npsImprovement = 0.15; // 15% better NPS
    const retentionBoost = 0.18; // 18% better retention
    const averageCheckIncrease = 0.12; // 12% higher average check
    
    // Calculate impacts
    const additionalReviews = Math.round(guests * reviewIncrease * 0.3); // 30% leave reviews
    const improvedRating = Math.min(5, currentRating + 0.3);
    const newCustomersFromReviews = Math.round(additionalReviews * 2.5); // Each review brings 2.5 new customers
    
    const retainedCustomers = Math.round(guests * retentionBoost);
    const avgCheckBonus = Math.round(avgCheck * averageCheckIncrease);
    
    const additionalRevenue = 
      (newCustomersFromReviews * avgCheck) + // New customers
      (retainedCustomers * avgCheck * 1.2) + // Retained customers spend more
      (guests * avgCheckBonus); // Higher average check
    
    const yearlyAdditionalRevenue = additionalRevenue * 12;
    const loqalyCost = 11900 * 12; // Pro plan yearly
    const netProfit = yearlyAdditionalRevenue - loqalyCost;
    const roi = ((netProfit / loqalyCost) * 100);
    
    return {
      monthlyRevenue,
      additionalRevenue,
      yearlyAdditionalRevenue,
      netProfit,
      roi: Math.max(0, roi),
      additionalReviews,
      improvedRating,
      newCustomersFromReviews,
      retainedCustomers,
      avgCheckBonus,
      paybackPeriod: Math.ceil(loqalyCost / additionalRevenue) // months to payback
    };
  }, [avgCheck, guests, currentRating, businessType]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 1500);
  };

  useEffect(() => {
    handleCalculate();
  }, [avgCheck, guests, currentRating, businessType]);

  const businessMultipliers = {
    cafe: 0.8,
    restaurant: 1.0,
    fastfood: 1.2,
    delivery: 1.1
  };

  return (
    <section className="page-section" style={styles.section}>
      <div className="container">
        <div style={styles.header}>
          <h2 style={styles.title}>
            Рассчитайте ROI от внедрения LOQALY
          </h2>
          <p style={styles.subtitle}>
            Узнайте, сколько дополнительной прибыли принесет автоматизация работы с отзывами и клиентами
          </p>
        </div>

        <div style={styles.calculatorGrid}>
          {/* Input Section */}
          <div style={styles.inputSection}>
            <div style={styles.inputCard}>
              <h3 style={styles.cardTitle}>Параметры вашего бизнеса</h3>
              
              <div style={styles.businessTypeSelector}>
                <label style={styles.label}>Тип заведения</label>
                <div style={styles.buttonGroup}>
                  {[
                    { key: 'cafe', label: 'Кафе' },
                    { key: 'restaurant', label: 'Ресторан' },
                    { key: 'fastfood', label: 'Фастфуд' },
                    { key: 'delivery', label: 'Доставка' }
                  ].map(type => (
                    <button
                      key={type.key}
                      style={{
                        ...styles.typeButton,
                        ...(businessType === type.key ? styles.typeButtonActive : {})
                      }}
                      onClick={() => setBusinessType(type.key)}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <CustomSlider
                min={300}
                max={5000}
                step={50}
                value={avgCheck}
                onChange={setAvgCheck}
                label="Средний чек"
                suffix="₽"
                color="var(--primary-color)"
              />

              <CustomSlider
                min={500}
                max={15000}
                step={100}
                value={guests}
                onChange={setGuests}
                label="Гостей в месяц"
                suffix=""
                color="var(--secondary-color)"
              />

              <CustomSlider
                min={3.0}
                max={5.0}
                step={0.1}
                value={currentRating}
                onChange={setCurrentRating}
                label="Текущий рейтинг"
                suffix="★"
                color="#FF6B35"
              />
            </div>
          </div>

          {/* Results Section */}
          <div style={styles.resultsSection}>
            <div style={styles.resultCard}>
              <div style={styles.roiHeader}>
                <h3 style={styles.cardTitle}>Прогноз результатов</h3>
                {isCalculating && <div style={styles.loadingSpinner} />}
              </div>

              <div style={styles.mainMetric}>
                <div style={styles.roiContainer}>
                  <ProgressRing 
                    percentage={Math.min(100, calculations.roi / 5)} 
                    size={120}
                    strokeWidth={8}
                    color="var(--primary-color)"
                  />
                </div>
                <div style={styles.roiText}>
                  <div style={styles.roiValue}>
                    {calculations.roi.toFixed(0)}% ROI
                  </div>
                  <div style={styles.roiSubtext}>
                    Окупаемость за {calculations.paybackPeriod} мес.
                  </div>
                </div>
              </div>

              <div style={styles.keyMetrics}>
                <div style={styles.keyMetric}>
                  <span style={styles.metricLabel}>Доп. выручка/мес</span>
                  <span style={styles.metricValue}>
                    {calculations.additionalRevenue.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div style={styles.keyMetric}>
                  <span style={styles.metricLabel}>Прибыль/год</span>
                  <span style={styles.metricValue}>
                    {calculations.netProfit.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div style={styles.keyMetric}>
                  <span style={styles.metricLabel}>Новый рейтинг</span>
                  <span style={styles.metricValue}>
                    {calculations.improvedRating.toFixed(1)} ★
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Cards */}
        <div style={styles.impactGrid}>
          <ImpactCard
            icon="📊"
            title="Больше отзывов"
            value={`+${calculations.additionalReviews}`}
            subtitle="отзывов в месяц"
            color="var(--primary-color)"
            delay={0}
          />
          <ImpactCard
            icon="👥"
            title="Новые клиенты"
            value={`+${calculations.newCustomersFromReviews}`}
            subtitle="через рекомендации"
            color="var(--secondary-color)"
            delay={200}
          />
          <ImpactCard
            icon="🔄"
            title="Удержание"
            value={`+${calculations.retainedCustomers}`}
            subtitle="вернувшихся гостей"
            color="#8B5CF6"
            delay={400}
          />
          <ImpactCard
            icon="💰"
            title="Средний чек"
            value={`+${calculations.avgCheckBonus} ₽`}
            subtitle="за счет рекомендаций"
            color="#EF4444"
            delay={600}
          />
        </div>

        {/* Detailed breakdown */}
        <div style={styles.breakdown}>
          <h3 style={styles.breakdownTitle}>Как формируется результат</h3>
          <div style={styles.breakdownGrid}>
            <div style={styles.breakdownCard}>
              <h4>📈 Рост количества отзывов</h4>
              <p>LOQALY автоматизирует сбор отзывов и увеличивает их количество на 25-30%</p>
            </div>
            <div style={styles.breakdownCard}>
              <h4>⭐ Улучшение рейтинга</h4>
              <p>Перехват негатива и стимуляция позитивных отзывов повышает рейтинг на 0.2-0.5 звезд</p>
            </div>
            <div style={styles.breakdownCard}>
              <h4>🎯 Персонализация</h4>
              <p>AI-анализ и триггерные кампании увеличивают retention на 15-20%</p>
            </div>
            <div style={styles.breakdownCard}>
              <h4>📱 Удобство заказов</h4>
              <p>QR-меню и онлайн-заказы поднимают средний чек на 10-15%</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={styles.ctaSection}>
          <div style={styles.ctaCard}>
            <h3 style={styles.ctaTitle}>Готовы увеличить прибыль?</h3>
            <p style={styles.ctaText}>
              Получите персональную консультацию и узнайте, как LOQALY может помочь именно вашему бизнесу
            </p>
            <div style={styles.ctaButtons}>
              <a href="/#contact" style={styles.ctaPrimary}>
                Получить консультацию
                <span style={styles.ctaIcon}>→</span>
              </a>
              <a href="/pricing" style={styles.ctaSecondary}>
                Смотреть кейсы
              </a>
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
    lineHeight: 1.6,
  },
  calculatorGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    marginBottom: '60px',
    alignItems: 'start',
  },
  inputSection: {},
  inputCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '24px',
    color: 'var(--text-dark)',
  },
  businessTypeSelector: {
    marginBottom: '32px',
  },
  label: {
    display: 'block',
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '12px',
    color: 'var(--text-dark)',
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  typeButton: {
    padding: '12px 16px',
    border: '2px solid var(--border-color)',
    borderRadius: '12px',
    background: 'white',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: 'var(--text-light)',
  },
  typeButtonActive: {
    borderColor: 'var(--primary-color)',
    background: 'var(--primary-color)',
    color: 'white',
    transform: 'scale(1.02)',
  },
  sliderContainer: {
    marginBottom: '28px',
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  sliderLabel: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-dark)',
  },
  sliderValue: {
    fontSize: '18px',
    fontWeight: 700,
  },
  sliderTrack: {
    position: 'relative',
    height: '8px',
    background: '#f1f5f9',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  sliderFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  sliderInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  resultsSection: {},
  resultCard: {
    background: 'linear-gradient(135deg, white, #fafbfc)',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(52, 211, 153, 0.1)',
    position: 'sticky',
    top: '100px',
  },
  roiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #f3f4f6',
    borderTop: '2px solid var(--primary-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  mainMetric: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  roiContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  roiText: {
    textAlign: 'center',
    marginTop: '16px',
  },
  roiValue: {
    fontSize: '20px',
    fontWeight: 800,
    color: 'var(--primary-dark)',
    lineHeight: 1,
  },
  roiSubtext: {
    fontSize: '12px',
    color: 'var(--text-light)',
    marginTop: '4px',
  },
  keyMetrics: {
    display: 'grid',
    gap: '16px',
  },
  keyMetric: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: 'rgba(52, 211, 153, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(52, 211, 153, 0.1)',
  },
  metricLabel: {
    fontSize: '14px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  metricValue: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-dark)',
  },
  impactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '60px',
  },
  impactCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.6s ease',
    border: '1px solid #f1f5f9',
  },
  impactIcon: {
    fontSize: '24px',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'currentColor',
    opacity: 0.1,
  },
  impactTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '4px',
    color: 'var(--text-dark)',
  },
  impactValue: {
    fontSize: '24px',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: '4px',
  },
  impactSubtitle: {
    fontSize: '14px',
    color: 'var(--text-light)',
    margin: 0,
  },
  breakdown: {
    marginBottom: '60px',
  },
  breakdownTitle: {
    fontSize: '32px',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '32px',
    color: 'var(--text-dark)',
  },
  breakdownGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  breakdownCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f1f5f9',
  },
  ctaSection: {
    textAlign: 'center',
  },
  ctaCard: {
    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
    borderRadius: '24px',
    padding: '48px 32px',
    color: 'white',
    maxWidth: '600px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontSize: '28px',
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
    transition: 'transform 0.3s ease',
  },
};

// Custom CSS animations
const animationStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .ctaPrimary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .ctaPrimary:hover .ctaIcon {
    transform: translateX(4px);
  }
  
  .ctaSecondary:hover {
    background: white;
    color: var(--primary-dark);
  }
  
  .impactCard:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    .calculatorGrid {
      grid-template-columns: 1fr !important;
      gap: 24px;
    }
    
    .title {
      font-size: 32px !important;
    }
    
    .buttonGroup {
      grid-template-columns: 1fr !important;
    }
    
    .ctaButtons {
      flex-direction: column;
      align-items: center;
    }
    
    .resultCard {
      position: static !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('roi-calculator-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'roi-calculator-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
}