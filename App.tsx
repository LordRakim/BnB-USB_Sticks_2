import React, { useState, useCallback, useEffect } from 'react';
import type { OrderDetails } from './types';
import { OrderForm } from './components/OrderForm';
import { Confirmation } from './components/Confirmation';
import { Header } from './components/Header';
import { LogoUpload } from './components/LogoUpload';

const App: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(() => localStorage.getItem('reunionLogo'));
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const savedDetails = localStorage.getItem('pendingOrderDetails');
      if (savedDetails) {
        try {
          const details: OrderDetails = JSON.parse(savedDetails);
          setOrderDetails(details);
          setOrderConfirmed(true);
          localStorage.removeItem('pendingOrderDetails');
        } catch (error) {
          console.error("Failed to parse order details from localStorage", error);
        }
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('payment') === 'cancelled') {
        // Just clean up the URL for cancelled payments
        window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);


  const handleLogoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      localStorage.setItem('reunionLogo', result);
      setLogo(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleReset = useCallback(() => {
    setOrderConfirmed(false);
    setOrderDetails(null);
    localStorage.removeItem('reunionLogo');
    localStorage.removeItem('pendingOrderDetails');
    setLogo(null);
  }, []);

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300">
      <main className="w-full max-w-4xl mx-auto">
        {!logo ? (
          <LogoUpload onLogoUpload={handleLogoUpload} />
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300">
            <Header logo={logo} />
            <div className="p-6 sm:p-10">
              {orderConfirmed && orderDetails ? (
                <Confirmation details={orderDetails} onReset={handleReset} />
              ) : (
                <OrderForm />
              )}
            </div>
          </div>
        )}
      </main>
      <footer className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} Burnett-Brass Family Reunion Committee</p>
      </footer>
    </div>
  );
};

export default App;