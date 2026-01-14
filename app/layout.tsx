
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-background-light dark:bg-background-dark shadow-2xl relative overflow-x-hidden flex flex-col">
      {children}
      {/* iOS Home Indicator */}
      <div className="h-8 flex items-end justify-center pb-2 mt-auto bg-transparent">
        <div className="w-32 h-1.5 bg-black/10 dark:bg-white/10 rounded-full"></div>
      </div>
    </div>
  );
}
