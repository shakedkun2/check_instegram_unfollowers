import React from 'react';
import { UserMinus, Users, Eye } from 'lucide-react';

export default function StatsOverview({ stats, activeTab, onSelectTab }) {
  const cards = [
    {
      id: 'notFollowingBack',
      label: 'Not Following Back',
      count: stats.notFollowingBackCount,
      icon: UserMinus,
      color: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30',
      activeColor: 'ring-2 ring-rose-500 bg-rose-500/20',
      desc: "You follow them, they don't follow back",
    },
    {
      id: 'allFollowing',
      label: 'Total Following',
      count: stats.followingCount,
      icon: Eye,
      color: 'from-slate-800 to-slate-800/40 text-slate-300 border-slate-700',
      activeColor: 'ring-2 ring-slate-400 bg-slate-800',
      desc: 'All accounts you follow',
    },
    {
      id: 'allFollowers',
      label: 'Total Followers',
      count: stats.followersCount,
      icon: Users,
      color: 'from-slate-800 to-slate-800/40 text-slate-300 border-slate-700',
      activeColor: 'ring-2 ring-slate-400 bg-slate-800',
      desc: 'All accounts following you',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 px-4 sm:px-0">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeTab === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onSelectTab(card.id)}
            className={`text-left p-4 rounded-xl border bg-gradient-to-b transition-all flex flex-col justify-between ${
              card.color
            } ${isActive ? card.activeColor : 'opacity-80 hover:opacity-100'}`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-medium tracking-tight truncate max-w-[85%]">
                {card.label}
              </span>
              <Icon className="w-4 h-4 shrink-0" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              {card.count.toLocaleString()}
            </div>
          </button>
        );
      })}
    </div>
  );
}
