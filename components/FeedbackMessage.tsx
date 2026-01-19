
import React from 'react';
import type { FeedbackState } from '../types';

interface FeedbackMessageProps {
  feedback: FeedbackState;
  color: string;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ feedback, color }) => {
  return (
    <div className="h-10 flex items-center justify-center">
      <p key={feedback.text + Date.now()} className={`text-2xl md:text-3xl font-bold animate-fade-in-pop ${color}`}>
        {feedback.text}
      </p>
      <style>{`
        @keyframes fade-in-pop {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-pop {
          animation: fade-in-pop 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
      `}</style>
    </div>
  );
};
