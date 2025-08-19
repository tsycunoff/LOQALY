import React, { FC, useState, useRef, useEffect } from 'react';

// Enhanced FAQ data with categories and metadata
const faqData = [
  {
    id: 'getting-started-1',
    category: 'Начало работы',
    q: "Как быстро я смогу начать принимать заказы через QR-меню?",
    a: "После регистрации и загрузки меню вы можете сгенерировать QR-код и начать принимать заказы уже через 15-20 минут. Наша команда поддержки готова помочь на каждом шаге настройки.",
    readTime: "2 мин",
    popularity: 95,
    tags: ["QR-меню", "быстрый старт"]
  },
  {
    id: 'getting-started-2',
    category: 'Начало работы',
    q: "Нужно ли устанавливать дополнительное оборудование?",
    a: "Нет, LOQALY работает полностью в облаке. Вам нужен только смартфон или планшет с интернетом. QR-коды можно распечатать на обычном принтере и разместить на столах.",
    readTime: "1 мин",
    popularity: 88,
    tags: ["оборудование", "облако"]
  },
  {
    id: 'integrations-1',
    category: 'Интеграции',
    q: "Как происходит интеграция с моей кассовой системой?",
    a: "Мы предлагаем готовую бесшовную интеграцию с популярными системами: iiko, r_keeper, FrontPad. Настройка занимает 1-2 дня. Это позволяет автоматически получать данные о чеках и гостях для анализа и запуска кампаний.",
    readTime: "3 мин",
    popularity: 92,
    tags: ["интеграция", "POS", "автоматизация"]
  },
  {
    id: 'integrations-2',
    category: 'Интеграции',
    q: "Можно ли интегрироваться с доставочными сервисами?",
    a: "Да! Мы интегрируемся с Яндекс.Еда, Delivery Club, СБЕР Еда и другими популярными платформами. Все заказы будут отображаться в единой панели управления LOQALY.",
    readTime: "2 мин",
    popularity: 79,
    tags: ["доставка", "интеграция", "сервисы"]
  },
  {
    id: 'ai-features-1',
    category: 'AI и аналитика',
    q: "Что такое AI-анализ и как он работает?",
    a: "Наш искусственный интеллект анализирует все отзывы ваших клиентов, определяет тональность (позитив/негатив), выделяет ключевые темы (например, 'долгое обслуживание', 'вкусный кофе', 'чистота в зале') и показывает скрытые проблемы в удобном дашборде.",
    readTime: "4 мин",
    popularity: 96,
    tags: ["AI", "анализ", "отзывы", "аналитика"]
  },
  {
    id: 'ai-features-2',
    category: 'AI и аналитика',
    q: "Какие рекомендации дает AI для улучшения бизнеса?",
    a: "AI анализирует паттерны в данных и предлагает конкретные действия: оптимизацию меню, время проведения акций, персонализацию предложений, улучшение сервиса. Например, может предложить убрать малопопулярное блюдо или запустить кампанию в определенное время.",
    readTime: "3 мин",
    popularity: 84,
    tags: ["AI", "рекомендации", "оптимизация"]
  },
  {
    id: 'feedback-1',
    category: 'Сбор отзывов',
    q: "Как вы собираете обратную связь и измеряете NPS?",
    a: "Мы предлагаем несколько каналов: QR-код на столе для офлайн-гостей, автоматические сообщения в WhatsApp или Telegram после визита. Гость получает короткую анкету с ключевым вопросом: «Какова вероятность, что вы порекомендуете нас друзьям?» — это и есть Net Promoter Score.",
    readTime: "3 мин",
    popularity: 90,
    tags: ["NPS", "обратная связь", "опросы"]
  },
  {
    id: 'feedback-2',
    category: 'Сбор отзывов',
    q: "Что такое «перехват негатива»?",
    a: "Если гость ставит низкую оценку (1-6 по шкале NPS), система не просит оставить отзыв на публичных площадках. Вместо этого предлагает описать проблему в личной форме. Вы получаете ценную обратную связь, а негатив не попадает на Яндекс.Карты или 2ГИС.",
    readTime: "2 мин",
    popularity: 87,
    tags: ["негатив", "репутация", "защита"]
  },
  {
    id: 'campaigns-1',
    category: 'Маркетинг и кампании',
    q: "Как работают триггерные кампании?",
    a: "Система автоматически отслеживает поведение гостей и запускает персональные предложения: поздравления с днем рождения, возвращение после долгого отсутствия, благодарность за положительный отзыв. Все работает без вашего участия 24/7.",
    readTime: "3 мин",
    popularity: 93,
    tags: ["автоматизация", "кампании", "персонализация"]
  },
  {
    id: 'campaigns-2',
    category: 'Маркетинг и кампании',
    q: "Как измерить эффективность маркетинговых кампаний?",
    a: "LOQALY показывает детальную ROI-аналитику каждой кампании: количество отправок, открытий, кликов, конверсий в заказы и итоговую выручку. Вы видите, какие кампании приносят максимальный доход.",
    readTime: "2 мин",
    popularity: 82,
    tags: ["ROI", "эффективность", "аналитика"]
  },
  {
    id: 'pricing-1',
    category: 'Тарифы и оплата',
    q: "Есть ли скрытые комиссии или дополнительные платежи?",
    a: "Нет! Мы работаем по принципу 'все включено'. В стоимость тарифа входят все функции, техподдержка, обновления и даже SMS/WhatsApp рассылки (в разумных лимитах). Никаких скрытых платежей.",
    readTime: "1 мин",
    popularity: 91,
    tags: ["цены", "прозрачность", "комиссии"]
  },
  {
    id: 'pricing-2',
    category: 'Тарифы и оплата',
    q: "Можно ли изменить тариф в процессе использования?",
    a: "Конечно! Вы можете повышать или понижать тариф в любой момент. При повышении доплачиваете пропорционально, при понижении — зачитываем средства на следующий период. Никаких штрафов за смену тарифа.",
    readTime: "2 мин",
    popularity: 76,
    tags: ["тарифы", "гибкость", "изменения"]
  },
  {
    id: 'support-1',
    category: 'Поддержка',
    q: "Какая техническая поддержка предоставляется?",
    a: "Мы работаем 24/7 через чат, email и телефон. Среднее время ответа — менее 2 минут. Также у нас есть база знаний, видео-туториалы и персональные онбординг-сессии для новых клиентов.",
    readTime: "2 мин",
    popularity: 89,
    tags: ["поддержка", "24/7", "помощь"]
  },
  {
    id: 'support-2',
    category: 'Поддержка',
    q: "Предоставляете ли вы обучение для сотрудников?",
    a: "Да! Мы проводим бесплатное обучение вашей команды: групповые вебинары, индивидуальные сессии, создание инструкций под ваши процессы. Цель — чтобы все сотрудники уверенно работали с системой.",
    readTime: "2 мин",
    popularity: 74,
    tags: ["обучение", "команда", "инструкции"]
  }
];

// FAQ categories for filtering
const categories = [
  { id: 'all', name: 'Все вопросы', icon: '📋', count: faqData.length },
  { id: 'Начало работы', name: 'Начало работы', icon: '🚀', count: faqData.filter(item => item.category === 'Начало работы').length },
  { id: 'Интеграции', name: 'Интеграции', icon: '🔌', count: faqData.filter(item => item.category === 'Интеграции').length },
  { id: 'AI и аналитика', name: 'AI и аналитика', icon: '🤖', count: faqData.filter(item => item.category === 'AI и аналитика').length },
  { id: 'Сбор отзывов', name: 'Сбор отзывов', icon: '💬', count: faqData.filter(item => item.category === 'Сбор отзывов').length },
  { id: 'Маркетинг и кампании', name: 'Маркетинг', icon: '🎯', count: faqData.filter(item => item.category === 'Маркетинг и кампании').length },
  { id: 'Тарифы и оплата', name: 'Тарифы', icon: '💳', count: faqData.filter(item => item.category === 'Тарифы и оплата').length },
  { id: 'Поддержка', name: 'Поддержка', icon: '🆘', count: faqData.filter(item => item.category === 'Поддержка').length }
];

// Enhanced FAQ Item Component
const FAQItem: FC<{
  item: typeof faqData[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}> = ({ item, isOpen, onToggle, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      style={{
        ...styles.faqItem,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        borderColor: isOpen ? 'var(--primary-color)' : (isHovered ? 'rgba(52, 211, 153, 0.3)' : 'var(--border-color)'),
        background: isOpen ? 'rgba(52, 211, 153, 0.02)' : 'white'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popularity indicator */}
      <div style={{
        ...styles.popularityBar,
        width: `${item.popularity}%`,
        opacity: isHovered ? 1 : 0.3
      }} />

      <button
        style={styles.faqQuestion}
        onClick={onToggle}
        onFocus={(e) => e.target.blur()} // Remove focus outline
      >
        <div style={styles.questionLeft}>
          <div style={styles.questionNumber}>
            {String(index + 1).padStart(2, '0')}
          </div>
          <div style={styles.questionContent}>
            <span style={styles.questionText}>{item.q}</span>
            <div style={styles.questionMeta}>
              <span style={styles.readTime}>📖 {item.readTime}</span>
              <span style={styles.popularity}>👍 {item.popularity}% полезности</span>
              <div style={styles.tags}>
                {item.tags.slice(0, 2).map(tag => (
                  <span key={tag} style={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.questionRight}>
          <div style={{
            ...styles.expandIcon,
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            background: isOpen ? 'var(--primary-color)' : (isHovered ? 'var(--primary-color)' : 'var(--border-color)')
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </button>

      <div
        style={{
          ...styles.faqAnswer,
          height: contentHeight,
          opacity: isOpen ? 1 : 0
        }}
      >
        <div ref={contentRef} style={styles.answerContent}>
          <p style={styles.answerText}>{item.a}</p>
          
          {/* Helpful actions */}
          <div style={styles.answerActions}>
            <button style={styles.actionButton}>
              <span style={styles.actionIcon}>👍</span>
              Полезно
            </button>
            <button style={styles.actionButton}>
              <span style={styles.actionIcon}>📋</span>
              Копировать
            </button>
            <button style={styles.actionButton}>
              <span style={styles.actionIcon}>💬</span>
              Задать вопрос
            </button>
          </div>

          {/* Related tags */}
          <div style={styles.allTags}>
            {item.tags.map(tag => (
              <span key={tag} style={styles.relatedTag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Search Component
const FAQSearch: FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  resultsCount: number;
}> = ({ searchTerm, onSearchChange, resultsCount }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={styles.searchContainer}>
      <div style={{
        ...styles.searchWrapper,
        borderColor: isFocused ? 'var(--primary-color)' : 'var(--border-color)',
        boxShadow: isFocused ? '0 0 0 3px rgba(52, 211, 153, 0.1)' : 'none'
      }}>
        <div style={styles.searchIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Поиск по вопросам... (например: интеграция, AI, отзывы)"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.searchInput}
        />
        {searchTerm && (
          <button
            style={styles.clearButton}
            onClick={() => onSearchChange('')}
          >
            ✕
          </button>
        )}
      </div>
      
      {searchTerm && (
        <div style={styles.searchResults}>
          Найдено {resultsCount} {resultsCount === 1 ? 'вопрос' : resultsCount < 5 ? 'вопроса' : 'вопросов'}
        </div>
      )}
    </div>
  );
};

// Category Filter
const CategoryFilter: FC<{
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}> = ({ activeCategory, onCategoryChange }) => {
  return (
    <div style={styles.categoryFilter}>
      <div style={styles.categoryList}>
        {categories.map(category => (
          <button
            key={category.id}
            style={{
              ...styles.categoryButton,
              ...(activeCategory === category.id ? styles.activeCategoryButton : {})
            }}
            onClick={() => onCategoryChange(category.id)}
          >
            <span style={styles.categoryIcon}>{category.icon}</span>
            <span style={styles.categoryName}>{category.name}</span>
            <span style={styles.categoryCount}>{category.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Quick Help Widget
const QuickHelp: FC = () => {
  return (
    <div style={styles.quickHelp}>
      <div style={styles.quickHelpHeader}>
        <h3 style={styles.quickHelpTitle}>Не нашли ответ?</h3>
        <p style={styles.quickHelpSubtitle}>Мы всегда готовы помочь</p>
      </div>
      
      <div style={styles.quickHelpActions}>
        <a href="#contact" style={styles.helpAction}>
          <div style={styles.helpActionIcon}>💬</div>
          <div style={styles.helpActionContent}>
            <div style={styles.helpActionTitle}>Написать в поддержку</div>
            <div style={styles.helpActionDesc}>Ответим в течение 2 минут</div>
          </div>
        </a>
        
        <a href="#demo" style={styles.helpAction}>
          <div style={styles.helpActionIcon}>🎥</div>
          <div style={styles.helpActionContent}>
            <div style={styles.helpActionTitle}>Посмотреть демо</div>
            <div style={styles.helpActionDesc}>Живая демонстрация системы</div>
          </div>
        </a>
        
        <a href="#call" style={styles.helpAction}>
          <div style={styles.helpActionIcon}>📞</div>
          <div style={styles.helpActionContent}>
            <div style={styles.helpActionTitle}>Заказать звонок</div>
            <div style={styles.helpActionDesc}>Персональная консультация</div>
          </div>
        </a>
      </div>
    </div>
  );
};

// Main FAQ Component
export const FAQ: FC = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Filter FAQ data based on search and category
  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const expandAll = () => {
    setOpenItems(new Set(filteredFAQ.map(item => item.id)));
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

  return (
    <section 
      id="faq" 
      ref={sectionRef}
      style={{
        ...styles.faqSection,
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
            ❓ Часто задаваемые вопросы
          </div>
          <h2 style={styles.title}>
            Ответы на <span style={styles.gradientText}>все вопросы</span>
          </h2>
          <p style={styles.subtitle}>
            Мы собрали самые популярные вопросы от рестораторов. 
            Если не найдете нужный ответ — всегда можете написать нам напрямую.
          </p>
        </div>

        {/* Search */}
        <FAQSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          resultsCount={filteredFAQ.length}
        />

        {/* Category Filter */}
        <CategoryFilter 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Controls */}
        <div style={styles.controls}>
          <div style={styles.controlsLeft}>
            <span style={styles.resultsText}>
              Показано {filteredFAQ.length} из {faqData.length} вопросов
            </span>
          </div>
          <div style={styles.controlsRight}>
            <button style={styles.controlButton} onClick={expandAll}>
              Развернуть все
            </button>
            <button style={styles.controlButton} onClick={collapseAll}>
              Свернуть все
            </button>
          </div>
        </div>

        {/* FAQ Items */}
        <div style={styles.faqContainer}>
          {filteredFAQ.length === 0 ? (
            <div style={styles.noResults}>
              <div style={styles.noResultsIcon}>🔍</div>
              <h3 style={styles.noResultsTitle}>Ничего не найдено</h3>
              <p style={styles.noResultsText}>
                Попробуйте изменить поисковый запрос или выберите другую категорию
              </p>
              <button 
                style={styles.resetButton}
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            filteredFAQ.map((item, index) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openItems.has(item.id)}
                onToggle={() => toggleItem(item.id)}
                index={index}
              />
            ))
          )}
        </div>

        {/* Quick Help */}
        <QuickHelp />
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  faqSection: {
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
      radial-gradient(circle at 20% 20%, rgba(52, 211, 153, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.05) 0%, transparent 50%)
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
  searchContainer: {
    marginBottom: '40px',
  },
  searchWrapper: {
    position: 'relative',
    maxWidth: '600px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '16px',
    border: '2px solid var(--border-color)',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  searchIcon: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-light)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '20px 60px 20px 60px',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    outline: 'none',
    background: 'transparent',
  },
  clearButton: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'var(--text-light)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResults: {
    textAlign: 'center',
    marginTop: '12px',
    fontSize: '14px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  categoryFilter: {
    marginBottom: '40px',
  },
  categoryList: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'white',
    border: '2px solid var(--border-color)',
    borderRadius: '12px',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontWeight: 600,
    outline: 'none',
  },
  activeCategoryButton: {
    background: 'var(--primary-color)',
    borderColor: 'var(--primary-color)',
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(52, 211, 153, 0.3)',
  },
  categoryIcon: {
    fontSize: '16px',
  },
  categoryName: {
    fontSize: '14px',
  },
  categoryCount: {
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '99px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 700,
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  controlsLeft: {},
  controlsRight: {
    display: 'flex',
    gap: '12px',
  },
  resultsText: {
    fontSize: '14px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  controlButton: {
    background: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-light)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  faqContainer: {
    maxWidth: '900px',
    margin: '0 auto 80px auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  faqItem: {
    background: 'white',
    borderRadius: '16px',
    border: '2px solid var(--border-color)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  },
  popularityBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '3px',
    background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
    transition: 'all 0.3s ease',
    borderRadius: '0 0 3px 0',
  },
  faqQuestion: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  questionLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    flex: 1,
  },
  questionNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'rgba(52, 211, 153, 0.1)',
    color: 'var(--primary-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 700,
    flexShrink: 0,
  },
  questionContent: {
    flex: 1,
  },
  questionText: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-dark)',
    lineHeight: 1.4,
    display: 'block',
    marginBottom: '12px',
  },
  questionMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  readTime: {
    fontSize: '12px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  popularity: {
    fontSize: '12px',
    color: 'var(--text-light)',
    fontWeight: 500,
  },
  tags: {
    display: 'flex',
    gap: '8px',
  },
  tag: {
    background: 'rgba(52, 211, 153, 0.1)',
    color: 'var(--primary-color)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
  },
  questionRight: {
    marginLeft: '20px',
  },
  expandIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    flexShrink: 0,
  },
  faqAnswer: {
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  answerContent: {
    padding: '0 24px 24px 84px',
  },
  answerText: {
    fontSize: '16px',
    lineHeight: 1.7,
    color: 'var(--text-dark)',
    marginBottom: '20px',
  },
  answerActions: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(52, 211, 153, 0.1)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--primary-color)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  actionIcon: {
    fontSize: '14px',
  },
  allTags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  relatedTag: {
    background: 'rgba(0, 0, 0, 0.05)',
    color: 'var(--text-light)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 500,
  },
  noResults: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  noResultsIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  noResultsTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-dark)',
    marginBottom: '12px',
  },
  noResultsText: {
    fontSize: '16px',
    color: 'var(--text-light)',
    marginBottom: '24px',
    maxWidth: '400px',
    margin: '0 auto 24px auto',
  },
  resetButton: {
    background: 'var(--primary-color)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  quickHelp: {
    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
    borderRadius: '24px',
    padding: '48px 40px',
    color: 'white',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
  },
  quickHelpHeader: {
    marginBottom: '32px',
  },
  quickHelpTitle: {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '8px',
  },
  quickHelpSubtitle: {
    fontSize: '16px',
    opacity: 0.9,
  },
  quickHelpActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  helpAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '20px',
    textDecoration: 'none',
    color: 'white',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  helpActionIcon: {
    fontSize: '32px',
    flexShrink: 0,
  },
  helpActionContent: {
    textAlign: 'left',
    flex: 1,
  },
  helpActionTitle: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '4px',
  },
  helpActionDesc: {
    fontSize: '14px',
    opacity: 0.8,
  },
};

// CSS animations
const animationStyles = `
  .controlButton:hover {
    background: rgba(52, 211, 153, 0.1);
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
  
  .categoryButton:hover:not(.activeCategoryButton) {
    background: rgba(52, 211, 153, 0.05);
    border-color: var(--primary-color);
    transform: translateY(-1px);
  }
  
  .activeCategoryButton .categoryCount {
    background: rgba(255, 255, 255, 0.3) !important;
    color: white;
  }
  
  .actionButton:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-1px);
  }
  
  .resetButton:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(52, 211, 153, 0.3);
  }
  
  .helpAction:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  .clearButton:hover {
    background: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    .title {
      font-size: 36px !important;
    }
    
    .categoryList {
      gap: 8px;
    }
    
    .categoryButton {
      padding: 8px 12px !important;
      font-size: 12px !important;
    }
    
    .controls {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    
    .questionLeft {
      flex-direction: column;
      gap: 12px;
    }
    
    .questionNumber {
      align-self: flex-start;
    }
    
    .answerContent {
      padding: 0 24px 24px 24px !important;
    }
    
    .quickHelpActions {
      grid-template-columns: 1fr !important;
    }
    
    .helpAction {
      flex-direction: column;
      text-align: center;
    }
    
    .helpActionContent {
      text-align: center !important;
    }
    
    .searchInput {
      padding: 16px 50px 16px 50px !important;
      font-size: 14px !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('faq-animation-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'faq-animation-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
  }
}