import { createContext, useEffect, useState } from 'react';

export const ThemeLight = 'light';
export const ThemeDark = 'dark';

export const ThemeContext = createContext({
  theme: ThemeLight,
  setTheme: null,
});

export const useTheme = () => {
  const [theme, setTheme] = useState('');
  useEffect(() => {
    if (theme) {
      return;
    }
    if (window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme(ThemeDark);
    }
    setTheme(ThemeLight);
  }, [theme]);

  return [theme, setTheme];
};
