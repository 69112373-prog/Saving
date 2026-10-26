/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { HomeView } from './views/HomeView';
import { TransactionsView } from './views/TransactionsView';
import { GoalsView } from './views/GoalsView';
import { ChallengesView } from './views/ChallengesView';
import { ProfileView } from './views/ProfileView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <MobileFrame>
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'transactions' && <TransactionsView />}
      {activeTab === 'goals' && <GoalsView />}
      {activeTab === 'challenges' && <ChallengesView />}
      {activeTab === 'profile' && <ProfileView />}
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
