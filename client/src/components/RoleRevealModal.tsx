import { useState, useEffect } from "react";
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

export function RoleRevealModal() {
  const { 
    gameState, 
    currentPlayerRole,
    currentPlayerName, 
    currentPlayerWord, 
    closeRoleRevealModal,
    setIsRulesModalOpen
  } = useGameContext();

  const [roleColor, setRoleColor] = useState("bg-civilian");
  const [textColor, setTextColor] = useState("text-civilian");
  
  useEffect(() => {
    if (currentPlayerRole === "Civilian") {
      setRoleColor("bg-civilian");
      setTextColor("text-civilian");
    } else if (currentPlayerRole === "Undercover") {
      setRoleColor("bg-undercover");
      setTextColor("text-undercover");
    } else if (currentPlayerRole === "Mr. White") {
      setRoleColor("bg-mrwhite");
      setTextColor("text-mrwhite");
    }
  }, [currentPlayerRole]);

  const handleShowRules = () => {
    closeRoleRevealModal();
    setIsRulesModalOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-neutral-dark max-w-md w-full mx-4 rounded-lg overflow-hidden shadow-xl animate-slide-in">
        <div className="p-6 text-center">
          <h3 className="font-display font-bold text-2xl mb-1">{currentPlayerName}'s Role</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Don't show this to other players!</p>
          <div className="py-8">
            <div className={`w-24 h-24 mx-auto ${roleColor} rounded-full flex items-center justify-center mb-4`}>
              <span className="text-white font-display font-bold text-xl">{currentPlayerRole}</span>
            </div>
            <div className={`font-display font-bold text-3xl mb-1 ${textColor}`}>{currentPlayerRole}</div>
            
            {currentPlayerRole !== "Mr. White" ? (
              <>
                <div className="text-lg mb-4">Your secret word is:</div>
                <div className="text-3xl font-display font-bold bg-gray-100 dark:bg-neutral py-4 rounded-lg mb-6">
                  {currentPlayerWord}
                </div>
              </>
            ) : (
              <div className="text-lg mb-6 py-4">
                You don't have a word. Listen carefully and try to figure out what others are describing!
              </div>
            )}
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {currentPlayerRole === "Civilian" && "Remember your word, but don't reveal it directly! Describe it in a way that other Civilians will understand, but Undercover agents and Mr. White won't catch on."}
              {currentPlayerRole === "Undercover" && "Your word is similar to the Civilians' word. Blend in with them while trying to identify other Undercover players."}
              {currentPlayerRole === "Mr. White" && "You need to bluff! Listen carefully to what others say and try to guess what word they're describing."}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10 font-display font-medium"
              onClick={handleShowRules}
            >
              Show Rules
            </Button>
            <Button 
              className="bg-primary hover:bg-primary-dark text-white font-display font-medium"
              onClick={closeRoleRevealModal}
            >
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
