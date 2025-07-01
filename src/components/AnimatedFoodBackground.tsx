
import { useEffect, useState } from 'react';

export const AnimatedFoodBackground = () => {
  const [foodItems] = useState([
    { emoji: '🥑', id: 1, delay: '0s', duration: '15s' },
    { emoji: '🍎', id: 2, delay: '2s', duration: '18s' },
    { emoji: '🥕', id: 3, delay: '4s', duration: '20s' },
    { emoji: '🥒', id: 4, delay: '1s', duration: '16s' },
    { emoji: '🍌', id: 5, delay: '3s', duration: '17s' },
    { emoji: '🍊', id: 6, delay: '5s', duration: '19s' },
    { emoji: '🥬', id: 7, delay: '6s', duration: '14s' },
    { emoji: '🫐', id: 8, delay: '7s', duration: '21s' },
    { emoji: '🍇', id: 9, delay: '8s', duration: '13s' },
    { emoji: '🥦', id: 10, delay: '9s', duration: '22s' },
    { emoji: '🍓', id: 11, delay: '10s', duration: '15s' },
    { emoji: '🥕', id: 12, delay: '11s', duration: '18s' }
  ]);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      {foodItems.map((item) => (
        <div
          key={item.id}
          className="absolute text-6xl opacity-10 blur-sm animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.emoji}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
          }
          50% {
            transform: translateY(-40px) rotate(180deg);
          }
          75% {
            transform: translateY(-20px) rotate(270deg);
          }
        }
        
        .animate-float {
          animation: float infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
