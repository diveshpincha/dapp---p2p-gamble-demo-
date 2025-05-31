
import React, { useState } from 'react';
import { MIN_BET_AMOUNT, MAX_BET_AMOUNT, MIN_CHALLENGES, MAX_CHALLENGES } from '../constants';

interface CreateChallengeFormProps {
  onCreateChallenges: (amount: number, count: number) => void;
  userBalance: number;
}

const CreateChallengeForm: React.FC<CreateChallengeFormProps> = ({ onCreateChallenges, userBalance }) => {
  const [amount, setAmount] = useState<string>(MIN_BET_AMOUNT.toString());
  const [count, setCount] = useState<string>(MIN_CHALLENGES.toString());
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseInt(amount, 10);
    const numCount = parseInt(count, 10);

    if (isNaN(numAmount) || numAmount < MIN_BET_AMOUNT || numAmount > MAX_BET_AMOUNT) {
      setError(`Bet amount must be between ${MIN_BET_AMOUNT} and ${MAX_BET_AMOUNT}.`);
      return;
    }
    if (isNaN(numCount) || numCount < MIN_CHALLENGES || numCount > MAX_CHALLENGES) {
      setError(`Number of challenges must be between ${MIN_CHALLENGES} and ${MAX_CHALLENGES}.`);
      return;
    }

    const totalCost = numAmount * numCount;
    if (totalCost > userBalance) {
      setError(`Insufficient balance. You need ${totalCost} units, but have ${userBalance}.`);
      return;
    }

    onCreateChallenges(numAmount, numCount);
    setAmount(MIN_BET_AMOUNT.toString()); // Reset form
    setCount(MIN_CHALLENGES.toString());
  };

  const totalCost = (parseInt(amount, 10) || 0) * (parseInt(count, 10) || 0);

  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-xl mb-8">
      <h2 className="text-2xl font-semibold text-sky-400 mb-6">Create New Challenges</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-1">
            Bet Amount per Challenge (units)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={MIN_BET_AMOUNT}
            max={MAX_BET_AMOUNT}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400"
            placeholder={`e.g., ${MIN_BET_AMOUNT}`}
          />
        </div>
        <div>
          <label htmlFor="count" className="block text-sm font-medium text-slate-300 mb-1">
            Number of Challenges
          </label>
          <input
            type="number"
            id="count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min={MIN_CHALLENGES}
            max={MAX_CHALLENGES}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400"
            placeholder={`e.g., ${MIN_CHALLENGES}`}
          />
        </div>
        <div className="text-sm text-slate-400">
          Total cost: <span className="font-semibold text-sky-300">{totalCost.toLocaleString()} units</span>
        </div>
        {error && <p className="text-sm text-red-400 bg-red-900/30 p-3 rounded-md">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition duration-150 ease-in-out"
        >
          Create Challenges
        </button>
      </form>
    </div>
  );
};

export default CreateChallengeForm;
