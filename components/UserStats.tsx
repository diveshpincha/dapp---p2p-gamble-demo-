
import React from 'react';
import { WalletIcon, TrophyIcon } from './icons';

interface UserStatsProps {
  userBalance: number;
  platformFeesCollected: number;
}

const UserStats: React.FC<UserStatsProps> = ({ userBalance, platformFeesCollected }) => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center text-lg">
        <WalletIcon className="text-sky-400 mr-3 h-7 w-7" />
        <span>Your Balance: </span>
        <span className="font-semibold text-sky-400 ml-2">{userBalance.toLocaleString()} units</span>
      </div>
      <div className="flex items-center text-lg">
        <TrophyIcon className="text-amber-400 mr-3 h-7 w-7" />
        <span>Platform Fees: </span>
        <span className="font-semibold text-amber-400 ml-2">{platformFeesCollected.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} units</span>
      </div>
    </div>
  );
};

export default UserStats;
