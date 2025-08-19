import React, { FC, useState, useMemo } from 'react';

export const RoiCalculator: FC = () => {
  const [avgCheck, setAvgCheck] = useState(1500);
  const [guests, setGuests] = useState(2000);

  const calculatedRevenue = useMemo(() => {
    // Примерная логика: предполагаем, что LOQALY увеличивает LTV на 10% для 20% гостей.
    const affectedGuests = guests * 0.2;
    const ltvIncrease = avgCheck * 0.1;
    const additionalRevenue = affectedGuests * ltvIncrease;
    return Math.round(additionalRevenue);
  }, [avgCheck, guests]);

  return (
    <section className="page-section" style={{ backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <div style={styles.grid}>
          <div style={styles.textContainer}>
            <h2 style={{...styles.title, textAlign: 'left'}}>Сколько вы теряете без LOQALY?</h2>
            <p style={{...styles.text, textAlign: 'left', maxWidth: '450px'}}>
              Рассчитайте примерную дополнительную выручку, которую вы можете получать каждый месяц, эффективно работая с обратной связью и возвращая гостей.
            </p>
          </div>
          <div style={styles.calculator}>
            <div style={styles.inputGroup}>
              <label htmlFor="avgCheck" style={styles.label}>Средний чек, ₽</label>
              <input 
                id="avgCheck"
                type="range" 
                min="500" 
                max="5000" 
                step="100" 
                value={avgCheck} 
                onChange={(e) => setAvgCheck(Number(e.target.value))} 
                style={styles.slider}
              />
              <span style={styles.value}>{avgCheck.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="guests" style={styles.label}>Гостей в месяц</label>
              <input 
                id="guests"
                type="range" 
                min="500" 
                max="10000" 
                step="100" 
                value={guests} 
                onChange={(e) => setGuests(Number(e.target.value))} 
                style={styles.slider}
              />
              <span style={styles.value}>{guests.toLocaleString('ru-RU')}</span>
            </div>
            <div style={styles.result}>
              <p style={styles.resultLabel}>Доп. выручка в месяц:</p>
              <p style={styles.resultValue}>~ {calculatedRevenue.toLocaleString('ru-RU')} ₽</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '64px',
    alignItems: 'center',
  },
  textContainer: {},
  title: {
    fontSize: '36px',
    fontWeight: 800,
    marginBottom: '16px',
    lineHeight: 1.3,
  },
  text: {
    fontSize: '18px',
    color: 'var(--text-light)',
    marginBottom: '24px',
  },
  calculator: {
    background: 'var(--bg-white)',
    borderRadius: 'var(--border-radius)',
    padding: '32px',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--border-color)',
  },
  inputGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontWeight: 600,
    marginBottom: '8px',
  },
  slider: {
    width: '100%',
    cursor: 'pointer',
  },
  value: {
    display: 'block',
    textAlign: 'right',
    fontWeight: 700,
    fontSize: '18px',
    color: 'var(--primary-dark)',
  },
  result: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px dashed var(--border-color)',
    textAlign: 'center',
  },
  resultLabel: {
    fontSize: '16px',
    color: 'var(--text-light)',
  },
  resultValue: {
    fontSize: '42px',
    fontWeight: 800,
    color: 'var(--primary-color)',
  },
};
