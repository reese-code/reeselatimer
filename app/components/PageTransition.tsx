// PageTransition.tsx
import React, { createContext, useContext } from 'react';
import { useNavigate } from '@remix-run/react';

export const TransitionContext = createContext({
  startTransition: (to: string) => {},
});

export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const startTransition = (to: string) => {
    navigate(to);
  };

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export const TransitionLink = ({ to, children, className, ...props }: {
  to: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  const { startTransition } = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};