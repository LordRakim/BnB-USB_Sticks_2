
import React from 'react';
import type { OrderDetails } from '../types';
import { CheckCircleIcon } from './icons';

interface ConfirmationProps {
  details: OrderDetails;
  onReset: () => void;
}

export const Confirmation: React.FC<ConfirmationProps> = ({ details, onReset }) => {
  return (
    <div className="text-center animate-fade-in">
      <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
      <h2 className="mt-4 text-3xl font-extrabold text-slate-800 dark:text-white">Thank You for Your Order!</h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">Your purchase has been confirmed. A confirmation email has been sent to <span className="font-medium text-primary dark:text-secondary">{details.email}</span>.</p>

      <div className="mt-8 text-left bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6 max-w-md mx-auto border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Order Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Name:</span>
            <span className="font-medium">{details.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Shipping Address:</span>
            <span className="font-medium text-right whitespace-pre-wrap">{details.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Quantity:</span>
            <span className="font-medium">{details.quantity} x USB Drive{details.quantity > 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700 mt-3 text-base">
            <span className="text-slate-500 dark:text-slate-400 font-bold">Total Paid:</span>
            <span className="font-bold text-lg">{details.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onReset}
        className="mt-8 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-800"
      >
        Place Another Order
      </button>
    </div>
  );
};
