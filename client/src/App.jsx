import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import Marketplace from './components/Marketplace';
import VehicleDetailsModal from './components/VehicleDetailsModal';
import PurchaseModal from './components/PurchaseModal';
import MyGarage from './components/MyGarage';
import GarageShowcase from './components/GarageShowcase';
import HowItWorks from './components/HowItWorks';
import EmailInboxModal from './components/EmailInboxModal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

import { fetchVehicles, fetchCategories, fetchGarages, fetchRecentEmails } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'garages' | 'how-it-works' | 'my-garage'
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Selection
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState(null);
  const [selectedVehicleForPurchase, setSelectedVehicleForPurchase] = useState(null);

  // Email Inspector & Customer context
  const [isEmailInboxOpen, setIsEmailInboxOpen] = useState(false);
  const [emailCount, setEmailCount] = useState(0);
  const [currentCustomerEmail, setCurrentCustomerEmail] = useState('collector@legendarymotors.vip');

  // Initial Data Fetch
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [vRes, cRes, gRes, eRes] = await Promise.all([
        fetchVehicles(),
        fetchCategories(),
        fetchGarages(),
        fetchRecentEmails()
      ]);

      if (vRes.success) setVehicles(vRes.data);
      if (cRes.success) setCategories(cRes.data);
      if (gRes.success) setGarages(gRes.data);
      if (eRes.success) setEmailCount(eRes.count || 0);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handle Order Completed
  const handleOrderSuccess = (order, buyerEmail) => {
    setCurrentCustomerEmail(buyerEmail);
    setEmailCount(prev => prev + 1);
    // Refresh vehicle stock and garages
    loadInitialData();
  };

  const featuredVehicle = vehicles.find(v => v.isFeatured) || vehicles[0];

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-[#e5e7eb] flex flex-col font-sans selection:bg-[#e50914] selection:text-white">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        emailCount={emailCount}
        onOpenInbox={() => setIsEmailInboxOpen(true)}
        onOpenMyGarage={() => setActiveTab('my-garage')}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <>
            {/* Hero Section */}
            <Hero
              featuredVehicle={featuredVehicle}
              onExploreVehicles={() => {
                const el = document.getElementById('marketplace-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreGarages={() => setActiveTab('garages')}
              onSelectVehicle={(veh) => setSelectedVehicleForDetails(veh)}
            />

            {/* Category Navigation Bar */}
            <CategoryNav
              categories={categories}
              activeCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* Live Inventory Marketplace */}
            <Marketplace
              vehicles={vehicles}
              loading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectVehicle={(veh) => setSelectedVehicleForDetails(veh)}
              onPurchaseVehicle={(veh) => setSelectedVehicleForPurchase(veh)}
            />

            {/* Garage Locations Section on Homepage */}
            <GarageShowcase garages={garages} />

            {/* How It Works Section */}
            <HowItWorks onStartBrowsing={() => {
              const el = document.getElementById('marketplace-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} />
          </>
        )}

        {activeTab === 'garages' && (
          <div className="py-8">
            <GarageShowcase garages={garages} />
          </div>
        )}

        {activeTab === 'how-it-works' && (
          <div className="py-8">
            <HowItWorks onStartBrowsing={() => setActiveTab('marketplace')} />
          </div>
        )}

        {activeTab === 'my-garage' && (
          <MyGarage
            customerEmail={currentCustomerEmail}
            onSwitchEmail={(em) => setCurrentCustomerEmail(em)}
            onBrowseShowroom={() => setActiveTab('marketplace')}
            onInspectVehicle={(veh) => setSelectedVehicleForDetails(veh)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel onRefreshData={loadInitialData} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenInbox={() => setIsEmailInboxOpen(true)}
      />

      {/* Vehicle Details Modal */}
      {selectedVehicleForDetails && (
        <VehicleDetailsModal
          vehicle={selectedVehicleForDetails}
          onClose={() => setSelectedVehicleForDetails(null)}
          onPurchase={(veh) => setSelectedVehicleForPurchase(veh)}
        />
      )}

      {/* Purchase Checkout Wizard Modal */}
      {selectedVehicleForPurchase && (
        <PurchaseModal
          vehicle={selectedVehicleForPurchase}
          garages={garages}
          onClose={() => setSelectedVehicleForPurchase(null)}
          onOrderSuccess={handleOrderSuccess}
          onViewGarage={(buyerEmail) => {
            setCurrentCustomerEmail(buyerEmail);
            setActiveTab('my-garage');
          }}
          onOpenInbox={() => setIsEmailInboxOpen(true)}
        />
      )}

      {/* In-App Automated Dispatched Email Inspector Modal */}
      <EmailInboxModal
        isOpen={isEmailInboxOpen}
        onClose={() => setIsEmailInboxOpen(false)}
      />
    </div>
  );
}
