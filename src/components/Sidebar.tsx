import { POKEMON } from "../constants/pokemon";

export default function Sidebar() {
  const handleDragStart = (event: React.DragEvent, name: string) => {
    event.dataTransfer.setData('pokemon', name);
    event.dataTransfer.effectAllowed = 'copy'; // drags a copy
  }

  return (
    <div>
      <div>
        {POKEMON.map(pokemon => (
          <div
            key={pokemon.id}
            draggable
            onDragStart={(event) => handleDragStart(event, pokemon.name)}
          >
            <img src={pokemon.image} alt={pokemon.name} width={25} height={25} />
            <span>{pokemon.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}