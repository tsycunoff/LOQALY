import React, { FC } from 'react';
import { pricingPlans } from '../data/content.ts';
import { useNav } from '../hooks/useRouter.tsx';

export const Pricing: FC<{ isPage?: boolean }> = ({ isPage = false }) => {
    const navigate = useNav();

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        navigate(path);
        const hash = path.split('#')[1];
        if (hash) {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    return (
        <section id="pricing" className="page-section" style={isPage ? {} : {paddingBottom: '40px'}}>
            <div className="container" style={{textAlign: 'center'}}>
                <h2 className="section-title">Выберите свой тариф</h2>
                <p className="section-text">Начните бесплатно и растите вместе с нами. Все тарифы включают 14-дневный пробный период.</p>
                <div style={styles.pricingGrid}>
                    {pricingPlans.map(plan => (
                         <div key={plan.name} style={{...styles.pricingCard, ...(plan.isPopular && styles.popularPricingCard)}}>
                            {plan.isPopular && <div style={styles.pricingBadge}>Популярный</div>}
                            <h3 style={styles.pricingTitle}>{plan.name}</h3>
                            <p style={{color: 'var(--text-light)', minHeight: '40px'}}>{plan.description}</p>
                            <div style={styles.pricingPrice}>{plan.price} <span style={styles.pricingPeriod}>{plan.period}</span></div>
                            <ul style={styles.pricingFeatures}>
                                {plan.features.map(feature => (
                                    <li key={feature}>✓ {feature}</li>
                                ))}
                            </ul>
                            <a href="/#contact" onClick={(e) => handleNav(e, '/#contact')} className={plan.isPopular ? 'btn btn-primary' : 'btn btn-secondary'} style={{width: '100%', marginTop: 'auto'}}>{plan.buttonText}</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginTop: '48px',
    alignItems: 'stretch',
  },
  pricingCard: {
      background: 'var(--bg-white)',
      padding: '24px',
      borderRadius: 'var(--border-radius)',
      textAlign: 'left',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      position: 'relative',
  },
  popularPricingCard: {
    border: '2px solid var(--primary-color)',
    transform: 'scale(1.05)',
  },
  pricingBadge: {
      position: 'absolute',
      top: '-15px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--primary-color)',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '99px',
      fontSize: '12px',
      fontWeight: 600,
  },
  pricingTitle: {
      fontSize: '22px',
      fontWeight: 700,
  },
  pricingPrice: {
      fontSize: '32px',
      fontWeight: 800,
  },
  pricingPeriod: {
      fontSize: '16px',
      fontWeight: 600,
      color: 'var(--text-light)',
  },
  pricingFeatures: {
      listStyle: 'none',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      textAlign: 'left',
      fontSize: '14px',
      color: 'var(--text-light)',
      flexGrow: 1,
  },
};
