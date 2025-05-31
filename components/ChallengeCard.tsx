
import React from 'react';
import { Challenge } from '../types';
import { DiceIcon } from './icons';

interface ChallengeCardProps {
  challenge: Challenge;
  onAcceptChallenge: (challengeId: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onAcceptChallenge }) => {
  return (
    <div className="bg-slate-800 p-5 rounded-lg shadow-lg hover:shadow-sky-500/30 transition-shadow duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-3">
          <DiceIcon className="text-green-400 mr-2 h-5 w-5" />
          <h3 className="text-lg font-semibold text-slate-100">
            Bet: <span className="text-green-400">{challenge.amount.toLocaleString()} units</span>
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">ID: {challenge.id.substring(0,12)}...</p>
      </div>
      <button
        onClick={() => onAcceptChallenge(challenge.id)}
        className="w-full mt-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition duration-150 ease-in-out"
      >
        Accept Challenge
      </button>
    </div>
  );
};

export default ChallengeCard;
