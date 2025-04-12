
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import TestimonialsSection from '../components/TestimonialsSection';
import BlogSection from '../components/BlogSection';
import AirdropSection from '../components/AirdropSection';
import Footer from '../components/Footer';
import { useSiteSettings } from '@/lib/hooks';

const Index = () => {
  const { data: settings, isLoading } = useSiteSettings();
  
  // Get section visibility settings with defaults in case settings are still loading
  const showAboutSection = settings?.show_about_section !== false; // Default to true if undefined
  const showTestimonialsSection = settings?.show_testimonials_section !== false; // Default to true if undefined

  return (
    <div className="min-h-screen bg-crypto-darkBlue">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AirdropSection />
      {showAboutSection && <AboutSection />}
      {showTestimonialsSection && <TestimonialsSection />}
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;
