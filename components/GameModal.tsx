
import React from 'react';
import { GameResult, GamePlayer } from '../types';
import { DiceIcon, TrophyIcon, CloseIcon } from './icons';

interface GameModalProps {
  result: GameResult | null;
  onClose: () => void;
  primaryUserId: string; // To determine if "You" won or lost
}

const GameModal: React.FC<GameModalProps> = ({ result, onClose, primaryUserId }) => {
  if (!result) return null;

  const { challengeAmount, creatorRoll, accepterRoll, winner, prizeWon, platformFee } = result;

  let title = "";
  let message = "";
  let titleColor = "text-slate-100";

  if (winner === GamePlayer.Tie) {
    title = "It's a Tie!";
    message = `Both players rolled ${creatorRoll}. Bets are returned.`;
    titleColor = "text-yellow-400";
  } else {
    const primaryUserWon = winner === GamePlayer.Creator; // Assuming creator is the primary user
    if (primaryUserWon) {
      title = "Congratulations, You Won!";
      message = `You won ${prizeWon.toLocaleString()} units (after ${platformFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} units fee).`;
      titleColor = "text-green-400";
    } else {
      title = "Better Luck Next Time!";
      message = `Your opponent won. The prize was ${prizeWon.toLocaleString()} units (after ${platformFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} units fee).`;
      titleColor = "text-red-400";
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl sm:text-3xl font-bold ${titleColor}`}>{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon className="h-7 w-7" />
          </button>
        </div>

        <div className="space-y-5 text-sm sm:text-base">
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-slate-300">Challenge Amount: <span className="font-semibold text-sky-300">{challengeAmount.toLocaleString()} units</span></p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <p className="text-slate-300 mb-1">Your Roll (Creator)</p>
              <div className="flex items-center justify-center text-3xl font-bold text-sky-300">
                <DiceIcon className="mr-2 h-7 w-7"/> 
                {creatorRoll}
              </div>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <p className="text-slate-300 mb-1">Opponent's Roll</p>
              <div className="flex items-center justify-center text-3xl font-bold text-pink-400">
                 <DiceIcon className="mr-2 h-7 w-7"/>
                 {accepterRoll}
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${winner === GamePlayer.Creator ? 'bg-green-800/30' : winner === GamePlayer.Accepter ? 'bg-red-800/30' : 'bg-yellow-800/30'}`}>
            <p className="text-slate-200 font-medium">{message}</p>
            {winner !== GamePlayer.Tie && (
              <p className="text-xs text-slate-400 mt-1">
                (Total prize pool: {(challengeAmount * 2).toLocaleString()} units, Platform fee: {platformFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} units)
              </p>
            )}
          </div>

        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full px-4 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition duration-150"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};

export default GameModal;
