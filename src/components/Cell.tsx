import { POKEMON } from "../constants/pokemon";

interface Props {
  value: number
  locked: boolean
  selected: boolean
  highlighted: boolean
  sameValue: boolean
  mistake: boolean
  extraBorder: boolean
  onSelect: () => void
  onDrop: (pokemonName: string) => void
}

export default function Cell({ value, locked, selected, highlighted, sameValue, mistake, extraBorder, onSelect, onDrop }: Props) {
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
  if (mistake) bg = 'bg-red-900'
  else if (selected) bg = 'bg-blue-900' // all instances of pokemon
  else if (sameValue) bg = 'bg-blue-950' // selected is lighter
  else if (highlighted) bg = 'bg-#1f3040'
  else if (locked && value > 0) bg = 'bg-[#1b2535]' // locked and has pokemon

  return (
    <div
      className={`w-12 h-12 border border-gray-700 flex items-center justify-center 
        ${locked && value > 0 ? 'cursor-default' : 'cursor-pointer'} ${bg} ${extraBorder} transition-colors duration-150`}
      onClick={onSelect}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {pokemon && <img src={pokemon.image} alt={pokemon.name} width={32} height={32} className={locked ? 'opacity-100' : 'opacity-90 hover:opacity-100'} draggable={false} />}
    </div>
  )
}