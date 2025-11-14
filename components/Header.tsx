
import React from 'react';

interface HeaderProps {
  logo: string;
}

export const Header: React.FC<HeaderProps> = ({ logo }) => {
  return (
    <header className="bg-slate-50 dark:bg-slate-900/50 p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <img src={logo} alt="Family Reunion Logo" className="h-16 w-16 object-contain rounded-full bg-white p-1 shadow-md" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Burnett-Brass Family Reunion</h1>
          <p className="text-slate-500 dark:text-slate-400">Commemorative Video USB Drive</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-3xl font-extrabold text-primary dark:text-secondary">$25.00</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">per drive</p>
      </div>
    </header>
  );
};
