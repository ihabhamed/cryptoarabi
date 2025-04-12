
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-crypto-darkBlue">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;
