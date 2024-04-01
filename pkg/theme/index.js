import { useState, useLayoutEffect } from 'react';
import { themes } from './styles';

export const useTheme = () => {
  const [theme, setTheme] = useState(Object.keys(themes));

  const applyTheme = (selectedTheme) => {
    const root = document.getElementsByTagName('html')[0];
    root.style.cssText = selectedTheme.join(';');
  };

  // paints the app before it renders elements
  useLayoutEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)')
      .matches;
    const prefersNotSet = window.matchMedia('(prefers-color-scheme: no-preference)').matches;

    // Media Hook to check what theme user prefers
    if (prefersDark) {
      setTheme('dark');
      applyTheme(themes.dark);
    }

    if (prefersLight || prefersNotSet) {
      setTheme('light');
      applyTheme(themes.light);
    }

    // if state changes, repaints the app
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // return [theme, setTheme];
  return [theme];
};
