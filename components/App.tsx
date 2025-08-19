import React, { FC } from 'react';
import { useRouter } from '../hooks/useRouter.tsx';
import { Layout } from './Layout.tsx';
import { HomePage } from '../pages/HomePage.tsx';
import { PricingPage } from '../pages/PricingPage.tsx';
import { FeatureDetailPage } from '../pages/FeatureDetailPage.tsx';
import { NotFoundPage } from '../pages/NotFoundPage.tsx';

export const App: FC = () => {
  const { page, params } = useRouter();

  const renderPage = () => {
    if (page === 'home') {
      return <HomePage />;
    }
    if (page === 'pricing') {
      return <PricingPage />;
    }
    if (page === 'feature' && params.id) {
      return <FeatureDetailPage featureId={params.id} />;
    }
    return <NotFoundPage />;
  };

  return <Layout>{renderPage()}</Layout>;
};
