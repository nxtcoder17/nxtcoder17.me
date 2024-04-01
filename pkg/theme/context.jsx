import { createContext } from 'react';
import { useTheme } from '.';
import { THEME_LIGHT } from './styles';

export const ThemeContext = createContext({
  theme: THEME_LIGHT,
  setTheme: null,
});

export function ThemeProvider({ children }) {
  const [theme] = useTheme();
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}
