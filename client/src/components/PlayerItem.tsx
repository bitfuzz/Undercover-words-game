import { useGameContext } from "@/context/GameContext";

interface PlayerItemProps {
  player: {
    id: string;
    name: string;
    role: string;
    word?: string;
    isEliminated: boolean;
    color: string;
  };
  onClick: () => void;
}

export function PlayerItem({ player, onClick }: PlayerItemProps) {
  const { setSelectedPlayerForElimination, openEliminationModal } = useGameContext();
  
  const initials = player.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  
  const handleClick = () => {
    if (!player.isEliminated) {
      setSelectedPlayerForElimination(player.id);
      openEliminationModal();
    }
  };

  const roleColor = player.role === "Civilian" 
    ? "text-civilian" 
    : player.role === "Undercover" 
      ? "text-undercover" 
      : "text-mrwhite";
  
  return (
    <div 
      className={`player-item flex items-center p-3 border border-gray-200 dark:border-neutral-lighter rounded-lg cursor-pointer ${
        player.isEliminated ? 'bg-gray-100 dark:bg-neutral-light opacity-75' : ''
      }`}
      onClick={handleClick}
    >
      <div className={`w-10 h-10 rounded-full bg-${player.color} text-white flex items-center justify-center font-bold mr-3`}>
        {initials}
      </div>
      <div className="flex-grow">
        <div className={`font-medium ${player.isEliminated ? 'line-through' : ''}`}>{player.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {player.isEliminated 
            ? `Player ${player.id.split('-')[0]} - ${player.role}` 
            : `Player ${player.id.split('-')[0]}`}
        </div>
      </div>
      <div className={`w-3 h-3 rounded-full ${player.isEliminated ? 'bg-red-500' : 'bg-green-500'}`}></div>
    </div>
  );
}
