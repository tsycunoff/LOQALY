import React, { FC, useEffect } from 'react';
import { featureData } from '../data/content.ts';
import { NotFoundPage } from './NotFoundPage.tsx';

export const FeatureDetailPage: FC<{ featureId: string }> = ({ featureId }) => {
  const feature = featureData.find(f => f.id === featureId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [featureId]);

  if (!feature) {
    return <NotFoundPage />;
  }

  return (
    <div className="fade-in">
      <section className="page-section" style={{paddingTop: '60px', paddingBottom: '60px', background: 'var(--bg-light)'}}>
        <div className="container">
          <h1 className="section-title">{feature.title}</h1>
          <p className="section-text" style={{fontSize: '20px'}}>
            {feature.text}
          </p>
        </div>
      </section>
      <section className="page-section">
        <div className="container" style={{maxWidth: '800px'}}>
          <p style={{fontSize: '18px', lineHeight: 1.8, color: 'var(--text-dark)'}}>
            {feature.longDescription}
          </p>
          {/* Можно добавить изображение или демо фичи */}
        </div>
      </section>
    </div>
  );
};
