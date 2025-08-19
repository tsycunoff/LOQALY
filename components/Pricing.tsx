import React, { FC, useState, useRef, useEffect } from 'react';
import { pricingPlans as originalPlans } from '../data/content.ts';
import { useNav } from '../hooks/useRouter.tsx';

// Enhanced pricing data with better icons and correct prices
const enhancedPlans = originalPlans.map((plan, index) => ({
  ...plan,
  id: plan.name.toLowerCase(),
  subtitle: index === 0 ? 'Для старта' : index === 1 ? 'Самый популярный' : index === 2 ? 'Для роста' : 'Максимум функций',
  originalPrice: index === 0 ? '5900' : index === 1 ? '9900' : index === 2 ? '15900' : '24900',
  discount: index === 0 ? '34%' : index === 1 ? '30%' : index === 2 ? '25%' : '24%',
  color: index === 0 ? '#6B7280' : index === 1 ? '#34D399' : index === 2 ? '#8B5CF6' : '#F59E0B',
  savings: index === 0 ? '2 000 ₽' : index === 1 ? '3 000 ₽' : index === 2 ? '4 000 ₽' : '6 000 ₽',
  bestFor: index === 0 ? 'Небольшие заведения' : index === 1 ? 'Рестораны и кафе' : index === 2 ? 'Средние сети' : 'Крупные сети',
  setupTime: index === 0 ? '15 мин' : index === 1 ? '30 мин' : index === 2 ? '45 мин' : 'Индивидуально',
  maxLocations: index === 0 ? '1 точка' : index === 1 ? '3 точки' : index === 2 ? '10 точек' : 'Без ограничений',
  enhancedFeatures: index === 0 ? [
    { name: 'QR-меню (без заказов)', included: true, icon: 'phone' },
    { name: 'QR-фидбэк', included: true, icon: 'message' },
    { name: 'Сбор NPS и отзывов', included: true, icon: 'star' },
    { name: 'AI-анализ (базовый)', included: true, icon: 'brain' },
    { name: 'Интеграция с POS', included: true, icon: 'link' },
    { name: 'Поддержка email', included: true, icon: 'mail' },
    { name: 'Приём заказов через QR', included: false, icon: 'cart' },
    { name: 'Триггерные кампании', included: false, icon: 'target' }
  ] : index === 1 ? [
    { name: 'Всё из Лайт, плюс:', included: true, icon: 'check', highlight: true },
    { name: 'WhatsApp и Telegram', included: true, icon: 'chat' },
    { name: 'Расширенная аналитика', included: true, icon: 'chart' },
    { name: 'Перехват негатива', included: true, icon: 'shield' },
    { name: 'Стимуляция отзывов', included: true, icon: 'zap' },
    { name: 'Приём заказов через QR', included: true, icon: 'cart' },
    { name: 'Поддержка чат 24/7', included: true, icon: 'support' },
    { name: 'Триггерные кампании', included: false, icon: 'target' }
  ] : index === 2 ? [
    { name: 'Всё из Базового, плюс:', included: true, icon: 'check', highlight: true },
    { name: 'Триггерные кампании', included: true, icon: 'target' },
    { name: 'Campaign Builder', included: true, icon: 'build' },
    { name: 'ROI-аналитика', included: true, icon: 'money' },
    { name: 'Умная сегментация', included: true, icon: 'users' },
    { name: 'A/B тестирование', included: true, icon: 'test' },
    { name: 'Персональный менеджер', included: true, icon: 'user' },
    { name: 'Агрегация отзывов', included: false, icon: 'globe' }
  ] : [
    { name: 'Всё из Про, плюс:', included: true, icon: 'check', highlight: true },
    { name: 'Агрегация внешних отзывов', included: true, icon: 'globe' },
    { name: 'Автоответы из системы', included: true, icon: 'robot' },
    { name: 'Мультиканальные рассылки', included: true, icon: 'broadcast' },
    { name: 'AI-рекомендации', included: true, icon: 'crystal' },
    { name: 'White-label решение', included: true, icon: 'tag' },
    { name: 'API доступ', included: true, icon: 'code' },
    { name: 'Приоритетная поддержка', included: true, icon: 'rocket' }
  ]
}));

// Modern icon component
const FeatureIcon: FC<{ type: string; included: boolean; color?: string }> = ({ type, included, color = '#34D399' }) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    message: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    star: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    brain: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    link: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    cart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />,
    target: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />,
    chat: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    zap: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    support: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5v5M12 16.5v5M4.5 12h5M16.5 12h5" />,
    build: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-4.108.505L7.16 15.18A2 2 0 005.5 13.5v-1.098a8.003 8.003 0 01 14.993-4.024L22 6.602A2 2 0 0120.602 5l-6.138-1.238A5.002 5.002 0 005.5 8.5V12.5a2 2 0 00.74 1.557l1.78 1.423a2 2 0 001.996.095l2.387-.477a6 6 0 013.86-.517l.318-.158a6 6 0 004.108-.505L21.16 13.18A2 2 0 0022.5 11.5V10.102a2 2 0 00-1.572-1.954z" />,
    money: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />,
    test: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
    user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    globe: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />,
    robot: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />,
    broadcast: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />,
    crystal: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    tag: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
    code: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    rocket: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  };

  if (!included) {
    return (
      <div style={{ width: '16px', height: '16px', opacity: 0.3 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div style={{ width: '16px', height: '16px' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        {iconMap[type] || iconMap.check}
      </svg>
    </div>
  );
};

// Billing toggle component
const BillingToggle: FC<{
  isAnnual: boolean;
  onToggle: (isAnnual: boolean) => void;
}> = ({ isAnnual, onToggle }) => {
  return (
    <div style={styles.billingToggle}>
      <span style={{
        ...styles.billingOption,
        opacity: !isAnnual ? 1 : 0.6
      }}>
        Помесячно
      </span>
      
      <div 
        style={styles.toggleSwitch}
        onClick={() => onToggle(!isAnnual)}
      >
        <div style={{
          ...styles.toggleSlider,
          transform: isAnnual ? 'translateX(24px)' : 'translateX(0)'
        }} />
      </div>
      
      <div style={styles.annualOption}>
        <span style={{
          ...styles.billingOption,
          opacity: isAnnual ? 1 : 0.6
        }}>
          Годовая оплата
        </span>
        <span style={styles.savingsBadge}>
          -20% 🎉
        </span>
      </div>
    </div>
  );
};

// Compact pricing card
const PricingCard: FC<{
  plan: typeof enhancedPlans[0];
  isAnnual: boolean;
  index: number;
  onNavigate: (path: string) => void;
}> = ({ plan, isAnnual, index, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Convert string price to number and calculate display price
  const monthlyPrice = parseInt(plan.price.replace(/[^\d]/g, ''));
  const annualPrice = Math.round(monthlyPrice * 12 * 0.8);
  const displayPrice = isAnnual ? Math.round(annualPrice / 12) : monthlyPrice;
  const annualSavings = (monthlyPrice * 12) - annualPrice;

  const handleAction = () => {
    onNavigate('/#contact');
  };

  const getButtonStyle = () => {
    const baseStyle = {
      ...styles.planButton,
      animationDelay: `${index * 0.1}s`
    };

    if (plan.isPopular) {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)`,
        color: 'white',
        boxShadow: `0 4px 15px ${plan.color}40`
      };
    } else if (index === 3) {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #1f2937, #374151)',
        color: 'white',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
      };
    } else {
      return {
        ...baseStyle,
        background: 'white',
        color: 'var(--text-dark)',
        border: '2px solid var(--border-color)'
      };
    }
  };

  return (
    <div
      style={{
        ...styles.planCard,
        ...(plan.isPopular ? styles.popularCard : {}),
        transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        borderColor: plan.isPopular ? plan.color : (isHovered ? plan.color : 'var(--border-color)'),
        background: isHovered ? `linear-gradient(135deg, white, ${plan.color}03)` : 'white'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popular badge */}
      {plan.isPopular && (
        <div style={{
          ...styles.popularBadge,
          background: plan.color
        }}>
          <span style={styles.popularIcon}>👑</span>
          <span>Хит продаж</span>
        </div>
      )}

      {/* Discount badge */}
      {plan.discount && (
        <div style={styles.discountBadge}>
          -{plan.discount}
        </div>
      )}

      {/* Plan header */}
      <div style={styles.planHeader}>
        <h3 style={styles.planName}>{plan.name}</h3>
        <p style={{...styles.planSubtitle, color: plan.color}}>{plan.subtitle}</p>
        
        <div style={styles.planPricing}>
          <div style={styles.priceContainer}>
            <span style={styles.currency}>₽</span>
            <span style={{...styles.price, color: plan.color}}>
              {displayPrice.toLocaleString('ru-RU')}
            </span>
            <span style={styles.period}>{plan.period}</span>
          </div>
          
          {plan.originalPrice && (
            <div style={styles.originalPrice}>
              <span style={styles.strikethrough}>
                ₽{parseInt(plan.originalPrice).toLocaleString('ru-RU')}
              </span>
              <span style={styles.savings}>
                Экономия {plan.savings}
              </span>
            </div>
          )}
          
          {isAnnual && (
            <div style={styles.annualSavings}>
              Годовая экономия: ₽{annualSavings.toLocaleString('ru-RU')}
            </div>
          )}
        </div>
      </div>

      {/* Plan metadata - more compact */}
      <div style={styles.planMeta}>
        <div style={styles.metaItem}>
          <span style={styles.metaLabel}>🎯 {plan.bestFor}</span>
        </div>
        <div style={styles.metaItem}>
          <span style={styles.metaLabel}>⚡ Настройка {plan.setupTime}</span>
        </div>
        <div style={styles.metaItem}>
          <span style={styles.metaLabel}>🏢 {plan.maxLocations}</span>
        </div>
      </div>

      {/* Features list - more compact */}
      <div style={styles.featuresList}>
        {plan.enhancedFeatures.slice(0, 7).map((feature, featureIndex) => (
          <div
            key={featureIndex}
            style={{
              ...styles.featureItem,
              opacity: feature.included ? 1 : 0.4,
              background: feature.highlight ? `${plan.color}08` : 'transparent'
            }}
          >
            <FeatureIcon 
              type={feature.icon} 
              included={feature.included} 
              color={plan.color}
            />
            <span style={{
              ...styles.featureText,
              fontWeight: feature.highlight ? 600 : 400,
              color: feature.included ? 'var(--text-dark)' : 'var(--text-light)'
            }}>
              {feature.name}
            </span>
          </div>
        ))}
        
        {plan.enhancedFeatures.length > 7 && (
          <div style={styles.moreFeatures}>
            +{plan.enhancedFeatures.length - 7} функций
          </div>
        )}
      </div>

      {/* CTA Button */}
      <button
        style={getButtonStyle()}
        onClick={handleAction}
        className="pricing-cta"
      >
        <span style={styles.buttonText}>{plan.buttonText}</span>
        <div style={styles.buttonIcon}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Trial info */}
      <div style={styles.trialInfo}>
        <span style={styles.trialIcon}>🆓</span>
        <span style={styles.trialText}>14 дней бесплатно</span>
      </div>
    </div>
  );
};

// Trust indicators
const TrustIndicators: FC = () => {
  const indicators = [
    { icon: '🔒', text: 'SSL защищено', subtext: 'Банковский уровень' },
    { icon: '💳', text: 'Безопасные платежи', subtext: 'Stripe & Тинькофф' },
    { icon: '📞', text: 'Поддержка 24/7', subtext: 'Ответ за 2 минуты' },
    { icon: '💰', text: 'Возврат средств', subtext: '30 дней гарантии' }
  ];

  return (
    <div style={styles.trustIndicators}>
      {indicators.map((indicator, index) => (
        <div key={index} style={styles.trustItem}>
          <span style={styles.trustIcon}>{indicator.icon}</span>
          <div style={styles.trustContent}>
            <div style={styles.trustText}>{indicator.text}</div>
            <div style={styles.trustSubtext}>{indicator.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Pricing Component
export const Pricing: FC<{ isPage?: boolean }> = ({ isPage = false }) => {
  const navigate = useNav();
  const [isAnnual, setIsAnnual] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
    const hash = path.split('#')[1];
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
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

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="pricing" 
      ref={sectionRef}
      style={{
        ...styles.pricingSection,
        ...(isPage ? {} : { paddingBottom: '60px' }),
        opacity: isVisible ? 1 : 0.8,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
      }}
    >
      {/* Background elements */}
      <div style={styles.backgroundPattern} />
      
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>
            💰 Прозрачные тарифы
          </div>
          <h2 style={styles.title}>
            Выберите <span style={styles.gradientText}>идеальный план</span>
          </h2>
          <p style={styles.subtitle}>
            Начните бесплатно и масштабируйтесь вместе с ростом бизнеса. 
            Все тарифы включают 14-дневный пробный период без ограничений.
          </p>
        </div>

        {/* Billing Toggle */}
        <BillingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />

        {/* Annual promotion */}
        {isAnnual && (
          <div style={styles.annualPromo}>
            <span style={styles.promoIcon}>🎉</span>
            <span style={styles.promoText}>
              Годовая оплата: экономьте до 20% и получите 2 месяца в подарок!
            </span>
          </div>
        )}

        {/* Pricing Cards */}
        <div style={styles.pricingGrid}>
          {enhancedPlans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isAnnual={isAnnual}
              index={index}
              onNavigate={handleNavigate}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <TrustIndicators />

        {/* Enterprise CTA */}
        <div style={styles.enterpriseCta}>
          <div style={styles.enterpriseContent}>
            <div style={styles.enterpriseLeft}>
              <h3 style={styles.enterpriseTitle}>Нужно больше возможностей?</h3>
              <p style={styles.enterpriseText}>
                Мы создаем индивидуальные решения для крупных сетей и франшиз. 
                Специальные условия, дополнительные интеграции, white-label версия.
              </p>
              <div style={styles.enterpriseFeatures}>
                <span style={styles.enterpriseFeature}>🏢 Безлимитные локации</span>
                <span style={styles.enterpriseFeature}>🛠️ Кастомизация под бренд</span>
                <span style={styles.enterpriseFeature}>🤝 Персональный менеджер</span>
              </div>
            </div>
            <div style={styles.enterpriseRight}>
              <button 
                style={styles.enterpriseButton}
                onClick={() => handleNavigate('/#contact')}
              >
                Обсудить условия
                <span style={styles.enterpriseButtonIcon}>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pricingSection: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    padding: '100px 0',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.6s ease',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 25% 25%, rgba(52, 211, 153, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(251, 191, 36, 0.08) 0%, transparent 50%)
    `,
    backgroundSize: '600px 600px',
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
  billingToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '40px',
  },
  billingOption: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-dark)',
    transition: 'opacity 0.3s ease',
  },
  toggleSwitch: {
    width: '48px',
    height: '24px',
    backgroundColor: 'var(--primary-color)',
    borderRadius: '12px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  toggleSlider: {
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    left: '2px',
    transition: 'transform 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  annualOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  savingsBadge: {
    background: 'var(--secondary-color)',
    color: 'var(--text-dark)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 700,
  },
  annualPromo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, var(--secondary-color), #F59E0B)',
    color: 'var(--text-dark)',
    padding: '12px 24px',
    borderRadius: '12px',
    margin: '0 auto 40px auto',
    maxWidth: 'fit-content',
    fontWeight: 600,
    boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)',
  },
  promoIcon: {
    fontSize: '20px',
  },
  promoText: {
    fontSize: '16px',
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '60px',
    alignItems: 'stretch',
  },
  planCard: {
    background: 'white',
    borderRadius: '20px',
    border: '2px solid var(--border-color)',
    padding: '24px',
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: '550px',
  },
  popularCard: {
    transform: 'scale(1.03)',
    zIndex: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '99px',
    fontSize: '12px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  popularIcon: {
    fontSize: '14px',
  },
  discountBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#EF4444',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 700,
  },
  planHeader: {
    marginBottom: '20px',
  },
  planName: {
    fontSize: '22px',
    fontWeight: 800,
    color: 'var(--text-dark)',
    marginBottom: '4px',
  },
  planSubtitle: {
    fontSize: '13px',
    fontWeight: 600,
    opacity: 0.8,
    marginBottom: '16px',
  },
  planPricing: {
    marginBottom: '4px',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '2px',
    marginBottom: '6px',
  },
  currency: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-light)',
  },
  price: {
    fontSize: '32px',
    fontWeight: 800,
    lineHeight: 1,
  },
  period: {
    fontSize: '14px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  originalPrice: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '4px',
  },
  strikethrough: {
    fontSize: '12px',
    color: 'var(--text-light)',
    textDecoration: 'line-through',
  },
  savings: {
    fontSize: '10px',
    background: '#EF4444',
    color: 'white',
    padding: '2px 4px',
    borderRadius: '3px',
    fontWeight: 600,
  },
  annualSavings: {
    fontSize: '11px',
    color: 'var(--primary-color)',
    fontWeight: 600,
  },
  planMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '16px',
    padding: '12px',
    background: 'rgba(52, 211, 153, 0.04)',
    borderRadius: '10px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: '11px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
    flex: 1,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  },
  featureText: {
    fontSize: '13px',
    lineHeight: 1.3,
    flex: 1,
  },
  moreFeatures: {
    fontSize: '12px',
    color: 'var(--text-light)',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '8px',
  },
  planButton: {
    width: '100%',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '12px',
    outline: 'none',
  },
  buttonText: {
    flex: 1,
  },
  buttonIcon: {
    transition: 'transform 0.3s ease',
  },
  trialInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontSize: '11px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  trialIcon: {
    fontSize: '12px',
  },
  trialText: {},
  trustIndicators: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '50px',
    padding: '30px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textAlign: 'center',
    flexDirection: 'column',
  },
  trustIcon: {
    fontSize: '20px',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'rgba(52, 211, 153, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustContent: {
    flex: 1,
  },
  trustText: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--text-dark)',
    marginBottom: '2px',
  },
  trustSubtext: {
    fontSize: '11px',
    color: 'var(--text-light)',
  },
  enterpriseCta: {
    background: 'linear-gradient(135deg, #1f2937, #374151)',
    borderRadius: '20px',
    padding: '40px',
    color: 'white',
  },
  enterpriseContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '32px',
    alignItems: 'center',
  },
  enterpriseLeft: {},
  enterpriseTitle: {
    fontSize: '24px',
    fontWeight: 800,
    marginBottom: '12px',
  },
  enterpriseText: {
    fontSize: '15px',
    lineHeight: 1.6,
    opacity: 0.9,
    marginBottom: '20px',
  },
  enterpriseFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  enterpriseFeature: {
    fontSize: '13px',
    opacity: 0.8,
  },
  enterpriseRight: {
    textAlign: 'center',
  },
  enterpriseButton: {
    background: 'var(--primary-color)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    margin: '0 auto',
    outline: 'none',
  },
  enterpriseButtonIcon: {
    fontSize: '18px',
    transition: 'transform 0.3s ease',
  },
};

// CSS animations
const animationStyles = `
  .pricing-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12) !important;
  }
  
  .pricing-cta:hover .buttonIcon {
    transform: translateX(3px);
  }
  
  .enterpriseButton:hover {
    background: var(--primary-dark) !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(52, 211, 153, 0.3);
  }
  
  .enterpriseButton:hover .enterpriseButtonIcon {
    transform: translateX(3px);
  }
  
  .planCard:hover .popularBadge {
    transform: translateX(-50%) scale(1.05);
  }
  
  .featureItem:hover {
    background: rgba(52, 211, 153, 0.08) !important;
  }
  
  .trustItem:hover .trustIcon {
    background: var(--primary-color) !important;
    color: white;
    transform: scale(1.1);
  }
  
  @media (max-width: 1200px) {
    .pricingGrid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 24px;
    }
    
    .planCard {
      min-height: 580px !important;
    }
  }
  
  @media (max-width: 768px) {
    .title {
      font-size: 36px !important;
    }
    
    .pricingGrid {
      grid-template-columns: 1fr !important;
    }
    
    .popularCard {
      transform: none !important;
    }
    
    .enterpriseContent {
      grid-template-columns: 1fr !important;
      text-align: center;
    }
    
    .trustIndicators {
      grid-template-columns: repeat(2, 1fr) !important;
      padding: 20px !important;
    }
    
    .billingToggle {
      flex-direction: column;
      gap: 12px;
    }
    
    .enterpriseFeatures {
      align-items: center;
    }
    
    .annualPromo {
      text-align: center;
      padding: 16px !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('pricing-animation-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'pricing-animation-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
})