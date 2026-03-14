import { useState, useEffect } from 'react'
import Board from './components/Board'
import Sidebar from './components/Sidebar'
import { generatePokedoku } from './logic/pokedoku_generator'
import { POKEMON } from './constants/pokemon'

type SelectedCell = { row: number; col: number } | null

// Dummy board and locked state to avoid rendering issues before the actual board is generated
const DUMMY_BOARD = Array.from({ length: 9 }, () => new Array(9).fill(0))
const DUMMY_LOCKED = Array.from({ length: 9 }, () => new Array(9).fill(false))

export default function App() {
  const [board, setBoard] = useState<number[][]>(DUMMY_BOARD)
  const [locked, setLocked] = useState<boolean[][]>(DUMMY_LOCKED)
  const [selected, setSelected] = useState<SelectedCell>(null)

  useEffect(() => {
    const generated = generatePokedoku()
    setBoard(generated.pokedoku)
    setLocked(generated.locked)
  }, [])

  const handleSelect = (row: number, col: number) => {
    if (locked[row][col]) return
    setSelected({ row, col })
  }

  const handleDrop = (row: number, col: number, pokemonName: string) => {
    if (locked[row][col]) return
    const pokemon = POKEMON.find(p => p.name === pokemonName)
    if (!pokemon) return

    setBoard(prev => prev.map((r, ri) =>
      r.map((v, ci) => (ri === row && ci === col ? pokemon.id : v))
    ))
  }

  return (
    <div className="min-h-screen bg-[#0f1923] flex items-center justify-center gap-6 p-6">
      <Sidebar />
      <Board
        board={board}
        locked={locked}
        selected={selected}
        onSelect={handleSelect}
        onDrop={handleDrop}
      />
    </div>
  )
}
