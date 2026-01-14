
import React from 'react';

interface HomeViewProps {
  onStartSurvey: () => void;
  onOpenWall: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onStartSurvey, onOpenWall }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top AppBar */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-20">
        <div className="text-[#1c140d] dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <span className="material-symbols-outlined">menu</span>
        </div>
        <h2 className="text-[#1c140d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center font-display">Zootopia: Fun Work</h2>
        <div className="text-[#1c140d] dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <span className="material-symbols-outlined">account_circle</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-12">
        {/* HeaderImage */}
        <div className="px-0 py-0 sm:px-4 sm:py-3">
          <div className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-[#e5e5e5] sm:rounded-xl min-h-[360px] relative ios-shadow" 
               style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAvCJZEH9rcE_o2S3ohgtKybC0T6mSznC_qadEbp08aJzAjdwv94vO56TJieTgwWHFLgnu9flQsrFRtR2Kz0LKRXyQuSgR5YkM3uhpK3wE3ktq-ms81KHyqaM_YZ-hVMc9f44pbFhXGQnlKMXnrC5wqnOr0pU9bduNPBOVQkqFrBpcGmUrpMKKoAc6Af74d57MBhIaJPwLqAkVaZ-W97OaSHoCGUEji4mkWNa4b0daXfZzfBrpFvULYQtLRKzJuOLEO5xoyE_eIyslS")` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background-light/80 via-transparent to-transparent dark:from-background-dark/80"></div>
            <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/90 dark:bg-black/60 backdrop-blur-md p-2 px-4 rounded-full border border-white/20">
              <span className="material-symbols-outlined text-primary text-xl">pets</span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">欢迎来到动物城！</span>
            </div>
          </div>
        </div>

        {/* HeadlineText */}
        <div className="px-6">
          <h1 className="text-[#1c140d] dark:text-white tracking-tight text-[36px] font-extrabold leading-[1.15] text-center pb-4 pt-8 font-display">
            进入疯狂动物城<br/><span className="text-primary">让工作更有趣</span>
          </h1>
        </div>

        {/* ButtonGroup */}
        <div className="flex flex-col gap-4 items-stretch px-6 py-3 mt-6">
          <button 
            onClick={onStartSurvey}
            className="group flex items-center justify-center rounded-xl h-16 px-5 bg-judy-purple text-white text-lg font-bold ios-shadow hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl">edit_note</span>
              📝 我要填写问卷
            </span>
          </button>
          <button 
            onClick={onOpenWall}
            className="group flex items-center justify-center rounded-xl h-16 px-5 bg-nick-orange text-white text-lg font-bold ios-shadow hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl">forum</span>
              💬 看看大家在吐槽什么
            </span>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-8">
          <div className="mx-auto w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-6"></div>
          <div className="flex flex-col items-center gap-2 px-6">
            <p className="text-[#1c140d]/60 dark:text-white/60 text-base font-medium text-center flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">verified_user</span>
              匿名、免登录、2分钟完成
            </p>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                <span className="material-symbols-outlined text-sm">lock</span> ENCRYPTED
              </div>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                <span className="material-symbols-outlined text-sm">bolt</span> FAST
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* iOS Home Indicator */}
      <div className="h-8 flex items-end justify-center pb-2 mt-auto">
        <div className="w-32 h-1.5 bg-black/10 dark:bg-white/10 rounded-full"></div>
      </div>
    </div>
  );
};

export default HomeView;
