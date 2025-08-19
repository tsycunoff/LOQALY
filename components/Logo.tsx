import React, { FC } from 'react';

export const Logo: FC<{ onDark?: boolean }> = ({ onDark = false }) => {
    const primary = onDark ? 'var(--bg-white)' : 'var(--primary-color)';
    const secondary = onDark ? 'var(--bg-white)' : 'var(--text-dark)';

    return (
        <div aria-label="LOQALY Homepage" style={{ textDecoration: 'none', display: 'inline-block', lineHeight: 1 }}>
            <svg height="32" viewBox="0 0 135 32" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <circle cx="16" cy="16" r="15" stroke={primary} strokeWidth="2.5" fill="none"/>
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16 25C16 25 22 19.8333 22 15.5C22 11.1667 19.3137 8 16 8C12.6863 8 10 11.1667 10 15.5C10 19.8333 16 25 16 25ZM16 18.5C17.6569 18.5 19 17.1569 19 15.5C19 13.8431 17.6569 12.5 16 12.5C14.3431 12.5 13 13.8431 13 15.5C13 17.1569 14.3431 18.5 16 18.5Z"
                        fill={secondary}
                    />
                </g>
                <text 
                    x="42" 
                    y="23" 
                    fontFamily="Manrope, sans-serif" 
                    fontSize="22" 
                    fontWeight="800" 
                    fill={secondary}>
                    LOQALY
                </text>
            </svg>
        </div>
    );
};
