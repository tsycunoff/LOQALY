import React, { FC, useState } from 'react';

export const Contact: FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(email) {
            console.log('Submitted email:', email);
            setSubmitted(true);
        }
    }

    return (
        <section id="contact" className="page-section" style={{ backgroundColor: 'var(--bg-light)' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <h2 className="section-title">Готовы увеличить прибыль?</h2>
                <p className="section-text">
                    Оставьте заявку, и мы проведём для вас персональную демонстрацию возможностей LOQALY.
                </p>
                {submitted ? (
                     <p style={styles.successMessage}>Спасибо! Мы скоро свяжемся с вами.</p>
                ) : (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <input
                            type="email"
                            placeholder="Ваш email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <button type="submit" className="btn btn-primary" style={styles.button}>
                            Получить демо
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    form: {
        marginTop: '32px',
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
    },
    input: {
        padding: '14px 20px',
        fontSize: '16px',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)',
        minWidth: '300px',
        boxShadow: 'var(--shadow-sm)',
    },
    button: {
        padding: '14px 28px',
    },
    successMessage: {
        marginTop: '32px',
        fontSize: '20px',
        fontWeight: 600,
        color: 'var(--primary-dark)',
    }
};
