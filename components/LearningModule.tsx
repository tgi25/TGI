import React, { useState } from 'react';
import { SLIDES, THEME_COLOR } from '../constants';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const LearningModule: React.FC = () => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  const currentSlide = SLIDES[currentSlideIdx];
  const isFirst = currentSlideIdx === 0;
  const isLast = currentSlideIdx === SLIDES.length - 1;

  const nextSlide = () => {
    if (!isLast) setCurrentSlideIdx(prev => prev + 1);
  };

  const prevSlide = () => {
    if (!isFirst) setCurrentSlideIdx(prev => prev - 1);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-maroon-800" />
          Learning Mode
        </h2>
        <div className="text-sm text-gray-500 font-medium">
          Slide {currentSlideIdx + 1} of {SLIDES.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex-1 flex flex-col border border-gray-100">
        {/* Header */}
        <div className={`${THEME_COLOR} p-6`}>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {currentSlide.title}
          </h3>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="space-y-6">
            {currentSlide.content.map((paragraph, idx) => (
              <p key={idx} className="text-lg text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}

            {currentSlide.bulletPoints.length > 0 && (
              <ul className="space-y-3 mt-4">
                {currentSlide.bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-maroon-600 rounded-full" />
                    <span className="text-gray-700 text-lg">{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
          <button
            onClick={prevSlide}
            disabled={isFirst}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              isFirst
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-maroon-800 hover:bg-maroon-50'
            }`}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div className="flex gap-2">
             {SLIDES.map((_, idx) => (
                 <div 
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentSlideIdx ? 'bg-maroon-800' : 'bg-gray-300'}`}
                 />
             ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={isLast}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              isLast
                ? 'text-gray-400 cursor-not-allowed'
                : 'bg-maroon-800 text-white hover:bg-maroon-700 shadow-md hover:shadow-lg'
            }`}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningModule;
