
import React from 'react';
import { useRouter, RouterProvider } from './lib/router';
import RootLayout from './app/layout';
import HomePage from './app/page';
import SurveyPage from './app/survey/page';
import VentingPage from './app/venting/page';

const AppContent = () => {
  const { route } = useRouter();

  let page;
  switch (route) {
    case '/survey': page = <SurveyPage />; break;
    case '/venting': page = <VentingPage />; break;
    default: page = <HomePage />; break;
  }

  return <RootLayout>{page}</RootLayout>;
};

const App: React.FC = () => {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
};

export default App;
