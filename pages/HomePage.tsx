import React, { FC, useEffect } from 'react';
import { Hero } from '../components/Hero.tsx';
import { Trust } from '../components/Trust.tsx';
import { Features } from '../components/Features.tsx';
import { HowItWorks } from '../components/HowItWorks.tsx';
import { RoiCalculator } from '../components/RoiCalculator.tsx';
import { Comparison } from '../components/Comparison.tsx';
import { Testimonials } from '../components/Testimonials.tsx';
import { Pricing } from '../components/Pricing.tsx';
import { FAQ } from '../components/FAQ.tsx';
import { Contact } from '../components/Contact.tsx';

export const HomePage: FC = () => {
  
  useEffect(() => {
    // If there's a hash, scroll to it on initial load
    const hash = window.location.hash;
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  return (
    <div className="fade-in">
      <Hero />
      <Trust />
      <Features />
      <HowItWorks />
      <RoiCalculator />
      <Comparison />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
    </div>
  );
};
