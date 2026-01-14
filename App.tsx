
import React, { useState, useEffect } from 'react';
import { AppView, SurveyState } from './types';
import HomeView from './components/HomeView';
import SurveyStep1 from './components/SurveyStep1';
import SurveyStep2 from './components/SurveyStep2';
import VentingWall from './components/VentingWall';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [surveyState, setSurveyState] = useState<SurveyState>({
    tasks: [],
    feedback: '',
    aiHelp: '',
    aiTasks: [],
    mood: ''
  });

  // Simple Hash Routing Simulation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (Object.values(AppView).includes(hash as AppView)) {
        setCurrentView(hash as AppView);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: AppView) => {
    window.location.hash = view;
    setCurrentView(view);
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-background-light dark:bg-background-dark shadow-2xl relative overflow-x-hidden">
      {currentView === AppView.HOME && (
        <HomeView 
          onStartSurvey={() => navigateTo(AppView.SURVEY_STEP_1)} 
          onOpenWall={() => navigateTo(AppView.VENTING_WALL)} 
        />
      )}
      
      {currentView === AppView.SURVEY_STEP_1 && (
        <SurveyStep1 
          state={surveyState} 
          updateState={(s) => setSurveyState({...surveyState, ...s})}
          onNext={() => navigateTo(AppView.SURVEY_STEP_2)}
          onBack={() => navigateTo(AppView.HOME)}
        />
      )}

      {currentView === AppView.SURVEY_STEP_2 && (
        <SurveyStep2 
          state={surveyState} 
          updateState={(s) => setSurveyState({...surveyState, ...s})}
          onSubmit={() => {
            // In a real app, send data to API
            navigateTo(AppView.VENTING_WALL);
          }}
          onBack={() => navigateTo(AppView.SURVEY_STEP_1)}
        />
      )}

      {currentView === AppView.VENTING_WALL && (
        <VentingWall 
          onBack={() => navigateTo(AppView.HOME)}
        />
      )}
    </div>
  );
};

export default App;
