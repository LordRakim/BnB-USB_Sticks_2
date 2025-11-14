
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons';

interface LogoUploadProps {
  onLogoUpload: (file: File) => void;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({ onLogoUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onLogoUpload(e.target.files[0]);
    }
  };
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onLogoUpload(e.dataTransfer.files[0]);
    }
  }, [onLogoUpload]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 sm:p-12 text-center">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Welcome!</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Please upload the family reunion logo to begin.</p>
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex justify-center items-center w-full px-6 py-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-slate-300 dark:border-slate-600 hover:border-primary/70 dark:hover:border-primary/70 bg-slate-50 dark:bg-slate-700/50'
        }`}
      >
        <div className="text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-primary dark:text-secondary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG, SVG up to 5MB</p>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
        </div>
      </label>
    </div>
  );
};
