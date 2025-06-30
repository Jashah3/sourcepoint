
import { useEffect, useState } from 'react';

export const DynamicBackground = () => {
  const [gradientIndex, setGradientIndex] = useState(0);

  const gradients = [
    'from-slate-50 via-gray-100 to-slate-200 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900',
    'from-gray-50 via-slate-100 to-gray-200 dark:from-slate-900 dark:via-gray-800 dark:to-gray-900',
    'from-stone-50 via-gray-100 to-stone-200 dark:from-stone-900 dark:via-gray-800 dark:to-stone-900',
    'from-neutral-50 via-gray-100 to-neutral-200 dark:from-neutral-900 dark:via-gray-800 dark:to-neutral-900'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${gradients[gradientIndex]} transition-all duration-[8000ms] ease-in-out`}
      />
      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/10 dark:bg-black/10" />
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-gray-200/20 to-slate-300/20 dark:from-gray-700/20 dark:to-slate-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-slate-200/20 to-gray-300/20 dark:from-slate-700/20 dark:to-gray-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-gradient-to-r from-gray-300/20 to-stone-200/20 dark:from-gray-600/20 dark:to-stone-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
    </div>
  );
};
