import React, { FC } from 'react';
import { useNav } from '../hooks/useRouter.tsx';

export const NotFoundPage: FC = () => {
  const navigate = useNav();

  return (
    <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>404</h1>
      <p style={{ fontSize: '24px', color: 'var(--text-light)', marginBottom: '32px' }}>
        Страница не найдена
      </p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Вернуться на главную
      </button>
    </div>
  );
};
