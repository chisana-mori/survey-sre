
import React, { useState, useMemo } from 'react';
import { VentingPost } from '../types';

const MOCK_POSTS: VentingPost[] = [
  { id: '1', emoji: '🤩', content: "The sloth at the DMV actually processed my paperwork in under 4 hours today! Miracles happen!", likes: '2.4k', rank: 1, rotation: 1 },
  { id: '2', emoji: '😤', content: "Who keeps leaving carrot cake crumbs in the patrol car? Nick, I'm looking at you.", likes: '158', rotation: -1 },
  { id: '3', emoji: '😑', content: "The AC in the Rainforest District sector is stuck on 'Desert Heat'. I'm melting.", likes: '1.1k', rank: 2, rotation: 2 },
  { id: '4', emoji: '🍩', content: "The donut shop downstairs is out of Gazelle's favorite flavor AGAIN.", likes: '89', rotation: 1 },
  { id: '5', emoji: '🤪', content: "Found a Pawpsicle stick in the chief's office. Big trouble coming!", likes: '942', rank: 3, rotation: -1 },
  { id: '6', emoji: '😩', content: "Why are the keyboard keys so big? I'm a hamster, I need smaller gear.", likes: '45', rotation: 2 },
  { id: '7', emoji: '🦁', content: "Mayor's speech lasted 3 hours. My tail fell asleep.", likes: '312', rotation: -2 }
];

interface VentingWallProps {
  onBack: () => void;
}

type Tab = 'wall' | 'hot' | 'me';
type SortBy = 'new' | 'likes';

const VentingWall: React.FC<VentingWallProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('wall');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('new');
  const [filterEmoji, setFilterEmoji] = useState<string | null>(null);

  // Helper to parse likes string (e.g., '2.4k' -> 2400)
  const parseLikes = (likes: string) => {
    if (likes.includes('k')) return parseFloat(likes.replace('k', '')) * 1000;
    return parseInt(likes);
  };

  const processedPosts = useMemo(() => {
    let result = [...MOCK_POSTS];

    // Search filter
    if (searchTerm) {
      result = result.filter(post => 
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Emoji filter (Savanna Categories)
    if (filterEmoji) {
      result = result.filter(post => post.emoji === filterEmoji || post.content.includes(filterEmoji));
    }

    // Tab filtering
    if (activeTab === 'hot') {
      result = result.filter(post => parseLikes(post.likes) > 500);
    } else if (activeTab === 'me') {
      // Dummy "Me" filtering: just show one post
      result = result.slice(0, 1);
    }

    // Sorting
    if (sortBy === 'likes' || activeTab === 'hot') {
      result.sort((a, b) => parseLikes(b.likes) - parseLikes(a.likes));
    } else {
      result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }

    return result;
  }, [searchTerm, sortBy, filterEmoji, activeTab]);

  return (
    <div className="relative h-screen w-full zootopia-gradient overflow-hidden flex flex-col">
      <header className="flex flex-col pt-8 px-5 pb-4 z-50">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="bg-white/95 p-1.5 rounded-xl shadow-lg hover:scale-105 transition-transform active:scale-95">
              <span className="material-symbols-outlined text-primary text-2xl font-bold">arrow_back</span>
            </button>
            <div>
              <h1 className="text-white text-xl font-extrabold tracking-tight drop-shadow-md leading-none">
                {activeTab === 'wall' ? 'Venting Wall' : activeTab === 'hot' ? 'Hot Topics' : 'My Posts'}
              </h1>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-0.5">Zootopia PD HQ</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className={`w-10 h-10 flex items-center justify-center rounded-full glass-card text-white transition-colors ${isSearchVisible ? 'bg-white/40 border-white' : ''}`}
            >
              <span className="material-symbols-outlined">{isSearchVisible ? 'close' : 'search'}</span>
            </button>
            <button 
              onClick={() => setSortBy(sortBy === 'new' ? 'likes' : 'new')}
              className={`w-10 h-10 flex items-center justify-center rounded-full glass-card text-white transition-all ${sortBy === 'likes' ? 'rotate-180 text-yellow-300' : ''}`}
              title={sortBy === 'new' ? 'Sort by likes' : 'Sort by newest'}
            >
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        {isSearchVisible && (
          <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <input 
              autoFocus
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-4 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        )}
        
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          <button 
            onClick={() => setFilterEmoji(null)}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 border border-white/20 shadow-sm transition-all ${!filterEmoji ? 'bg-white/90 text-primary' : 'bg-white/30 text-white'}`}
          >
            <p className="text-xs font-bold">All</p>
          </button>
          {[
            { e: '😤', l: 'Angry' },
            { e: '😑', l: 'Meh' },
            { e: '🤩', l: 'Excited' },
            { e: '🍩', l: 'Hungry' }
          ].map(cat => (
            <button 
              key={cat.l}
              onClick={() => setFilterEmoji(filterEmoji === cat.e ? null : cat.e)}
              className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 border border-white/20 backdrop-blur-md transition-all ${filterEmoji === cat.e ? 'bg-white/90 text-primary' : 'bg-white/30 text-white'}`}
            >
              <p className="text-xs font-bold">{cat.e} {cat.l}</p>
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 w-full px-4 overflow-y-auto pt-2 pb-24 no-scrollbar">
        {processedPosts.length > 0 ? (
          <div className="columns-2 gap-3">
            {processedPosts.map(post => (
              <div key={post.id} className="mb-3 break-inside-avoid animate-in zoom-in-95 duration-300">
                <div 
                  className={`glass-card rounded-2xl p-4 relative overflow-visible transform transition-transform hover:scale-[1.02]`}
                  style={{ transform: `rotate(${post.rotation}deg)` }}
                >
                  {post.rank && (
                    <div className="absolute -top-3 -right-2 bg-yellow-400 text-white rounded-full p-1.5 shadow-lg border-2 border-white z-10">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {post.rank === 1 ? 'stars' : post.rank === 2 ? 'workspace_premium' : 'emoji_events'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{post.emoji}</span>
                    {post.rank && (
                      <span className="text-[10px] font-extrabold text-[#4a3219]/60 uppercase tracking-tighter">Rank #{post.rank}</span>
                    )}
                  </div>
                  <p className="text-[#4a3219] text-sm font-bold leading-relaxed">{post.content}</p>
                  <div className="flex justify-end mt-3">
                    <button className="bg-white/40 px-2 py-1 rounded-full flex items-center gap-1 active:scale-90 transition-transform">
                      <span className="text-xs">🔥</span>
                      <span className="text-xs font-extrabold text-[#4a3219]">{post.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/60 gap-4">
            <span className="material-symbols-outlined text-6xl">sentiment_dissatisfied</span>
            <p className="font-bold">No results found, Flash!</p>
          </div>
        )}
      </main>

      <div className="fixed bottom-24 right-6 z-[100]">
        <button className="flex items-center justify-center rounded-2xl h-14 w-14 bg-primary text-white shadow-2xl border-4 border-white/50 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-3xl font-bold">add_comment</span>
        </button>
      </div>

      <nav className="h-20 glass-card border-t-0 rounded-t-[2.5rem] mx-0 mb-0 px-10 flex items-center justify-between z-[60]">
        <button 
          onClick={() => setActiveTab('wall')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'wall' ? 'text-white scale-110' : 'text-white/50'}`}
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: activeTab === 'wall' ? "'FILL' 1" : "" }}>dashboard</span>
          <span className="text-[9px] font-extrabold uppercase tracking-widest">Wall</span>
        </button>
        <button 
          onClick={() => setActiveTab('hot')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'hot' ? 'text-white scale-110' : 'text-white/50'}`}
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: activeTab === 'hot' ? "'FILL' 1" : "" }}>trending_up</span>
          <span className="text-[9px] font-extrabold uppercase tracking-widest">Hot</span>
        </button>
        <button 
          onClick={() => setActiveTab('me')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'me' ? 'text-white scale-110' : 'text-white/50'}`}
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: activeTab === 'me' ? "'FILL' 1" : "" }}>account_circle</span>
          <span className="text-[9px] font-extrabold uppercase tracking-widest">Me</span>
        </button>
      </nav>

      <div className="absolute bottom-16 left-0 w-full h-40 opacity-30 pointer-events-none z-10 overflow-hidden">
        <div className="w-full h-full bg-no-repeat bg-bottom bg-cover" 
             style={{ 
               backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_8RgbZ2q43mUjmwY7-SwK1GERPW8LF_ykzgwaBSSAjq0xwCD5Y2N3DuAKWq41_qPBb1av9ADhu5qtWE4gmVRO5XS_dFR_AEfQ_OcNamWSdBzSCKZk-2SkUZokR1j4lAYcqpekJaswhIPVxlaDkFCtA1aMfeV40xq4E2PIhDIciAy-eVFDBOqAVlPYaLdZRTi13a6cmv6whBKd169wT2RpfXJFWDr1Km1TuGgC5SVmPZElBGVhIf6zSFawI4ohlZwirVdNkQW0mFGg')",
               filter: 'brightness(0) invert(1)' 
             }}>
        </div>
      </div>
    </div>
  );
};

export default VentingWall;
