import { create } from 'zustand';
import { calculatePayout } from '../utils/gameLogic';
import type { Bet, GameHistory } from '../types/game';

interface GameStore {
  balance: number;
  bettingHistory: Bet[];
  winnings: number;
  placeBet: (bet: Bet) => void;
  processBetResult: (result: number) => void;
  addFunds: (amount: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  balance: 1000,
  bettingHistory: [],
  winnings: 0,
  
  placeBet: (bet: Bet) => {
    if (get().balance < bet.amount) return;
    
    set((state) => ({
      balance: state.balance - bet.amount,
      bettingHistory: [bet, ...state.bettingHistory].slice(0, 10),
    }));
  },
  
  processBetResult: (result: number) => {
    set((state) => {
      const totalWinnings = state.bettingHistory.reduce((acc, bet) => {
        const payout = calculatePayout(bet, result);
        return acc + payout;
      }, 0);

      return {
        balance: state.balance + totalWinnings,
        winnings: state.winnings + totalWinnings,
        bettingHistory: [], // Clear betting history after processing
      };
    });
  },
  
  addFunds: (amount: number) => set((state) => ({
    balance: state.balance + amount,
  })),
}));