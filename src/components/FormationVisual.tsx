import React from 'react';
import { Users } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  position: string;
}

interface FormationVisualProps {
  formation: string;
  players: Player[];
  onPlayerClick?: (player: Player) => void;
  editable?: boolean;
}

const FORMATIONS: Record<string, Array<{
  position: string;
  x: number;
  y: number;
  label: string;
}>> = {
  '4-4-2': [
    { position: 'GK', x: 50, y: 95, label: 'GK' },
    { position: 'LB', x: 15, y: 75, label: 'LB' },
    { position: 'CB', x: 35, y: 75, label: 'CB' },
    { position: 'CB', x: 65, y: 75, label: 'CB' },
    { position: 'RB', x: 85, y: 75, label: 'RB' },
    { position: 'LM', x: 15, y: 50, label: 'LM' },
    { position: 'CM', x: 35, y: 50, label: 'CM' },
    { position: 'CM', x: 65, y: 50, label: 'CM' },
    { position: 'RM', x: 85, y: 50, label: 'RM' },
    { position: 'ST', x: 35, y: 20, label: 'ST' },
    { position: 'ST', x: 65, y: 20, label: 'ST' },
  ],
  '4-3-3': [
    { position: 'GK', x: 50, y: 95, label: 'GK' },
    { position: 'LB', x: 15, y: 75, label: 'LB' },
    { position: 'CB', x: 35, y: 75, label: 'CB' },
    { position: 'CB', x: 65, y: 75, label: 'CB' },
    { position: 'RB', x: 85, y: 75, label: 'RB' },
    { position: 'CDM', x: 50, y: 60, label: 'CDM' },
    { position: 'CM', x: 30, y: 50, label: 'CM' },
    { position: 'CM', x: 70, y: 50, label: 'CM' },
    { position: 'LW', x: 15, y: 20, label: 'LW' },
    { position: 'ST', x: 50, y: 15, label: 'ST' },
    { position: 'RW', x: 85, y: 20, label: 'RW' },
  ],
  '4-2-3-1': [
    { position: 'GK', x: 50, y: 95, label: 'GK' },
    { position: 'LB', x: 15, y: 75, label: 'LB' },
    { position: 'CB', x: 35, y: 75, label: 'CB' },
    { position: 'CB', x: 65, y: 75, label: 'CB' },
    { position: 'RB', x: 85, y: 75, label: 'RB' },
    { position: 'CDM', x: 35, y: 60, label: 'CDM' },
    { position: 'CDM', x: 65, y: 60, label: 'CDM' },
    { position: 'LM', x: 15, y: 40, label: 'LM' },
    { position: 'CAM', x: 50, y: 35, label: 'CAM' },
    { position: 'RM', x: 85, y: 40, label: 'RM' },
    { position: 'ST', x: 50, y: 15, label: 'ST' },
  ],
  '3-5-2': [
    { position: 'GK', x: 50, y: 95, label: 'GK' },
    { position: 'CB', x: 25, y: 75, label: 'CB' },
    { position: 'CB', x: 50, y: 75, label: 'CB' },
    { position: 'CB', x: 75, y: 75, label: 'CB' },
    { position: 'LWB', x: 10, y: 55, label: 'LWB' },
    { position: 'CM', x: 30, y: 50, label: 'CM' },
    { position: 'CM', x: 50, y: 50, label: 'CM' },
    { position: 'CM', x: 70, y: 50, label: 'CM' },
    { position: 'RWB', x: 90, y: 55, label: 'RWB' },
    { position: 'ST', x: 35, y: 20, label: 'ST' },
    { position: 'ST', x: 65, y: 20, label: 'ST' },
  ],
  '5-3-2': [
    { position: 'GK', x: 50, y: 95, label: 'GK' },
    { position: 'LWB', x: 10, y: 75, label: 'LWB' },
    { position: 'CB', x: 28, y: 75, label: 'CB' },
    { position: 'CB', x: 50, y: 75, label: 'CB' },
    { position: 'CB', x: 72, y: 75, label: 'CB' },
    { position: 'RWB', x: 90, y: 75, label: 'RWB' },
    { position: 'CM', x: 30, y: 50, label: 'CM' },
    { position: 'CM', x: 50, y: 50, label: 'CM' },
    { position: 'CM', x: 70, y: 50, label: 'CM' },
    { position: 'ST', x: 35, y: 20, label: 'ST' },
    { position: 'ST', x: 65, y: 20, label: 'ST' },
  ],
  '3-4-3': [
    { position: 'GK', x: 50, y: 95, label: 'GK' },
    { position: 'CB', x: 25, y: 75, label: 'CB' },
    { position: 'CB', x: 50, y: 75, label: 'CB' },
    { position: 'CB', x: 75, y: 75, label: 'CB' },
    { position: 'LM', x: 15, y: 50, label: 'LM' },
    { position: 'CM', x: 40, y: 50, label: 'CM' },
    { position: 'CM', x: 60, y: 50, label: 'CM' },
    { position: 'RM', x: 85, y: 50, label: 'RM' },
    { position: 'LW', x: 20, y: 20, label: 'LW' },
    { position: 'ST', x: 50, y: 15, label: 'ST' },
    { position: 'RW', x: 80, y: 20, label: 'RW' },
  ],
};

const FormationVisual: React.FC<FormationVisualProps> = ({
  formation,
  players,
  onPlayerClick,
  editable = false,
}) => {
  const formationPositions = FORMATIONS[formation] || FORMATIONS['4-4-2'];

  const getPlayerForPosition = (positionIndex: number): Player | null => {
    return players[positionIndex] || null;
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-green-900 via-green-800 to-green-900 rounded-xl overflow-hidden">
      <div className="relative aspect-[2/3]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/2 w-32 h-20 border-2 border-white rounded-b-full transform -translate-x-1/2" />

          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white transform -translate-y-1/2" />

          <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />

          <div className="absolute bottom-0 left-1/2 w-32 h-20 border-2 border-white rounded-t-full transform -translate-x-1/2" />
        </div>

        {formationPositions.map((pos, index) => {
          const player = getPlayerForPosition(index);

          return (
            <div
              key={`${pos.position}-${index}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
            >
              <button
                onClick={() => player && onPlayerClick?.(player)}
                disabled={!editable && !player}
                className={`group relative flex flex-col items-center ${
                  editable || player ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex flex-col items-center justify-center border-2 transition-all ${
                    player
                      ? 'bg-blue-600 border-white hover:bg-blue-500 hover:scale-110'
                      : 'bg-gray-600 border-gray-400 hover:bg-gray-500'
                  }`}
                >
                  {player ? (
                    <div className="text-center">
                      <div className="text-white text-xs font-bold leading-none">
                        #{player.jerseyNumber}
                      </div>
                      <div className="text-white text-[10px] leading-none mt-0.5">
                        {pos.label}
                      </div>
                    </div>
                  ) : (
                    <Users className="text-gray-300" size={20} />
                  )}
                </div>

                {player && (
                  <div className="mt-2 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {player.name}
                  </div>
                )}

                {!player && editable && (
                  <div className="mt-2 text-gray-300 text-xs">
                    {pos.label}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="absolute top-2 left-2 bg-black bg-opacity-70 px-3 py-1 rounded-full">
        <span className="text-white text-sm font-bold">{formation}</span>
      </div>

      <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-3 py-1 rounded-full">
        <span className="text-white text-sm font-medium">
          {players.length} / {formationPositions.length}
        </span>
      </div>
    </div>
  );
};

export default FormationVisual;
