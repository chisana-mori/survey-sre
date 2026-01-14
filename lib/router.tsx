
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppRoute } from '../types';

interface RouterContextType {
  route: AppRoute;
  push: (path: AppRoute) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider = ({ children }: { children: ReactNode }) => {
  const [route, setRoute] = useState<AppRoute>(() => {
    const hash = window.location.hash.replace('#', '') as AppRoute;
    return (hash || '/') as AppRoute;
  });

  const push = (path: AppRoute) => {
    window.location.hash = path;
    setRoute(path);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppRoute;
      setRoute((hash || '/') as AppRoute);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <RouterContext.Provider value={{ route, push }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used within a RouterProvider');
  return context;
};

export const Link = ({ href, children, className }: { href: AppRoute; children: ReactNode; className?: string }) => {
  const { push } = useRouter();
  return (
    <a 
      href={`#${href}`} 
      onClick={(e) => { e.preventDefault(); push(href); }} 
      className={className}
    >
      {children}
    </a>
  );
};
