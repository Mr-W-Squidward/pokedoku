import { POKEMON } from "../constants/pokemon";
import { usePokemonSelect } from "../context/PokemonSelectContext";

export default function Sidebar() {
  const { tappedPokemon, setTappedPokemon } = usePokemonSelect();

  const handleDragStart = (event: React.DragEvent, name: string) => {
    event.dataTransfer.setData('pokemon', name);
    event.dataTransfer.effectAllowed = 'copy'; // drags a copy
  }

  const handleTap = (name: string) => {
    setTappedPokemon(tappedPokemon == name ? null : name);
  }

  return (
    <div className="h-[calc(9*3rem+8px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600">
      <div className="flex flex-col gap-1">
        {POKEMON.map(pokemon => {
          const isSelected = tappedPokemon === pokemon.name
          return (
            <div
              key={pokemon.id}
              draggable
              onDragStart={(event) => handleDragStart(event, pokemon.name)}
              onClick={() => handleTap(pokemon.name)}
              className={`flex items-center gap-2 p-1 rounded-md cursor-pointer
                ${tappedPokemon === pokemon.name ? 'bg-blue-900' : 'bg-[#1b2a3b]'} transition-colors duration-150`}
            >
              <div className={`rounded border-2 transition-colors ${isSelected ? 'border-blue-500' : 'border-gray-500'}`}>
                <img src={pokemon.image} alt={pokemon.name} width={25} height={25} draggable={false} className="block" />
              </div>
              <span className={`text-xs ${isSelected ? 'text-yellow-400' : 'text-gray-300'}`}>{pokemon.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}