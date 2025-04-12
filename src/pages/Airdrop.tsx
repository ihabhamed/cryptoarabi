
import React from 'react';
import Navbar from '../components/Navbar';
import AirdropFormSection from '../components/AirdropFormSection';
import AirdropListSection from '../components/AirdropListSection';
import Footer from '../components/Footer';

const Airdrop = () => {
  return (
    <div className="min-h-screen bg-crypto-darkBlue">
      <Navbar />
      <div className="pt-24 pb-16"> {/* Add padding top to account for fixed navbar */}
        <div className="container-custom mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient text-center mb-12">الإيردروبات المتاحة</h1>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 order-1 lg:order-1">
              <AirdropListSection />
            </div>
            <div className="lg:col-span-5 order-2 lg:order-2">
              <AirdropFormSection />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Airdrop;
