import React, { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_ARRAY, THEME_COLOR } from '../constants';
import { Play, RotateCcw, Pause } from 'lucide-react';

const BAR_WIDTH_MULTIPLIER = 8; // Adjust based on visual preference

const Visualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([...INITIAL_ARRAY]);
  const [comparing, setComparing] = useState<number[]>([]); // Indices being compared
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const sortingRef = useRef<boolean>(false);

  const resetArray = () => {
    setArray([...INITIAL_ARRAY]);
    setComparing([]);
    setSortedIndices([]);
    setIsFinished(false);
    setIsSorting(false);
    sortingRef.current = false;
  };

  const bubbleSortStep = async () => {
    const arr = [...array];
    const n = arr.length;
    
    // We can't easily pause a standard loop in React state without complex generators or effects.
    // Implementing a generator-like approach using async/await and timeouts for visualization.
    
    sortingRef.current = true;
    setIsSorting(true);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (!sortingRef.current) return; // Stop if reset

            // Highlight comparing
            setComparing([j, j + 1]);
            await new Promise(r => setTimeout(r, 600));

            if (arr[j] > arr[j + 1]) {
                // Swap
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                setArray([...arr]);
                await new Promise(r => setTimeout(r, 600));
            }
        }
        // Item at n-i-1 is sorted
        setSortedIndices(prev => [...prev, n - i - 1]);
    }

    setComparing([]);
    setIsSorting(false);
    setIsFinished(true);
    sortingRef.current = false;
  };

  // Safe wrapper to call the sort
  const handleSort = () => {
      if(!isSorting && !isFinished) {
          bubbleSortStep();
      }
  };

  useEffect(() => {
      return () => {
          sortingRef.current = false; // Cleanup on unmount
      };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Visualizer</h2>
        <p className="text-gray-600">Watch how larger elements "bubble" to the right.</p>
      </div>

      <div className="w-full max-w-3xl h-64 md:h-96 bg-white rounded-xl shadow-lg border border-gray-200 flex items-end justify-center p-8 gap-2 md:gap-4 relative overflow-hidden">
        {array.map((value, idx) => {
          const isComparing = comparing.includes(idx);
          const isSorted = sortedIndices.includes(idx);
          
          let bgColor = 'bg-gray-400'; // Default
          if (isComparing) bgColor = 'bg-yellow-500';
          if (isSorted) bgColor = 'bg-green-500';
          if (isComparing && array[comparing[0]] > array[comparing[1]] && comparing.includes(idx)) {
               // Comparing and about to swap (if we knew strictly which was which visually, but simple yellow is fine)
               bgColor = 'bg-maroon-500'; 
          }

          return (
            <div
              key={idx}
              className={`flex flex-col items-center transition-all duration-300 ease-in-out`}
              style={{ width: '10%' }}
            >
              <div className="mb-2 font-bold text-gray-700 text-xs md:text-sm">{value}</div>
              <div
                className={`w-full rounded-t-md transition-all duration-300 ${bgColor}`}
                style={{ height: `${value * 3}px` }}
              />
              <div className="mt-2 text-xs text-gray-400 font-mono">{idx}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-4">
        {!isSorting && !isFinished && (
            <button
            onClick={handleSort}
            className="flex items-center gap-2 px-6 py-3 bg-maroon-800 text-white rounded-lg shadow-lg hover:bg-maroon-700 transition-all font-semibold"
            >
            <Play size={20} />
            Start Sorting
            </button>
        )}
        
        {isSorting && (
             <button
             disabled
             className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-semibold"
             >
             <Pause size={20} />
             Sorting...
             </button>
        )}

        <button
          onClick={resetArray}
          className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-50 transition-all font-medium"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>
      
      <div className="mt-6 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span>Unsorted</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Comparing</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-maroon-500 rounded"></div>
              <span>Swapping</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Sorted</span>
          </div>
      </div>
    </div>
  );
};

export default Visualizer;
