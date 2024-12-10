export interface Bet {
  type: 'number' | 'color' | 'range';
  value: string | number;
  amount: number;
  multiplier: number;
}

export interface GameHistory {
  period: number;
  result: number;
  timestamp: Date;
  color: 'red' | 'green';
}

export interface GameState {
  currentPeriod: number;
  timeRemaining: number;
  lastResults: GameHistory[];
  isAcceptingBets: boolean;
}