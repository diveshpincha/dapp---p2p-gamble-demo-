
import React, { useState, useCallback, useEffect } from 'react';
import { Challenge, GameResult, GamePlayer } from './types';
import { PLATFORM_FEE_PERCENTAGE, DICE_MIN_ROLL, DICE_MAX_ROLL, PRIMARY_USER_ID, INITIAL_USER_BALANCE } from './constants';
import CreateChallengeForm from './components/CreateChallengeForm';
import ChallengeList from './components/ChallengeList';
import GameModal from './components/GameModal';
import UserStats from './components/UserStats';
import { DiceIcon } from './components/icons';

// Helper function to generate unique IDs
const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

// Helper function for dice roll
const rollDice = (): number => Math.floor(Math.random() * (DICE_MAX_ROLL - DICE_MIN_ROLL + 1)) + DICE_MIN_ROLL;

const App: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userBalance, setUserBalance] = useState<number>(INITIAL_USER_BALANCE);
  const [platformFeesCollected, setPlatformFeesCollected] = useState<number>(0);
  const [activeGameResult, setActiveGameResult] = useState<GameResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // For simulating async operations

  // Load initial state from localStorage if available (optional persistence)
  useEffect(() => {
    const savedBalance = localStorage.getItem('userBalance');
    const savedFees = localStorage.getItem('platformFees');
    const savedChallenges = localStorage.getItem('challenges');

    if (savedBalance) setUserBalance(parseFloat(savedBalance));
    if (savedFees) setPlatformFeesCollected(parseFloat(savedFees));
    if (savedChallenges) setChallenges(JSON.parse(savedChallenges));
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('userBalance', userBalance.toString());
    localStorage.setItem('platformFees', platformFeesCollected.toString());
    localStorage.setItem('challenges', JSON.stringify(challenges));
  }, [userBalance, platformFeesCollected, challenges]);


  const handleCreateChallenges = useCallback((amount: number, count: number) => {
    setIsLoading(true);
    setTimeout(() => { // Simulate network delay
      const totalCost = amount * count;
      if (userBalance >= totalCost) {
        const newChallenges: Challenge[] = [];
        for (let i = 0; i < count; i++) {
          newChallenges.push({
            id: generateId(),
            amount: amount,
            creatorId: PRIMARY_USER_ID,
          });
        }
        setChallenges(prev => [...prev, ...newChallenges]);
        setUserBalance(prev => prev - totalCost);
      } else {
        // This case should be handled by form validation, but as a safeguard:
        alert("Error: Insufficient balance."); 
      }
      setIsLoading(false);
    }, 500);
  }, [userBalance]);

  const handleAcceptChallenge = useCallback((challengeId: string) => {
    setIsLoading(true);
    setTimeout(() => { // Simulate network delay & game resolution
      const challengeToAccept = challenges.find(c => c.id === challengeId);
      if (!challengeToAccept) {
        alert("Error: Challenge not found.");
        setIsLoading(false);
        return;
      }

      // Simulate accepter paying (not affecting primary user's balance directly at this stage)
      // This would be a transaction on a real platform

      const creatorRoll = rollDice();
      const accepterRoll = rollDice();
      
      let gameResult: GameResult;

      if (creatorRoll > accepterRoll) { // Creator wins
        const prizePool = challengeToAccept.amount * 2;
        const fee = prizePool * PLATFORM_FEE_PERCENTAGE;
        const winnings = prizePool - fee;
        
        setUserBalance(prev => prev + winnings); // Creator gets the prize pool minus fee
        setPlatformFeesCollected(prev => prev + fee);
        
        gameResult = {
          challengeAmount: challengeToAccept.amount,
          creatorRoll,
          accepterRoll,
          winner: GamePlayer.Creator,
          prizeWon: winnings, 
          platformFee: fee,
        };
      } else if (accepterRoll > creatorRoll) { // Accepter wins
        const prizePool = challengeToAccept.amount * 2;
        const fee = prizePool * PLATFORM_FEE_PERCENTAGE;
        const winningsForAccepter = prizePool - fee;

        // Creator (primary user) loses their initial bet, balance already reduced when challenge was created.
        setPlatformFeesCollected(prev => prev + fee);

        gameResult = {
          challengeAmount: challengeToAccept.amount,
          creatorRoll,
          accepterRoll,
          winner: GamePlayer.Accepter,
          prizeWon: winningsForAccepter, // Accepter gets this
          platformFee: fee,
        };
      } else { // Tie
        // Return bet to creator
        setUserBalance(prev => prev + challengeToAccept.amount);
        // Accepter's bet is also returned (simulated)
        
        gameResult = {
          challengeAmount: challengeToAccept.amount,
          creatorRoll,
          accepterRoll,
          winner: GamePlayer.Tie,
          prizeWon: challengeToAccept.amount, // effectively their bet back
          platformFee: 0,
        };
      }
      
      setActiveGameResult(gameResult);
      setChallenges(prev => prev.filter(c => c.id !== challengeId));
      setIsLoading(false);
    }, 1000);
  }, [challenges, platformFeesCollected]);

  const handleCloseModal = () => {
    setActiveGameResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-8">
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500"></div>
        </div>
      )}
      <header className="w-full max-w-5xl mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <DiceIcon className="h-10 w-10 text-sky-400 mr-3" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
            P2P Dice Roll Challenge
          </h1>
        </div>
        <p className="text-slate-400 text-sm sm:text-base">Create or accept dice roll challenges. Highest roll wins!</p>
      </header>

      <main className="w-full max-w-5xl space-y-10">
        <UserStats userBalance={userBalance} platformFeesCollected={platformFeesCollected} />
        <CreateChallengeForm onCreateChallenges={handleCreateChallenges} userBalance={userBalance} />
        <ChallengeList challenges={challenges} onAcceptChallenge={handleAcceptChallenge} />
      </main>

      <GameModal result={activeGameResult} onClose={handleCloseModal} primaryUserId={PRIMARY_USER_ID} />
      
      <footer className="w-full max-w-5xl mt-12 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Dice Roll Sim. For demonstration purposes only.</p>
        <p>This is a frontend simulation. No real gambling or currency involved.</p>
      </footer>
    </div>
  );
};

export default App;
