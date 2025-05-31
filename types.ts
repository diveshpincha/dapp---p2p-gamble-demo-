
export interface Challenge {
  id: string;
  amount: number;
  creatorId: string; // For this simulation, will be a fixed ID for the primary user
}

export interface Player {
  id: string;
  name: string;
}

export interface GameResult {
  challengeAmount: number;
  creatorRoll: number;
  accepterRoll: number;
  winner: 'creator' | 'accepter' | 'tie';
  prizeWon: number; // Net amount won by the winner of this game instance
  platformFee: number;
}

export enum GamePlayer {
  Creator = 'creator',
  Accepter = 'accepter',
  Tie = 'tie'
}
