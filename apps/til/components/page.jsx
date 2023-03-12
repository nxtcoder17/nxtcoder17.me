import { ThemeContext, ThemeDark, useTheme } from 'pkg/contexts/theme-context';
import { useEffect, useMemo } from 'react';
import { NavHeader } from './header';

export const PageWrapper = (props) => {
  const [theme, setTheme] = useTheme();
  const themeProps = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  useEffect(() => {
    if (theme === ThemeDark) {
      document.documentElement.classList.add('dark');
      return;
    }
    document.documentElement.classList.remove('dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={themeProps}>
      <div className="hero-pattern-hideout h-screen overflow-y-auto">
        <NavHeader href="/" />
        <div className="container mx-auto" {...props} />
      </div>
    </ThemeContext.Provider>
  );
};
