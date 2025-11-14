import React, { useState, useMemo, ChangeEvent, FormEvent } from 'react';
import type { CustomerInfo, OrderDetails } from '../types';
import { PayPalIcon } from './icons';

const PRICE_PER_DRIVE = 25;
const MAX_QUANTITY = 10;

export const OrderForm: React.FC = () => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    address: '',
    phone: '',
  });
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = useMemo(() => quantity * PRICE_PER_DRIVE, [quantity]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CustomerInfo]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};
    if (!customerInfo.name.trim()) newErrors.name = 'Name is required';
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!customerInfo.address.trim()) newErrors.address = 'Postal address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsProcessing(true);

    const orderDetails: OrderDetails = {
      ...customerInfo,
      quantity,
      totalPrice,
    };

    // Store details for retrieval after returning from PayPal
    localStorage.setItem('pendingOrderDetails', JSON.stringify(orderDetails));

    // Create and submit a hidden form that redirects to PayPal
    const form = document.createElement('form');
    form.action = 'https://www.paypal.com/cgi-bin/webscr';
    form.method = 'post';
    form.target = '_top';
    form.style.display = 'none';

    const params: { [key: string]: string } = {
      cmd: '_xclick',
      business: 'ericflemingbiz@gmail.com',
      item_name: `Burnett-Brass Family Reunion USB Drive (${quantity})`,
      amount: totalPrice.toFixed(2),
      currency_code: 'USD',
      no_shipping: '1', // We've collected the address
      return: `${window.location.origin}${window.location.pathname}?payment=success`,
      cancel_return: `${window.location.origin}${window.location.pathname}?payment=cancelled`,
    };

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Customer Info Section */}
        <div>
          <h2 className="text-xl font-semibold mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">Customer Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Full Name *</label>
              <input type="text" id="name" name="name" value={customerInfo.name} onChange={handleInputChange} className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} required />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Email Address *</label>
              <input type="email" id="email" name="email" value={customerInfo.email} onChange={handleInputChange} className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border ${errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} required />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Postal Address *</label>
              <textarea id="address" name="address" rows={3} value={customerInfo.address} onChange={handleInputChange} className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border ${errors.address ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`} required ></textarea>
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Phone Number (Optional)</label>
              <input type="tel" id="phone" name="phone" value={customerInfo.phone} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
          </div>
        </div>
        
        {/* Order Summary Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6 h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">Order Summary</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Quantity</label>
              <select id="quantity" name="quantity" value={quantity} onChange={handleQuantityChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                {Array.from({ length: MAX_QUANTITY }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num} {num > 1 ? 'Drives' : 'Drive'}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-between items-center text-lg font-medium pt-4 border-t border-slate-200 dark:border-slate-700">
              <span>Total Price:</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-white">{totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
            </div>
          </div>
          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full mt-8 flex items-center justify-center gap-2 bg-[#ffc439] hover:bg-[#f3a505] text-[#003087] font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f3a505] dark:focus:ring-offset-slate-800"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Redirecting to PayPal...
              </>
            ) : (
              <>
                <span>Pay with</span>
                <PayPalIcon className="h-6" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};