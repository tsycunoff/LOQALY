import React, { FC, useEffect } from 'react';
import { Pricing } from '../components/Pricing.tsx';
import { FAQ } from '../components/FAQ.tsx';
import { Contact } from '../components/Contact.tsx';

export const PricingPage: FC = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fade-in">
        <div className="page-section" style={{paddingBottom: 0}}>
             <div className="container" style={{textAlign: 'center'}}>
                <h1 className="section-title">Прозрачные тарифы для вашего бизнеса</h1>
                <p className="section-text">Выберите план, который подходит именно вам. Без скрытых платежей и долгосрочных контрактов.</p>
             </div>
        </div>
        <Pricing isPage={true} />
        <FAQ />
        <Contact />
    </div>
  );
};
