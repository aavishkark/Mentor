'use client';

import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext({
  theme: 'none',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    if(document.body.classList.contains('dark')){
        document.body.classList.remove('dark');
        setTheme('light')
    }
    else{
        document.body.classList.add('dark');
        setTheme('dark')
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}