import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RulesModalProps {
  onClose: () => void;
}

export function RulesModal({ onClose }: RulesModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-neutral max-w-2xl w-full mx-4 rounded-lg overflow-hidden shadow-xl animate-slide-in">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-neutral-lighter">
          <h3 className="font-display font-bold text-xl">Game Rules</h3>
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h4 className="font-display font-semibold text-lg mb-2">Overview</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Undercover is a hidden-role social deduction game for 4–20 players. Each player is secretly assigned one of three roles: Civilian, Undercover, or Mr. White. The objective varies by role.
              </p>
            </div>
            
            <div>
              <h4 className="font-display font-semibold text-lg mb-2">Roles</h4>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-neutral-light p-3 rounded-lg">
                  <div className="font-medium text-civilian mb-1">Civilian</div>
                  <p className="text-sm">The majority role. Civilians know the secret word and must figure out who the Undercover and Mr. White players are.</p>
                </div>
                <div className="bg-gray-50 dark:bg-neutral-light p-3 rounded-lg">
                  <div className="font-medium text-undercover mb-1">Undercover</div>
                  <p className="text-sm">Knows a slightly different word from the civilian word. Tries to avoid suspicion and eliminate civilians.</p>
                </div>
                <div className="bg-gray-50 dark:bg-neutral-light p-3 rounded-lg">
                  <div className="font-medium text-mrwhite mb-1">Mr. White</div>
                  <p className="text-sm">Receives no word at all. Must pretend to know the word and deceive others. Wins if they survive to the final 2 players or correctly guess the civilian word when eliminated.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-display font-semibold text-lg mb-2">Gameplay</h4>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Players take turns giving a one-word clue about their word.</li>
                <li>After discussion, players vote to eliminate someone they suspect.</li>
                <li>The eliminated player's role is revealed.</li>
                <li>If Mr. White is eliminated, they get one chance to guess the civilian word to win.</li>
                <li>Continue until a victory condition is met.</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-display font-semibold text-lg mb-2">Victory Conditions</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li><span className="font-medium text-civilian">Civilians Win:</span> When all Undercover and Mr. White players are eliminated.</li>
                <li><span className="font-medium text-undercover">Undercover Win:</span> When they equal or outnumber the remaining players.</li>
                <li><span className="font-medium text-mrwhite">Mr. White Wins:</span> If they guess the civilian word when eliminated OR survive to the final two players.</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-semibold text-lg mb-2">Tips</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li><span className="font-medium">Civilians:</span> Give clues that other civilians will understand, but not too obvious.</li>
                <li><span className="font-medium">Undercover:</span> Listen carefully and try to blend in with civilians.</li>
                <li><span className="font-medium">Mr. White:</span> Pay attention to patterns in other players' clues to guess the possible word.</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 dark:border-neutral-lighter bg-gray-50 dark:bg-neutral-light">
          <Button 
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-display font-medium"
            onClick={onClose}
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
