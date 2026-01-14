import React, { useEffect, useState } from 'react';

interface SlothSuccessModalProps {
  visible: boolean;
  onComplete: () => void;
}

export default function SlothSuccessModal({ visible, onComplete }: SlothSuccessModalProps) {
  const [shouldShow, setShouldShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldShow(true);
      const timer = setTimeout(() => {
        setShouldShow(false);
        setTimeout(onComplete, 300);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!shouldShow) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-6 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`relative glass-card rounded-3xl p-8 max-w-sm w-full text-center transition-all duration-500 ${
          visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'
        }`}
      >
        <div className="mb-6 relative">
          <div
            className={`text-8xl inline-block transition-transform duration-1000 ${
              visible ? 'scale-100' : 'scale-0'
            }`}
            style={{
              animation: visible ? 'sloth-wave 1.5s ease-in-out infinite' : 'none'
            }}
          >
            🦥
          </div>
          {visible && (
            <>
              <span className="absolute top-0 right-8 text-2xl animate-pulse">✨</span>
              <span className="absolute top-4 left-8 text-xl animate-pulse delay-100">✨</span>
              <span className="absolute bottom-0 right-12 text-lg animate-pulse delay-200">✨</span>
            </>
          )}
        </div>

        <h2 className="text-2xl font-bold text-[#1c140d] dark:text-white mb-2">
          收到你的问卷！
        </h2>
        <p className="text-[#9c7349] dark:text-neutral-400 text-sm font-medium">
          Flash 正在慢慢处理中...
        </p>

        <div className="mt-6 h-1 w-full bg-[#e8dbce] dark:bg-neutral-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-primary transition-all duration-300 ${
              visible ? 'w-full' : 'w-0'
            }`}
          />
        </div>

        <p className="mt-4 text-xs text-[#9c7349] dark:text-neutral-500 italic font-mono">
          "Thanks... for... your... feedback..."
        </p>
      </div>

      <style>{`
        @keyframes sloth-wave {
          0%, 100% { transform: rotate(-2deg) translateY(0); }
          50% { transform: rotate(2deg) translateY(-4px); }
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  );
}
