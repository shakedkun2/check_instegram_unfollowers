import React, { useState, useMemo } from 'react';
import {
  Search,
  ExternalLink,
  CheckCircle2,
  Circle,
  Copy,
  Download,
  Check,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

export default function UserList({ users, activeTabName, categoryId }) {
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [checkedUsers, setCheckedUsers] = useState(() => new Set());
  const [hideChecked, setHideChecked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Toggle checked state for a username
  const toggleChecked = (username) => {
    setCheckedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(username)) {
        next.delete(username);
      } else {
        next.add(username);
      }
      return next;
    });
  };

  // Filter & sort
  const filteredUsers = useMemo(() => {
    let list = users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()));

    if (hideChecked) {
      list = list.filter((u) => !checkedUsers.has(u.username));
    }

    return list.sort((a, b) => {
      const cmp = a.username.localeCompare(b.username);
      return sortAsc ? cmp : -cmp;
    });
  }, [users, search, sortAsc, hideChecked, checkedUsers]);

  // Copy all visible usernames
  const handleCopy = () => {
    const text = filteredUsers.map((u) => u.username).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download as text file
  const handleDownload = () => {
    const text = filteredUsers.map((u) => u.username).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `instagram_${categoryId}_${filteredUsers.length}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isUnfollowersTab = categoryId === 'notFollowingBack';

  return (
    <div className="space-y-4 px-4 sm:px-0">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${users.length} accounts...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setSortAsc(!sortAsc)}
            title="Toggle Sort (A-Z / Z-A)"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition text-xs flex items-center gap-1"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{sortAsc ? 'A-Z' : 'Z-A'}</span>
          </button>

          {isUnfollowersTab && (
            <button
              onClick={() => setHideChecked(!hideChecked)}
              className={`px-2.5 py-2 rounded-xl border text-xs flex items-center gap-1 transition ${
                hideChecked
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{hideChecked ? 'Hiding Checked' : 'Hide Checked'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy list"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition text-xs flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            title="Download TXT"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition text-xs flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Progress tracking if in Unfollowers tab */}
      {isUnfollowersTab && checkedUsers.size > 0 && (
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              <strong className="text-white">{checkedUsers.size}</strong> of{' '}
              <strong className="text-white">{users.length}</strong> marked as completed
            </span>
          </div>
          <button
            onClick={() => setCheckedUsers(new Set())}
            className="text-slate-400 hover:text-slate-200 underline text-[11px]"
          >
            Reset
          </button>
        </div>
      )}

      {/* List Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-200">{filteredUsers.length}</strong> {activeTabName}
        </span>
        {search && (
          <button onClick={() => setSearch('')} className="text-pink-400 hover:underline">
            Clear search
          </button>
        )}
      </div>

      {/* Users Virtual Grid / Cards */}
      <div className="space-y-2">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-slate-900/30 border border-slate-800/80">
            <p className="text-slate-400 text-sm">No accounts found.</p>
          </div>
        ) : (
          filteredUsers.map((u, index) => {
            const isChecked = checkedUsers.has(u.username);

            return (
              <div
                key={u.username}
                className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all ${
                  isChecked
                    ? 'bg-slate-950/40 border-slate-900 opacity-50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* User info */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Optional checkoff checkbox */}
                  {isUnfollowersTab && (
                    <button
                      onClick={() => toggleChecked(u.username)}
                      className="text-slate-500 hover:text-emerald-400 transition shrink-0"
                      title={isChecked ? 'Mark as not checked' : 'Mark as unfollowed'}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                      )}
                    </button>
                  )}

                  {/* Gradient Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-instagram-yellow/40 via-instagram-pink/40 to-instagram-purple/40 border border-slate-700/60 flex items-center justify-center font-bold text-xs text-white shrink-0 uppercase">
                    {u.username.slice(0, 2)}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`font-medium text-sm truncate ${
                        isChecked ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      @{u.username}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">#{index + 1}</p>
                  </div>
                </div>

                {/* Open Profile Button */}
                <a
                  href={`https://www.instagram.com/${u.username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-instagram-pink/15 to-instagram-purple/15 text-pink-400 hover:text-pink-300 border border-pink-500/30 hover:border-pink-500/60 transition shrink-0 active:scale-95"
                >
                  <span>Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
