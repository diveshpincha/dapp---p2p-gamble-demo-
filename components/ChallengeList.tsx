
import React from 'react';
import { Challenge } from '../types';
import ChallengeCard from './ChallengeCard';

interface ChallengeListProps {
  challenges: Challenge[];
  onAcceptChallenge: (challengeId: string) => void;
}

const ChallengeList: React.FC<ChallengeListProps> = ({ challenges, onAcceptChallenge }) => {
  if (challenges.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-400 text-lg">No active challenges. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-sky-400 mb-6">Active Challenges</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onAcceptChallenge={onAcceptChallenge}
          />
        ))}
      </div>
    </div>
  );
};

export default ChallengeList;
