
import React from 'react';
import { SurveyState } from '../types';

interface SurveyStep1Props {
  state: SurveyState;
  updateState: (s: Partial<SurveyState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const TASKS = ['手工处理数据', '重复运维', '会议记录', '文档归档'];

const SurveyStep1: React.FC<SurveyStep1Props> = ({ state, updateState, onNext, onBack }) => {
  const toggleTask = (task: string) => {
    const newTasks = state.tasks.includes(task) 
      ? state.tasks.filter(t => t !== task)
      : [...state.tasks, task];
    updateState({ tasks: newTasks });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center p-4 pb-2 justify-between">
        <button onClick={onBack} className="text-[#1c140d] dark:text-white flex size-12 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-[#1c140d] dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-12">Zootopia Mission</h2>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between items-end">
          <div className="flex flex-col">
            <p className="text-[#1c140d] dark:text-white text-base font-bold">Savanna Central Skyline</p>
            <p className="text-primary text-xs font-semibold uppercase tracking-wider">Gathering Evidence</p>
          </div>
          <p className="text-primary text-sm font-bold">1 / 2</p>
        </div>
        <div className="relative h-12 w-full overflow-hidden rounded-lg bg-[#e8dbce] dark:bg-neutral-800">
          <div className="absolute inset-0 opacity-20 bg-repeat-x bg-bottom" style={{ 
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRsAZyFsEq4PnMr6-Gioo5n-hvfmyFK7n0px9eDCgktIkr3sx537l6m0cXoCaPT4dSjmclHFWuf7uVNFja-if9IWyuWcKFnzqntyKKLWl3NRpwmQ5kav8YaOvXmUg3-lZPDEDjGVyicjfA1qmnBaPCZyr_0tpWHouKREDxH4i8gGep5FMSzrZ0_XuGgYig7xa4Rd0XQ-nkjK0qeemxcOy5rxyaTF4YGLzxTGJIRPI2h5hHB9rbOUcYOVK3Xxs4qFWRe_K7dxWOWcCw')`,
            backgroundSize: 'contain'
          }}></div>
          <div className="h-full rounded bg-primary/40 transition-all duration-500" style={{ width: '50%' }}>
            <div className="flex h-full items-center justify-end px-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-4 pt-10">
        <div className="absolute -top-6 right-8 z-10 w-24 h-24 bg-center bg-contain bg-no-repeat" 
             style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC68V-5mvp9eSAT5WKkvEhEGkqIYYVG8u3DuC9zrIQnLavyYtv9v5xhze81jRGxjR6lsJmSwobd6-B1kyTWUyqMv22dSihAT8zkK28aoXWEN4tigjtRFDfFkPv6MpvIpGdMDehUne_yKc4px8MZHs9CV99x5h5DeiAzuz3q8nMBmSnaQAHOBoFxcwddjZ68qOMTksa5r3Vz1-avnJ67bZjwgFcGHPYSvuul2ZKFiFFMprKanGnDBGKT5K9sX0gV2q-x3Dt7SkwDHFCs')` }}></div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 border border-primary/10">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
            QUESTION 01
          </div>
          <h2 className="text-[#1c140d] dark:text-white tracking-tight text-2xl font-bold leading-tight pb-2">
            工作中最让你头疼的繁琐任务是什么?
          </h2>
          <p className="text-[#9c7349] dark:text-neutral-400 text-sm font-normal pb-6">
            Pick a common headache or tell us more below!
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {TASKS.map(task => (
              <button 
                key={task}
                onClick={() => toggleTask(task)}
                className={`px-4 py-2 rounded-full border-2 transition-all active:scale-95 text-sm font-semibold ${
                  state.tasks.includes(task) 
                  ? 'border-primary bg-primary text-white' 
                  : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10'
                }`}
              >
                {task}
              </button>
            ))}
          </div>
          <div className="relative">
            <textarea 
              value={state.feedback}
              onChange={(e) => updateState({ feedback: e.target.value })}
              className="w-full min-h-[140px] p-4 rounded-lg border-2 border-[#e8dbce] dark:border-neutral-700 bg-background-light dark:bg-neutral-800 text-[#1c140d] dark:text-white focus:border-primary focus:ring-0 transition-colors resize-none placeholder:text-[#9c7349]/50" 
              placeholder="Describe your struggle here..."
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-[#9c7349] text-xs">
              {state.feedback.length} / 500
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 pb-10">
        <button 
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl shadow-[0_4px_0_0_#c4660a] active:shadow-none active:translate-y-1 transition-all"
        >
          <span>Next Step</span>
          <span className="material-symbols-outlined">rocket_launch</span>
        </button>
      </div>
    </div>
  );
};

export default SurveyStep1;
