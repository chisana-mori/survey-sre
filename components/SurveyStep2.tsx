
import React from 'react';
import { SurveyState } from '../types';

interface SurveyStep2Props {
  state: SurveyState;
  updateState: (s: Partial<SurveyState>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const MOODS = [
  { emoji: '😤', label: '糟透了' },
  { emoji: '😑', label: '不太好' },
  { emoji: '😐', label: '还凑合' },
  { emoji: '😊', label: '挺不错' },
  { emoji: '🤩', label: '超棒的' }
];

const AI_TASKS = ['撰写报告', '总结会议', '分析数据', '邮件回复', '代码生成', '创意脑暴'];

const SurveyStep2: React.FC<SurveyStep2Props> = ({ state, updateState, onSubmit, onBack }) => {
  const toggleAiTask = (task: string) => {
    const newTasks = state.aiTasks.includes(task) 
      ? state.aiTasks.filter(t => t !== task)
      : [...state.aiTasks, task];
    updateState({ aiTasks: newTasks });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#fff7ef] to-[#fcfaf8] dark:from-[#2d2114] dark:to-background-dark overflow-y-auto">
      <div className="flex items-center p-4 pb-2 justify-between shrink-0">
        <button onClick={onBack} className="text-[#1c140d] dark:text-white flex size-12 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-[#1c140d] dark:text-white text-lg font-bold flex-1 text-center pr-12">职场反馈调查</h2>
      </div>

      <div className="flex flex-col gap-3 p-4 shrink-0">
        <div className="flex gap-6 justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <p className="text-[#1c140d] dark:text-white text-base font-medium">星星收集进度</p>
          </div>
          <p className="text-[#1c140d] dark:text-white text-sm font-bold">2/2</p>
        </div>
        <div className="rounded-full bg-[#e8dbce] dark:bg-[#3d2e20] h-3 overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: '100%' }}></div>
        </div>
        <p className="text-[#9c7349] dark:text-[#cbb094] text-sm">太棒了！最后一步</p>
      </div>

      {/* Question 02: AI Help */}
      <div className="px-4 py-2 shrink-0">
        <div className="bg-white dark:bg-[#3d2e20] rounded-xl shadow-md p-5 border border-primary/10">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-3 uppercase tracking-wider">
            QUESTION 02
          </div>
          <h3 className="text-[#1c140d] dark:text-white text-xl font-bold leading-tight mb-4">
            你最希望 AI 帮你分担哪些工作？
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {AI_TASKS.map(task => (
              <button 
                key={task}
                onClick={() => toggleAiTask(task)}
                className={`px-3 py-1.5 rounded-full border transition-all text-xs font-semibold ${
                  state.aiTasks.includes(task) 
                  ? 'border-primary bg-primary text-white shadow-sm' 
                  : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10'
                }`}
              >
                {task}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <textarea 
              value={state.aiHelp}
              onChange={(e) => updateState({ aiHelp: e.target.value })}
              className="w-full min-h-[100px] p-3 rounded-lg border border-[#e8dbce] dark:border-neutral-700 bg-background-light dark:bg-neutral-800 text-[#1c140d] dark:text-white text-sm focus:border-primary focus:ring-0 transition-colors resize-none placeholder:text-[#9c7349]/40" 
              placeholder="还有什么想让 AI 做的？请告诉朱迪和尼克..."
            />
          </div>
        </div>
      </div>

      {/* Question 03: Mood (The existing implementation) */}
      <div className="relative flex px-4 pt-4 items-end shrink-0">
        <div className="w-1/4">
          <div className="w-full aspect-square bg-center bg-no-repeat bg-contain" 
               style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAJL0b5RilLFO-PKr9TBEBzz9QPp5RdWGYF8nQrD7iiFymC9JJdwErx7YiTFRzINJLYmLvtHnjSD1bpsdO93OYunF4US9u_yuAfAhX4mZCBLWKzqAdSDtM_XG3dX_SXCca69G6NJSsqd8SH01iYHRr8SulQrRq1ZwmCcIbjZ3CnnK6dsAa703Mt6KA7pkqLHcs67eVs8uskZNI_CLMTQzxjqbvo2p4JCLjiN1DvdHs2QiKa1hW4MD_hlzKnYaumgZAUvv8rut48AJD-")` }}>
          </div>
        </div>
        <div className="w-3/4 pb-4">
          <div className="bg-white dark:bg-[#3d2e20] p-3 rounded-xl rounded-bl-none shadow-sm relative border border-[#f2800d]/20 ml-2">
            <p className="text-[#1c140d] dark:text-white text-sm font-medium leading-normal">
              尼克正在为你加油鼓劲！把真实感受告诉我吧。
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2 shrink-0">
        <h2 className="text-[#1c140d] dark:text-white tracking-tight text-xl font-bold px-4 text-center">当前心情如何?</h2>
      </div>

      <div className="grid grid-cols-5 gap-2 p-4 shrink-0">
        {MOODS.map(mood => (
          <button 
            key={mood.label}
            onClick={() => updateState({ mood: mood.label })}
            className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-all active:scale-95 border-2 ${
              state.mood === mood.label 
              ? 'border-primary bg-primary/10' 
              : 'border-transparent bg-white dark:bg-[#3d2e20] shadow-sm hover:border-primary/50'
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className={`text-[10px] font-bold ${state.mood === mood.label ? 'text-primary' : 'text-[#1c140d] dark:text-white'}`}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-auto p-4 pb-10 relative z-10 shrink-0">
        <button 
          onClick={onSubmit}
          className="w-full bg-primary hover:bg-[#d9720b] text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <span>提交并领取称号</span>
          <span className="material-symbols-outlined">workspace_premium</span>
        </button>
      </div>

      <div className="absolute bottom-24 left-0 w-full h-32 opacity-5 pointer-events-none z-0 overflow-hidden shrink-0">
        <div className="w-full h-full bg-center bg-no-repeat bg-cover" 
             style={{ 
               backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDLQa6L2UtuYJe0wz-0V2w-aLhUBSmezVEfrm_DJ2l0zZ_8oCoQVl0XmLuwAbbjUBqXAUP2W6prx6GmtQc5tfwPzSXUbtPdO8_nvWLVAisz1F-UPxv_QdNtFGox74YMmwxZlGsRR_fyifP2kVrtJtqe7TvI8QluJ6YHBJHDlrcB8YY81n4PamG1ODhm5u9D_3nCQDKkib5Sk0EnrkSau4Z1e-epsgVgNm4uUcAwM3H2xmpUQOXFtPFzkutpNmTxFGLw82lnGuL8VHES")`,
               maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
               WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
             }}>
        </div>
      </div>
    </div>
  );
};

export default SurveyStep2;
