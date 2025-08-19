import React, { FC } from 'react';

export const HowItWorks: FC = () => (
     <section id="how-it-works" className="page-section">
        <div className="container" style={{textAlign: 'center'}}>
            <h2 className="section-title">Начать работу — это просто</h2>
            <p className="section-text" >Запустите свой цифровой ресторан всего за 3 шага.</p>
            <div style={styles.featuresGrid}>
                <div style={styles.featureCard}>
                    <div style={styles.featureIcon}>1</div>
                    <h3 style={styles.featureTitle}>Быстрая регистрация</h3>
                    <p style={styles.featureText}>Создайте аккаунт за 5 минут. Никаких сложных договоров и долгого ожидания.</p>
                </div>
                <div style={styles.featureCard}>
                    <div style={styles.featureIcon}>2</div>
                    <h3 style={styles.featureTitle}>Настройка профиля</h3>
                    <p style={styles.featureText}>Загрузите меню, подключите POS (iiko, r_keeper) и соцсети для сбора всех данных в одном месте.</p>
                </div>
                <div style={styles.featureCard}>
                    <div style={styles.featureIcon}>3</div>
                    <h3 style={styles.featureTitle}>Получайте результат</h3>
                    <p style={styles.featureText}>Разместите QR-код и начните собирать отзывы, увеличивать прибыль и возвращать гостей.</p>
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
  featureCard: {
    background: 'var(--bg-white)',
    padding: '32px',
    borderRadius: 'var(--border-radius)',
    textAlign: 'center',
    boxShadow: 'var(--shadow-md)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid var(--border-color)',
  },
  featureIcon: {
      fontSize: '24px',
      fontWeight: 800,
      width: '50px',
      height: '50px',
      lineHeight: '50px',
      borderRadius: '50%',
      backgroundColor: 'var(--primary-color)',
      color: 'var(--bg-white)',
      margin: '0 auto 24px',
  },
  featureTitle: {
      fontSize: '20px',
      fontWeight: 700,
      marginBottom: '8px',
  },
  featureText: {
      color: 'var(--text-light)',
      lineHeight: 1.6,
  },
};
