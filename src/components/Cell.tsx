import { POKEMON } from "../constants/pokemon";

interface Props {
  value: number
  locked: boolean
  selected: boolean
  highlighted: boolean
  sameValue: boolean
  onSelect: () => void
  onDrop: (pokemonName: string) => void
}

export default function Cell({ value, locked, selected, highlighted, sameValue, onSelect, onDrop }: Props) {
  const pokemon = value > 0 ? POKEMON.find(p => p.id === value) : null

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // allow dropping
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const name = event.dataTransfer.getData('pokemon')
    if (name) onDrop(name)
  }

  let bg = 'bg-[#1b2a3b]'
  if (selected) bg = 'bg-blue-900' // all instances of pokemon
  else if (sameValue && value > 0) bg = 'bg-blue-950' // selected is lighter
  else if (highlighted) bg = 'bg-#1f3040'

  return (
    <div
      className={`w-12 h-12 border border-gray-700 flex items-center justify-center 
        ${locked && value > 0 ? 'cursor-not-allowed' : 'cursor-pointer'} ${bg}`}
      onClick={onSelect}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {pokemon && <img src={pokemon.image} alt={pokemon.name} width={25} height={25} />}
    </div>
  )
}