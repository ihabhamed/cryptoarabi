
import React from 'react';
import Navbar from '../components/Navbar';
import AirdropFormSection from '../components/AirdropFormSection';
import AirdropListSection from '../components/AirdropListSection';
import Footer from '../components/Footer';

const Airdrop = () => {
  return (
    <div className="min-h-screen bg-crypto-darkBlue">
      <Navbar />
      <div className="pt-24"> {/* Add padding top to account for fixed navbar */}
        <AirdropFormSection />
        <AirdropListSection />
      </div>
      <Footer />
    </div>
  );
};

export default Airdrop;
