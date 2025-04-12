
import React from 'react';
import Navbar from '../components/Navbar';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen bg-crypto-darkBlue">
      <Navbar />
      <div className="pt-24"> {/* Add padding top to account for fixed navbar */}
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
