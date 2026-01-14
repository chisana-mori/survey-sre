
import React, { useState, useMemo } from 'react';
import { useRouter } from '../../lib/router';
import { VentingPost } from '../../types';

const MOCK_POSTS: VentingPost[] = [
  { id: '1', emoji: '🤩', content: "DMV的树懒竟然在4小时内帮我办好了！奇迹！", likes: '2.4k', rank: 1, rotation: 1 },
  { id: '2', emoji: '😤', content: "谁又把胡萝卜蛋糕碎留在巡逻车里了？尼克！", likes: '158', rotation: -1 },
  { id: '3', emoji: '😑', content: "雨林区的空调卡在‘沙漠热模式’了。我要融化了。", likes: '1.1k', rank: 2, rotation: 2 },
  { id: '4', emoji: '🍩', content: "楼下的甜甜圈店又卖光了夏奇拉最喜欢的口味。", likes: '89', rotation: 1 },
  { id: '5', emoji: '🤪', content: "在局长办公室发现了冰棍棍。大事不妙！", likes: '942', rank: 3, rotation: -1 },
  { id: '6', emoji: '😩', content: "为什么键盘这么大？我是仓鼠，我需要小号装备。", likes: '45', rotation: 2 },
  { id: '7', emoji: '🦁', content: "市长的演讲持续了3小时。我的尾巴都睡着了。", likes: '312', rotation: -2 }
];

export default function VentingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'wall' | 'hot' | 'me'>('wall');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'new' | 'likes'>('new');
  const [showSearch, setShowSearch] = useState(false);

  const parseLikes = (l: string) => l.includes('k') ? parseFloat(l) * 1000 : parseInt(l);

  const posts = useMemo(() => {
    let list = [...MOCK_POSTS];
    if (activeTab === 'hot') list = list.filter(p => parseLikes(p.likes) > 500);
    if (activeTab === 'me') list = list.slice(0, 1);
    if (searchTerm) list = list.filter(p => p.content.includes(searchTerm));
    
    list.sort((a, b) => {
      if (sortBy === 'likes') return parseLikes(b.likes) - parseLikes(a.likes);
      return parseInt(b.id) - parseInt(a.id);
    });
    return list;
  }, [activeTab, searchTerm, sortBy]);

  return (
    <div className="relative h-screen flex flex-col zootopia-gradient overflow-hidden">
      <header className="p-5 pb-2 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="bg-white/95 p-1.5 rounded-xl text-primary"><span className="material-symbols-outlined">arrow_back</span></button>
            <h1 className="text-white text-xl font-bold">Venting Wall</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowSearch(!showSearch)} className="w-10 h-10 glass-card rounded-full text-white flex items-center justify-center">
              <span className="material-symbols-outlined">{showSearch ? 'close' : 'search'}</span>
            </button>
            <button onClick={() => setSortBy(sortBy === 'new' ? 'likes' : 'new')} className="w-10 h-10 glass-card rounded-full text-white flex items-center justify-center">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>
        {showSearch && (
          <input 
            className="w-full mb-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white placeholder:text-white/60 focus:outline-none"
            placeholder="Search posts..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          />
        )}
      </header>

      <main className="flex-1 overflow-y-auto px-4 no-scrollbar">
        <div className="columns-2 gap-3">
          {posts.map(p => (
            <div key={p.id} className="mb-3 break-inside-avoid animate-in zoom-in-95 duration-300">
              <div className="glass-card rounded-2xl p-4 relative transform" style={{ transform: `rotate(${p.rotation}deg)` }}>
                <span className="text-xl mb-2 block">{p.emoji}</span>
                <p className="text-[#4a3219] text-sm font-bold leading-relaxed">{p.content}</p>
                <div className="flex justify-end mt-3">
                  <span className="bg-white/40 px-2 py-0.5 rounded-full text-[10px] font-bold">🔥 {p.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <nav className="h-20 glass-card border-t-0 rounded-t-[2.5rem] px-10 flex items-center justify-between z-[60]">
        {[
          { id: 'wall', icon: 'dashboard', label: 'Wall' },
          { id: 'hot', icon: 'trending_up', label: 'Hot' },
          { id: 'me', icon: 'account_circle', label: 'Me' }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            className={`flex flex-col items-center transition-all ${activeTab === t.id ? 'text-white scale-110' : 'text-white/50'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === t.id ? "'FILL' 1" : "" }}>{t.icon}</span>
            <span className="text-[9px] font-bold mt-1 uppercase">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
