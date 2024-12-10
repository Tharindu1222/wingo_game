import React, { useState, useEffect, useMemo } from 'react';
import { Timer } from './components/Timer';
import { GameHistoryComponent } from './components/GameHistory';
import { BettingOptions } from './components/BettingOptions';
import { BettingControls } from './components/BettingControls';
import { LuckyNumber } from './components/LuckyNumber';
import { UserStats } from './components/UserStats';
import { BettingHistory } from './components/BettingHistory';
import { useGameStore } from './store/gameStore';
import { useGameSounds } from './hooks/useGameSounds';
import type { GameState, Bet, GameHistory } from './types/game';
import { generateRandomNumber, getColorForNumber } from './utils/gameLogic';
import { BettingBoard } from './components/BettingBoard';

const ROUND_DURATION = 30;

function App() {
  const { placeBet, processBetResult } = useGameStore();
  const { playBet, playWin, playLose, playTick } = useGameSounds();
  
  const [gameState, setGameState] = useState<GameState>({
    currentPeriod: 1,
    timeRemaining: ROUND_DURATION,
    lastResults: [],
    isAcceptingBets: true,
  });

  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1);

  // Memoize the current result to prevent unnecessary re-renders
  const currentResult = useMemo(() => 
    gameState.lastResults[0] || { result: null, color: null },
    [gameState.lastResults]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev) => {
        const newTimeRemaining = prev.timeRemaining - 1;
        
        if (newTimeRemaining <= 5 && newTimeRemaining > 0) {
          playTick();
        }
        
        if (newTimeRemaining <= 0) {
          const result = generateRandomNumber();
          
          // Process bet results outside of setState
          setTimeout(() => {
            processBetResult(result);
            const hadWinningBets = true; // This should be calculated based on actual bets
            if (hadWinningBets) {
              playWin();
            } else {
              playLose();
            }
          }, 0);
          
          const newHistory: GameHistory = {
            period: prev.currentPeriod,
            result,
            timestamp: new Date(),
            color: getColorForNumber(result),
          };

          return {
            currentPeriod: prev.currentPeriod + 1,
            timeRemaining: ROUND_DURATION,
            lastResults: [newHistory, ...prev.lastResults].slice(0, 10),
            isAcceptingBets: true,
          };
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
          isAcceptingBets: newTimeRemaining > 5,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playTick, playWin, playLose, processBetResult]);

  const handlePlaceBet = (bet: Bet) => {
    if (!gameState.isAcceptingBets) return;
    placeBet(bet);
    playBet();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hidden-Treasure-Pflugerville</h1>
          <p className="text-gray-600">Place your bets and test your luck!</p>
        </div>

        <UserStats />

        <Timer
          timeRemaining={gameState.timeRemaining}
          isAcceptingBets={gameState.isAcceptingBets}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
          <BettingBoard onPlaceBet={handlePlaceBet} disabled={!gameState.isAcceptingBets} />
            <BettingControls
              betAmount={betAmount}
              onBetAmountChange={setBetAmount}
              multiplier={multiplier}
              onMultiplierChange={setMultiplier}
            />
            <BettingOptions
              onPlaceBet={handlePlaceBet}
              betAmount={betAmount}
              multiplier={multiplier}
              disabled={!gameState.isAcceptingBets}
            />
            <BettingHistory />
          </div>
          <div className="space-y-6">
            <LuckyNumber
              number={currentResult.result}
              color={currentResult.color}
            />
            <GameHistoryComponent history={gameState.lastResults} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;