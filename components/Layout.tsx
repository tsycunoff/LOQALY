import React, { FC, ReactNode } from 'react';
import { Header } from './Header.tsx';
import { Footer } from './Footer.tsx';
import { useNav } from '../hooks/useRouter.tsx';

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
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
        <>
            <Header />
            <main>{children}</main>
            <Footer />
            <a href="/#contact" onClick={(e) => handleNav(e, '/#contact')} className="btn btn-primary floating-cta">
                Получить демо
            </a>
        </>
    );
};
