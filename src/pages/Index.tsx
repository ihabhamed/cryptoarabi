
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import BlogSection from '../components/BlogSection';
import AirdropSection from '../components/AirdropSection';
import Footer from '../components/Footer';

// Create a client
const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-crypto-darkBlue">
        <Navbar />
        <HeroSection />
        <ServicesSection />
        <AirdropSection />
        <AboutSection />
        <BlogSection />
        <Footer />
      </div>
    </QueryClientProvider>
  );
};

export default Index;
