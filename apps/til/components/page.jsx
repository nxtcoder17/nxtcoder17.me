import { ThemeProvider } from 'pkg/theme/context';
import { NavHeader } from './header';

export const PageWrapper = (props) => (
  <ThemeProvider>
    <div className="hero-pattern-hideout dark:hero-pattern-hideout-dark h-screen overflow-y-auto">
      <NavHeader href="/" />
      <div className="container mx-auto" {...props} />
    </div>
  </ThemeProvider>
);
