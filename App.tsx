import React, { useState } from 'react';
import { AppMode } from './types';
import LearningModule from './components/LearningModule';
import Visualizer from './components/Visualizer';
import Assessment from './components/Assessment';
import { GraduationCap, BarChart2, CheckSquare, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.LEARN);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: AppMode.LEARN, label: 'Learn', icon: GraduationCap },
    { id: AppMode.VISUALIZE, label: 'Visualizer', icon: BarChart2 },
    { id: AppMode.ASSESS, label: 'Assessment', icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-maroon-800 rounded-lg flex items-center justify-center shadow-lg">
                <BarChart2 className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">BubbleSort</h1>
              <span className="text-xs text-gray-500 font-medium">Master Class</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-maroon-50 text-maroon-800 font-semibold shadow-sm ring-1 ring-maroon-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className={`transition-colors ${isActive ? 'text-maroon-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-6">
           <div className="bg-gray-900 rounded-xl p-4 text-white">
               <h4 className="font-bold text-sm mb-1">Pro Tip</h4>
               <p className="text-xs text-gray-400">Remember: Bubble sort is O(N²) which makes it slow for large data sets!</p>
           </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-maroon-800 rounded flex items-center justify-center">
                <BarChart2 className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-gray-900">BubbleSort</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-20 px-6">
          <nav className="space-y-4">
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                <button
                    key={item.id}
                    onClick={() => {
                    setMode(item.id);
                    setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl text-lg font-medium ${
                    mode === item.id ? 'bg-maroon-50 text-maroon-800' : 'text-gray-600'
                    }`}
                >
                    <Icon /> {item.label}
                </button>
                )
            })}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-[calc(100vh-65px)] md:h-screen overflow-hidden">
        <div className="h-full overflow-y-auto">
             {mode === AppMode.LEARN && <LearningModule />}
             {mode === AppMode.VISUALIZE && <Visualizer />}
             {mode === AppMode.ASSESS && <Assessment />}
        </div>
      </main>
    </div>
  );
};

export default App;
