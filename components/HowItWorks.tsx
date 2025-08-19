import React, { FC, useState, useRef, useEffect } from 'react';

// Interactive step component with 3D effects
const StepCard: FC<{
  step: {
    number: number;
    title: string;
    description: string;
    details: string[];
    icon: string;
    color: string;
  };
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
  delay: number;
}> = ({ step, isActive, isCompleted, onClick, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

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
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
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

  return (
    <div
      ref={cardRef}
      style={{
        ...styles.stepCard,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
        borderColor: isActive ? step.color : 'transparent',
        background: isActive 
          ? `linear-gradient(135deg, white, ${step.color}08)` 
          : 'white',
        boxShadow: isActive 
          ? `0 20px 60px ${step.color}20` 
          : '0 10px 40px rgba(0, 0, 0, 0.1)',
      }}
      onClick={onClick}
    >
      {/* Floating gradient overlay */}
      {isActive && (
        <div
          style={{
            ...styles.gradientOverlay,
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${step.color}15 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Step number with animation */}
      <div 
        style={{
          ...styles.stepNumber,
          background: isCompleted ? '#10B981' : (isActive ? step.color : '#E5E7EB'),
          color: isCompleted || isActive ? 'white' : '#6B7280',
          transform: isActive ? 'scale(1.2)' : 'scale(1)',
        }}
      >
        {isCompleted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          step.number
        )}
      </div>

      {/* Icon with pulse animation */}
      <div 
        style={{
          ...styles.stepIcon,
          color: step.color,
          transform: isActive ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {step.icon}
      </div>

      <h3 style={{
        ...styles.stepTitle,
        color: isActive ? step.color : 'var(--text-dark)'
      }}>
        {step.title}
      </h3>

      <p style={styles.stepDescription}>
        {step.description}
      </p>

      {/* Expandable details */}
      {isActive && (
        <div style={styles.stepDetails}>
          {step.details.map((detail, index) => (
            <div
              key={index}
              style={{
                ...styles.detailItem,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <span style={{...styles.detailBullet, background: step.color}}>
                {index + 1}
              </span>
              <span>{detail}</span>
            </div>
          ))}
        </div>
      )}

      {/* Progress indicator */}
      <div style={styles.progressIndicator}>
        <div 
          style={{
            ...styles.progressFill,
            width: isActive ? '100%' : isCompleted ? '100%' : '0%',
            background: step.color
          }}
        />
      </div>
    </div>
  );
};

// Animated connection lines between steps
const ConnectionLine: FC<{ 
  isActive: boolean; 
  color: string; 
  direction: 'horizontal' | 'vertical';
  progress: number;
}> = ({ isActive, color, direction, progress }) => {
  return (
    <div 
      style={{
        ...styles.connectionLine,
        ...(direction === 'horizontal' ? styles.horizontalLine : styles.verticalLine)
      }}
    >
      <div 
        style={{
          ...styles.connectionProgress,
          width: direction === 'horizontal' ? `${progress}%` : '100%',
          height: direction === 'vertical' ? `${progress}%` : '100%',
          background: isActive ? color : '#E5E7EB',
        }}
      />
      
      {/* Animated dot */}
      {progress > 0 && (
        <div 
          style={{
            ...styles.animatedDot,
            background: color,
            [direction === 'horizontal' ? 'left' : 'top']: `${Math.min(progress, 95)}%`,
          }}
        />
      )}
    </div>
  );
};

// Interactive demo mockup
const DemoMockup: FC<{ activeStep: number }> = ({ activeStep }) => {
  const mockupContent = [
    {
      title: "Быстрая регистрация",
      screen: (
        <div style={styles.mockupScreen}>
          <div style={styles.formContainer}>
            <div style={styles.inputField}>
              <div style={styles.inputLabel}>Название заведения</div>
              <div style={styles.inputBox}>Моя кофейня</div>
            </div>
            <div style={styles.inputField}>
              <div style={styles.inputLabel}>Email</div>
              <div style={styles.inputBox}>owner@coffee.ru</div>
            </div>
            <div style={styles.submitButton}>Создать аккаунт</div>
          </div>
        </div>
      )
    },
    {
      title: "Настройка профиля",
      screen: (
        <div style={styles.mockupScreen}>
          <div style={styles.dashboardContainer}>
            <div style={styles.uploadArea}>
              <div style={styles.uploadIcon}>📋</div>
              <div>Загрузить меню</div>
            </div>
            <div style={styles.integrationOptions}>
              <div style={styles.integrationItem}>iiko ✓</div>
              <div style={styles.integrationItem}>r_keeper</div>
              <div style={styles.integrationItem}>FrontPad</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Получение результата",
      screen: (
        <div style={styles.mockupScreen}>
          <div style={styles.resultsContainer}>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>+18%</div>
              <div style={styles.metricLabel}>Рост выручки</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>4.8★</div>
              <div style={styles.metricLabel}>Новый рейтинг</div>
            </div>
            <div style={styles.chartArea}>
              <div style={styles.chartBars}>
                <div style={{...styles.chartBar, height: '60%'}} />
                <div style={{...styles.chartBar, height: '75%'}} />
                <div style={{...styles.chartBar, height: '90%'}} />
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div style={styles.demoContainer}>
      <div style={styles.phoneFrame}>
        <div style={styles.phoneHeader}>
          <div style={styles.phoneNotch} />
        </div>
        <div style={styles.phoneContent}>
          <h4 style={styles.mockupTitle}>
            {mockupContent[activeStep]?.title}
          </h4>
          {mockupContent[activeStep]?.screen}
        </div>
      </div>
      
      {/* Floating elements around phone */}
      <div style={styles.floatingElements}>
        <div style={{...styles.floatingIcon, animationDelay: '0s'}}>⚡</div>
        <div style={{...styles.floatingIcon, animationDelay: '1s'}}>🎯</div>
        <div style={{...styles.floatingIcon, animationDelay: '2s'}}>📊</div>
      </div>
    </div>
  );
};

// Timeline progress indicator
const TimelineProgress: FC<{ 
  activeStep: number; 
  totalSteps: number; 
  onStepClick: (step: number) => void;
}> = ({ activeStep, totalSteps, onStepClick }) => {
  return (
    <div style={styles.timeline}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <div key={index} style={styles.timelineItem}>
          <div
            style={{
              ...styles.timelineStep,
              background: index <= activeStep ? '#34D399' : '#E5E7EB',
              transform: index === activeStep ? 'scale(1.2)' : 'scale(1)',
            }}
            onClick={() => onStepClick(index)}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div 
              style={{
                ...styles.timelineConnector,
                background: index < activeStep ? '#34D399' : '#E5E7EB',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Main HowItWorks component
export const HowItWorks: FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [sectionInView, setSectionInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const steps = [
    {
      number: 1,
      title: "Быстрая регистрация",
      description: "Создайте аккаунт за 5 минут. Никаких сложных договоров и долгого ожидания.",
      details: [
        "Заполните базовую информацию о заведении",
        "Выберите тип бизнеса и количество точек",
        "Получите доступ к личному кабинету"
      ],
      icon: "🚀",
      color: "#34D399"
    },
    {
      number: 2,
      title: "Настройка профиля",
      description: "Загрузите меню, подключите POS и настройте интеграции для полной автоматизации.",
      details: [
        "Импортируйте меню или создайте новое",
        "Подключите POS-систему (iiko, r_keeper, FrontPad)",
        "Настройте каналы сбора отзывов"
      ],
      icon: "⚙️",
      color: "#FBBF24"
    },
    {
      number: 3,
      title: "Получайте результат",
      description: "Разместите QR-код и начните собирать отзывы, анализировать данные и увеличивать прибыль.",
      details: [
        "Распечатайте QR-коды для столов",
        "Запустите автоматические кампании",
        "Отслеживайте рост метрик в реальном времени"
      ],
      icon: "📈",
      color: "#8B5CF6"
    }
  ];

  // Intersection observer for triggering animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-progress through steps
  useEffect(() => {
    if (!isAutoPlaying || !sectionInView) return;

    const interval = setInterval(() => {
      setActiveStep(prev => {
        const nextStep = (prev + 1) % steps.length;
        if (nextStep === 0) {
          // Complete cycle, mark all as completed
          setCompletedSteps([0, 1, 2]);
          setTimeout(() => setCompletedSteps([]), 1000);
        }
        return nextStep;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, sectionInView, steps.length]);

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
    setIsAutoPlaying(false);
    
    // Resume auto-play after user interaction
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const connectionProgress = sectionInView ? ((activeStep + 1) / steps.length) * 100 : 0;

  return (
    <section 
      id="how-it-works" 
      ref={sectionRef}
      style={styles.section}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div style={styles.backgroundPattern} />
      
      <div className="container">
        <div style={styles.header}>
          <div style={styles.badge}>
            ⚡ Простой процесс
          </div>
          <h2 style={styles.title}>
            Начать работу — <span style={styles.gradientText}>это просто</span>
          </h2>
          <p style={styles.subtitle}>
            Запустите свой цифровой ресторан всего за 3 шага. 
            Средняя скорость внедрения — 1 день.
          </p>
        </div>

        {/* Timeline progress */}
        <TimelineProgress 
          activeStep={activeStep}
          totalSteps={steps.length}
          onStepClick={handleStepClick}
        />

        <div style={styles.content}>
          {/* Steps grid */}
          <div style={styles.stepsContainer}>
            {steps.map((step, index) => (
              <div key={step.number} style={styles.stepWrapper}>
                <StepCard
                  step={step}
                  isActive={activeStep === index}
                  isCompleted={completedSteps.includes(index)}
                  onClick={() => handleStepClick(index)}
                  delay={index * 200}
                />
                
                {/* Connection lines */}
                {index < steps.length - 1 && (
                  <ConnectionLine
                    isActive={activeStep > index}
                    color={step.color}
                    direction="horizontal"
                    progress={activeStep > index ? 100 : (activeStep === index ? 50 : 0)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Interactive demo */}
          <div style={styles.demoSection}>
            <DemoMockup activeStep={activeStep} />
          </div>
        </div>

        {/* Quick stats */}
        <div style={styles.statsSection}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>⏱️</div>
              <div style={styles.statNumber}>24 часа</div>
              <div style={styles.statLabel}>Среднее время полной настройки</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🎯</div>
              <div style={styles.statNumber}>98%</div>
              <div style={styles.statLabel}>Успешных внедрений с первого раза</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📞</div>
              <div style={styles.statNumber}>24/7</div>
              <div style={styles.statLabel}>Поддержка на каждом этапе</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={styles.ctaSection}>
          <h3 style={styles.ctaTitle}>Готовы начать за 5 минут?</h3>
          <p style={styles.ctaText}>
            Присоединяйтесь к 950+ заведениям, которые уже увеличили прибыль с LOQALY
          </p>
          <div style={styles.ctaButtons}>
            <a href="/#contact" style={styles.ctaPrimary}>
              Начать прямо сейчас
              <span style={styles.ctaIcon}>→</span>
            </a>
            <a href="/#faq" style={styles.ctaSecondary}>
              Задать вопрос
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
      radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
    `,
    backgroundSize: '800px 800px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
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
  timeline: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '60px',
  },
  timelineItem: {
    display: 'flex',
    alignItems: 'center',
  },
  timelineStep: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  timelineConnector: {
    width: '60px',
    height: '4px',
    borderRadius: '2px',
    margin: '0 8px',
    transition: 'background 0.5s ease',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '80px',
    alignItems: 'center',
    marginBottom: '80px',
  },
  stepsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  stepWrapper: {
    position: 'relative',
  },
  stepCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transformStyle: 'preserve-3d',
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
  stepNumber: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
    transition: 'all 0.3s ease',
  },
  stepIcon: {
    fontSize: '32px',
    marginBottom: '16px',
    transition: 'all 0.3s ease',
  },
  stepTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '12px',
    transition: 'color 0.3s ease',
  },
  stepDescription: {
    fontSize: '16px',
    color: 'var(--text-light)',
    lineHeight: 1.6,
    marginBottom: '16px',
  },
  stepDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '16px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: 'var(--text-dark)',
    animation: 'slideInLeft 0.5s ease forwards',
    opacity: 0,
  },
  detailBullet: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '10px',
    fontWeight: 600,
    flexShrink: 0,
  },
  progressIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '0 0 24px 24px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.5s ease',
  },
  connectionLine: {
    position: 'absolute',
    zIndex: 1,
  },
  horizontalLine: {
    top: '50%',
    right: '-20px',
    width: '40px',
    height: '4px',
    transform: 'translateY(-50%)',
  },
  verticalLine: {
    left: '50%',
    bottom: '-20px',
    width: '4px',
    height: '40px',
    transform: 'translateX(-50%)',
  },
  connectionProgress: {
    borderRadius: '2px',
    transition: 'all 0.5s ease',
    position: 'relative',
  },
  animatedDot: {
    position: 'absolute',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    transform: 'translate(-50%, -50%)',
  },
  demoSection: {
    display: 'flex',
    justifyContent: 'center',
  },
  demoContainer: {
    position: 'relative',
  },
  phoneFrame: {
    width: '280px',
    height: '560px',
    background: 'linear-gradient(145deg, #1f2937, #374151)',
    borderRadius: '32px',
    padding: '20px',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)',
    position: 'relative',
  },
  phoneHeader: {
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '16px',
  },
  phoneNotch: {
    width: '100px',
    height: '4px',
    background: '#6B7280',
    borderRadius: '2px',
  },
  phoneContent: {
    width: '100%',
    height: 'calc(100% - 40px)',
    background: 'white',
    borderRadius: '20px',
    padding: '20px',
    overflow: 'hidden',
  },
  mockupTitle: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '20px',
    color: 'var(--text-dark)',
    textAlign: 'center',
  },
  mockupScreen: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  inputLabel: {
    fontSize: '12px',
    color: 'var(--text-light)',
    fontWeight: 600,
  },
  inputBox: {
    padding: '12px',
    border: '2px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '14px',
  },
  submitButton: {
    padding: '16px',
    background: 'var(--primary-color)',
    color: 'white',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 600,
    marginTop: '8px',
  },
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: '100%',
  },
  uploadArea: {
    border: '2px dashed var(--primary-color)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    color: 'var(--primary-color)',
    fontSize: '14px',
    fontWeight: 600,
  },
  uploadIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  integrationOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  integrationItem: {
    padding: '12px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    height: '100%',
  },
  metricCard: {
    background: 'rgba(52, 211, 153, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: '24px',
    fontWeight: 800,
    color: 'var(--primary-color)',
    lineHeight: 1,
  },
  metricLabel: {
    fontSize: '12px',
    color: 'var(--text-light)',
    marginTop: '4px',
  },
  chartArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartBars: {
    display: 'flex',
    alignItems: 'end',
    gap: '8px',
    height: '60px',
  },
  chartBar: {
    width: '16px',
    background: 'var(--primary-color)',
    borderRadius: '2px 2px 0 0',
    animation: 'growUp 1s ease',
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
    fontSize: '24px',
    animation: 'float 6s ease-in-out infinite',
  },
  statsSection: {
    marginBottom: '80px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
  },
  statCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(52, 211, 153, 0.1)',
    transition: 'transform 0.3s ease',
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '16px',
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
    transition: 'transform 0.3s ease',
  },
};

// CSS animations
const animationStyles = `
  @keyframes slideInLeft {
    from { 
      opacity: 0; 
      transform: translateX(-20px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg); 
    }
    33% { 
      transform: translateY(-20px) rotate(3deg); 
    }
    66% { 
      transform: translateY(-10px) rotate(-3deg); 
    }
  }
  
  @keyframes growUp {
    from { 
      height: 0; 
    }
    to { 
      height: var(--target-height, 60%); 
    }
  }
  
  .floatingIcon:nth-child(1) {
    top: 20%;
    left: -30px;
    animation-delay: 0s;
  }
  
  .floatingIcon:nth-child(2) {
    top: 60%;
    right: -30px;
    animation-delay: 2s;
  }
  
  .floatingIcon:nth-child(3) {
    bottom: 20%;
    left: -20px;
    animation-delay: 4s;
  }
  
  .statCard:hover {
    transform: translateY(-4px);
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
  
  .timelineStep:hover {
    transform: scale(1.3) !important;
  }
  
  @media (max-width: 1024px) {
    .content {
      grid-template-columns: 1fr !important;
      gap: 40px;
    }
    
    .title {
      font-size: 36px !important;
    }
  }
  
  @media (max-width: 768px) {
    .stepsContainer {
      gap: 20px !important;
    }
    
    .phoneFrame {
      width: 240px !important;
      height: 480px !important;
    }
    
    .timeline {
      flex-direction: column !important;
      gap: 16px;
    }
    
    .timelineConnector {
      width: 4px !important;
      height: 30px !important;
      margin: 8px 0 !important;
    }
    
    .ctaButtons {
      flex-direction: column;
      align-items: center;
    }
    
    .statsGrid {
      grid-template-columns: 1fr !important;
      gap: 16px;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('how-it-works-animation-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'how-it-works-animation-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
}