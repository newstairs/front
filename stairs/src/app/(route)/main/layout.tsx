import Header from '@/app/_components/header';
import React from 'react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    {children}
  </>
);

export default MainLayout;