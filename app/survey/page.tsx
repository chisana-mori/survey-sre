
import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { SurveyState } from '../../types';
import { saveSurvey } from '../../lib/database';
import SlothSuccessModal from '../../components/SlothSuccessModal';

const TASKS = ['手工处理数据', '重复运维', 'SOP编写'];
const AI_TASKS = ['撰写报告', '总结会议', '分析数据', '邮件回复', '代码生成', '创意脑暴'];

export default function SurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [state, setState] = useState<SurveyState>({
    tasks: [],
    feedback: '',
    aiTasks: [],
    aiHelp: '',
    mood: ''
  });

  const updateState = (update: Partial<SurveyState>) => setState(prev => ({ ...prev, ...update }));

  const handleTaskToggle = (
    item: string,
    currentList: string[],
    currentText: string,
    listKey: 'tasks' | 'aiTasks',
    textKey: 'feedback' | 'aiHelp'
  ) => {
    const isSelected = currentList.includes(item);
    const newList = isSelected
      ? currentList.filter(i => i !== item)
      : [...currentList, item];

    let newText = currentText;
    // If adding a new item, append it to the text area
    if (!isSelected) {
      const prefix = currentText ? '\n' : '';
      newText = `${currentText}${prefix}${item}: `;
    }

    updateState({ [listKey]: newList, [textKey]: newText });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await saveSurvey(state);
      if (result.success) {
        setShowSuccessModal(true);
      } else {
        alert(`提交失败: ${result.error}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalComplete = () => {
    setShowSuccessModal(false);
    router.push('/venting');
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <button onClick={() => step === 1 ? router.push('/') : setStep(step - 1)} className="text-[#1c140d] dark:text-white flex size-12 items-center">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-[#1c140d] dark:text-white text-lg font-bold flex-1 text-center pr-12">Zootopia Survey</h2>
      </div>

      {/* Progress */}
      <div className="px-4 py-2">
        <div className="flex justify-between items-end mb-2">
          <p className="text-[#1c140d] dark:text-white text-sm font-bold">Step {step} of 2</p>
          <p className="text-primary text-xs font-bold">{step === 1 ? 'Gathering Complaints' : 'AI Request'}</p>
        </div>
        <div className="h-2 w-full bg-[#e8dbce] dark:bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }}></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6">
        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-primary/10">
              <h3 className="text-2xl font-bold mb-2">工作中最让你头疼的任务?</h3>
              <p className="text-[#9c7349] dark:text-neutral-400 text-sm mb-6">Tell us what slows you down.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {TASKS.map(t => (
                  <button key={t}
                    onClick={() => handleTaskToggle(t, state.tasks, state.feedback, 'tasks', 'feedback')}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${state.tasks.includes(t) ? 'bg-primary border-primary text-white' : 'border-primary/20 text-primary'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <textarea
                className="w-full min-h-[120px] p-4 rounded-xl border-2 border-[#e8dbce] dark:border-neutral-700 bg-background-light dark:bg-neutral-800"
                placeholder="Details about your struggle..."
                value={state.feedback}
                onChange={e => updateState({ feedback: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-primary/10">
              <h3 className="text-2xl font-bold mb-2">最希望 AI 帮你分担什么?</h3>
              <p className="text-[#9c7349] dark:text-neutral-400 text-sm mb-6">Let the AI handle the boring stuff!</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {AI_TASKS.map(t => (
                  <button key={t}
                    onClick={() => handleTaskToggle(t, state.aiTasks, state.aiHelp, 'aiTasks', 'aiHelp')}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${state.aiTasks.includes(t) ? 'bg-primary border-primary text-white' : 'border-primary/20 text-primary'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <textarea
                className="w-full min-h-[120px] p-4 rounded-xl border-2 border-[#e8dbce] dark:border-neutral-700 bg-background-light dark:bg-neutral-800"
                placeholder="What specifically should AI do for you?"
                value={state.aiHelp}
                onChange={e => updateState({ aiHelp: e.target.value })}
              />
            </div>

          </div>
        )}
      </div>

      <div className="p-4 pt-10">
        <button
          onClick={() => step === 1 ? setStep(2) : handleSubmit()}
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          {isSubmitting ? '提交中...' : step === 1 ? 'Next Step' : 'Submit & See Wall'}
        </button>
      </div>

      <SlothSuccessModal visible={showSuccessModal} onComplete={handleModalComplete} />
    </div>
  );
}
