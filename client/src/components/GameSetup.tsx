import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function GameSetup() {
  const [, setLocation] = useLocation();
  const { startGame, setIsRulesModalOpen } = useGameContext();
  const [playerCount, setPlayerCount] = useState(6);
  const [roleDistribution, setRoleDistribution] = useState({
    civilians: 4,
    undercover: 1,
    mrWhite: 1
  });
  const [useCustomNames, setUseCustomNames] = useState(false);
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  useEffect(() => {
    updateRoleDistribution(playerCount);
    
    // Initialize empty player names array with the correct length
    setPlayerNames(Array(playerCount).fill(''));
  }, [playerCount]);

  const updateRoleDistribution = (count: number) => {
    let undercover = 1;
    let mrWhite = 1;
    
    if (count >= 7 && count <= 10) {
      undercover = 2;
    } else if (count > 10) {
      undercover = 3;
    }
    
    const civilians = count - undercover - mrWhite;
    
    setRoleDistribution({
      civilians,
      undercover,
      mrWhite
    });
  };

  const decreasePlayers = () => {
    if (playerCount > 4) {
      setPlayerCount(playerCount - 1);
    }
  };

  const increasePlayers = () => {
    if (playerCount < 20) {
      setPlayerCount(playerCount + 1);
    }
  };

  // Update a specific player name
  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    // Use custom names if enabled, otherwise use empty array to get random names
    const names = useCustomNames ? playerNames.map((name, index) => name || `Player ${index + 1}`) : [];
    startGame(playerCount, roleDistribution, names);
    setLocation("/game");
  };

  return (
    <div className="max-w-lg mx-auto mb-8">
      <div className="bg-white dark:bg-neutral rounded-lg shadow-md p-6 mb-8">
        <h2 className="font-display font-bold text-2xl mb-4 text-center">New Game</h2>
        
        <div className="mb-6">
          <label htmlFor="player-count" className="block text-sm font-medium mb-1">Number of Players</label>
          <div className="flex space-x-2 items-center">
            <button 
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-light flex items-center justify-center"
              onClick={decreasePlayers}
              disabled={playerCount <= 4}
            >
              -
            </button>
            <span className="font-display font-bold text-xl mx-4">{playerCount}</span>
            <button 
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-light flex items-center justify-center"
              onClick={increasePlayers}
              disabled={playerCount >= 20}
            >
              +
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Min: 4 | Max: 20 Players</div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-lighter pt-5 mb-6">
          <h3 className="font-display font-semibold text-lg mb-3">Role Distribution</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 dark:bg-neutral-light rounded-lg p-3">
              <div className="font-display font-bold text-civilian">Civilians</div>
              <div id="civilian-count" className="text-2xl font-bold">{roleDistribution.civilians}</div>
            </div>
            <div className="bg-gray-50 dark:bg-neutral-light rounded-lg p-3">
              <div className="font-display font-bold text-undercover">Undercover</div>
              <div id="undercover-count" className="text-2xl font-bold">{roleDistribution.undercover}</div>
            </div>
            <div className="bg-gray-50 dark:bg-neutral-light rounded-lg p-3">
              <div className="font-display font-bold text-mrwhite">Mr. White</div>
              <div id="mrwhite-count" className="text-2xl font-bold">{roleDistribution.mrWhite}</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-neutral-lighter pt-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-lg">Player Names</h3>
            <div className="flex items-center space-x-2">
              <Switch 
                id="custom-names" 
                checked={useCustomNames}
                onCheckedChange={setUseCustomNames}
              />
              <Label htmlFor="custom-names" className="text-sm">
                Use Custom Names
              </Label>
            </div>
          </div>
          
          {useCustomNames && (
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-1">
              {playerNames.map((name, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input 
                    placeholder={`Player ${index + 1}`}
                    value={name}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          )}
          
          {!useCustomNames && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Random names will be generated for all players. Enable custom names to specify your own.
            </p>
          )}
        </div>

        <Button 
          className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-display font-bold rounded-lg transition-colors"
          onClick={handleStartGame}
        >
          Start Game
        </Button>
      </div>

      <div className="bg-white dark:bg-neutral rounded-lg shadow-md overflow-hidden">
        <Tabs defaultValue="howToPlay">
          <div className="flex bg-gray-50 dark:bg-neutral-light border-b border-gray-200 dark:border-neutral-lighter">
            <TabsList className="w-full">
              <TabsTrigger 
                value="howToPlay"
                className="flex-1 py-3 font-medium text-center border-b-2 font-display data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=inactive]:text-gray-500 data-[state=inactive]:dark:text-gray-400 data-[state=inactive]:border-transparent"
              >
                How to Play
              </TabsTrigger>
              <TabsTrigger 
                value="wordPairs"
                className="flex-1 py-3 font-medium text-center border-b-2 font-display data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=inactive]:text-gray-500 data-[state=inactive]:dark:text-gray-400 data-[state=inactive]:border-transparent"
              >
                Word Pairs
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="howToPlay" className="p-6 text-sm space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-neutral-light rounded-full flex items-center justify-center font-bold">1</div>
              <p>Each player is secretly assigned one of three roles: <span className="font-semibold text-civilian">Civilian</span>, <span className="font-semibold text-undercover">Undercover</span>, or <span className="font-semibold text-mrwhite">Mr. White</span>.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-neutral-light rounded-full flex items-center justify-center font-bold">2</div>
              <p>Civilians get a secret word, Undercover agents get a slightly different word, and Mr. White gets no word at all.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-neutral-light rounded-full flex items-center justify-center font-bold">3</div>
              <p>Players take turns describing their word without revealing it. Mr. White must bluff to avoid being caught.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-neutral-light rounded-full flex items-center justify-center font-bold">4</div>
              <p>After discussion, players vote to eliminate someone. If Mr. White is eliminated, they get one chance to guess the Civilian word to win!</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-neutral-light rounded-full flex items-center justify-center font-bold">5</div>
              <p>Civilians win if all Undercovers and Mr. White are eliminated. Undercovers win if they are the last ones standing. Mr. White wins by guessing correctly or surviving to final 2.</p>
            </div>
            
            <Button
              variant="link"
              className="text-primary mt-2"
              onClick={() => setIsRulesModalOpen(true)}
            >
              See Complete Rules
            </Button>
          </TabsContent>
          
          <TabsContent value="wordPairs" className="p-6">
            <p className="text-sm mb-4">The game uses word pairs that are similar but different. Here are some examples:</p>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 dark:bg-neutral-light p-2 rounded flex justify-between">
                <span className="text-civilian font-medium">Apple</span>
                <span className="text-undercover font-medium">Banana</span>
              </div>
              <div className="bg-gray-50 dark:bg-neutral-light p-2 rounded flex justify-between">
                <span className="text-civilian font-medium">Cat</span>
                <span className="text-undercover font-medium">Dog</span>
              </div>
              <div className="bg-gray-50 dark:bg-neutral-light p-2 rounded flex justify-between">
                <span className="text-civilian font-medium">Ocean</span>
                <span className="text-undercover font-medium">Lake</span>
              </div>
              <div className="bg-gray-50 dark:bg-neutral-light p-2 rounded flex justify-between">
                <span className="text-civilian font-medium">Guitar</span>
                <span className="text-undercover font-medium">Piano</span>
              </div>
              <div className="bg-gray-50 dark:bg-neutral-light p-2 rounded flex justify-between">
                <span className="text-civilian font-medium">Sun</span>
                <span className="text-undercover font-medium">Moon</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
