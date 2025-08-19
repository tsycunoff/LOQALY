import React, { FC } from 'react';

export const Testimonials: FC = () => (
    <section className="page-section" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
             <h2 className="section-title">Что говорят наши партнеры</h2>
            <div style={{...styles.featuresGrid, gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'}}>
                <div style={styles.testimonialCard}>
                    <p style={styles.testimonialText}>"С LOQALY мы смогли запустить доставку на 80% быстрее, чем планировали. Средний чек вырос на 15% за счет удобного онлайн-меню. Это просто маст-хэв для любой кофейни."</p>
                    <div style={styles.testimonialAuthor}>
                        <p style={{fontWeight: 600}}>Анна В.</p>
                        <p style={{color: 'var(--text-light)'}}>Владелица, "Уютная кофейня"</p>
                    </div>
                </div>
                <div style={styles.testimonialCard}>
                    <p style={styles.testimonialText}>"Наконец-то вся аналитика в одном месте! Я вижу, какие блюда популярны, кто мои постоянные клиенты и как работают акции. Раньше на сбор таких отчетов уходила неделя."</p>
                    <div style={styles.testimonialAuthor}>
                        <p style={{fontWeight: 600}}>Иван П.</p>
                        <p style={{color: 'var(--text-light)'}}>Управляющий, "Гастробар 42"</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const styles: { [key: string]: React.CSSProperties } = {
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
    marginTop: '48px',
  },
  testimonialCard: {
    background: 'var(--bg-white)',
    padding: '32px',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: '1px solid var(--border-color)',
    gap: '24px',
  },
  testimonialText: {
    fontSize: '18px',
    fontStyle: 'italic',
    color: 'var(--text-dark)',
    lineHeight: 1.6,
  },
  testimonialAuthor: {
    fontWeight: 600,
    color: 'var(--text-dark)',
    textAlign: 'left',
  },
};
