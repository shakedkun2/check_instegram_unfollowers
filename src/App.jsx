import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import StatsOverview from './components/StatsOverview';
import UserList from './components/UserList';

export default function App() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('notFollowingBack');

  const tabLabels = {
    notFollowingBack: "Users Not Following You Back",
    allFollowing: "Accounts You Follow",
    allFollowers: "Accounts Following You",
  };

  const currentUsers = data ? data[activeTab] || [] : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-10">
      <Header hasData={!!data} onReset={() => setData(null)} />

      <main className="flex-1 max-w-4xl w-full mx-auto py-6 sm:py-8">
        {!data ? (
          <FileUpload onDataLoaded={(result) => setData(result)} />
        ) : (
          <div className="space-y-6 sm:space-y-8">
            <StatsOverview
              stats={data.stats}
              activeTab={activeTab}
              onSelectTab={(tabId) => setActiveTab(tabId)}
            />

            <UserList
              users={currentUsers}
              activeTabName={tabLabels[activeTab]}
              categoryId={activeTab}
            />
          </div>
        )}
      </main>
    </div>
  );
}
