import { useState, useEffect } from 'react'
import { generatePokedoku, Board } from '../logic/pokedoku_generator'
import { POKEMON } from '../constants/pokemon'

type SelectedCell = { row: number; col: number } | null

export function useGameState() {
  const [board, setBoard] = useState<Board>(Array.from({ length: 9 }, () => Array(9).fill(0)))
  const [locked, setLocked] = useState<boolean[][]>(Array.from({ length: 9 }, () => Array(9).fill(false)))
  const [selected, setSelected] = useState<SelectedCell>(null)

  useEffect(() => {
    const generated = generatePokedoku()
    setBoard(generated.pokedoku)
    setLocked(generated.locked)
  }, [])

  const setCellValue = (row: number, col: number, pokemonName: string) => {
    const pokemon = POKEMON.find(p => p.name === pokemonName)
    if (!pokemon) return
    setBoard(prev => prev.map((r, ri) => r.map((v, ci) => (ri === row && ci === col ? pokemon.id : v))))
  }

  return { board, locked, selected, setSelected, setCellValue }
}
