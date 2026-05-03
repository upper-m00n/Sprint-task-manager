import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Palette } from 'lucide-react';

const ThemeSwitcher = () => {
  const { mode, toggleTheme, accent, setAccent } = useTheme();

  const accents = [
    { id: 'blue', color: 'bg-blue-500' },
    { id: 'purple', color: 'bg-purple-500' },
    { id: 'green', color: 'bg-green-500' },
  ];

  return (
    <div className="flex items-center gap-4">
      {/* Accent Colors */}
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full">
        {accents.map((item) => (
          <button
            key={item.id}
            onClick={() => setAccent(item.id)}
            className={`w-5 h-5 rounded-full transition-transform ${item.color} ${
              accent === item.id ? 'scale-125 ring-2 ring-offset-2 ring-primary dark:ring-offset-gray-900' : 'hover:scale-110'
            }`}
            title={`${item.id} theme`}
          />
        ))}
      </div>

      {/* Mode Toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      >
        {mode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
