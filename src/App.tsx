import { useState, useEffect, useCallback } from 'react'
import Board from './components/Board'
import Sidebar from './components/Sidebar'
import { generatePokedoku } from './logic/pokedoku_generator'
import { POKEMON } from './constants/pokemon'
import { useAudio } from './hooks/useAudio'
import MusicPlayer from './components/MusicPlayer'
import { PokemonSelectProvider } from './context/PokemonSelectContext'

type SelectedCell = { row: number; col: number } | null

const DUMMY_BOARD = Array.from({ length: 9 }, () => new Array(9).fill(0))
const DUMMY_LOCKED = Array.from({ length: 9 }, () => new Array(9).fill(false))

export default function App() {
  
  const [board, setBoard] = useState<number[][]>(DUMMY_BOARD)
  const [solution, setSolution] = useState<number[][]>(DUMMY_BOARD)
  const [locked, setLocked] = useState<boolean[][]>(DUMMY_LOCKED)
  const [selected, setSelected] = useState<SelectedCell>(null)
  const [errors, setErrors] = useState(0)
  const [mistakes, setMistakes] = useState<boolean[][]>(
    Array.from({ length: 9 }, () => new Array(9).fill(false))
  )
  const {
    sfxOn, setSfxOn,
    musicOn, trackTitle,
    musicVolume, setMusicVolume,
    togglePlay, nextTrack, prevTrack,
    playCorrect, playIncorrect, playFinished, playGameOver
  } = useAudio()
  const [won, setWon] = useState(false)

  const MAX_ERRORS = 3

  const startNewGame = useCallback(() => {
    const generated = generatePokedoku()
    setBoard(generated.pokedoku)
    setSolution(generated.solution)
    setLocked(generated.locked)
    setSelected(null)
    setErrors(0)
    setMistakes(Array.from({ length: 9 }, () => new Array(9).fill(false)))
    setWon(false)
  }, [])

  useEffect(() => { startNewGame() }, [startNewGame])

  const erasureSelect = useCallback(() => {
      if (!selected) return
      const { row, col } = selected
      if (locked[row][col]) return
      setBoard(prev => {
        const next = prev.map(r => [...r])
        next[row][col] = 0
        return next
      })
    }, [selected, locked])

    useEffect(() => {
      const handler = (event: KeyboardEvent) => {
        if (event.key === 'Backspace' || event.key === 'Delete') {
          erasureSelect()
        }
      }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }, [erasureSelect])

    const handleSelect = (row: number, col: number) => {
    setSelected({ row, col })
  }

  const handleDrop = (row: number, col: number, pokemonName: string) => {
    if (locked[row][col]) return
    if (won) return
    const pokemon = POKEMON.find(p => p.name === pokemonName)
    if (!pokemon) return

    const isCorrect = solution[row][col] === pokemon.id

    if (!isCorrect) {
      const newErrors = errors + 1
      setErrors(newErrors)
      playIncorrect()
      
      setMistakes(prev => {
        const next = prev.map(r => [...r])
        next[row][col] = true
        return next
      })

      setTimeout(() => {
        setMistakes(prev => {
          const next = prev.map(r => [...r])
          next[row][col] = false
          return next
        })
      }, 800)

      if (newErrors >= MAX_ERRORS) {
        playGameOver()
        setTimeout(() => startNewGame(), 1000)
      }
      return
    }

    const newBoard = board.map(r => [...r])
    newBoard[row][col] = pokemon.id
    setBoard(newBoard)
    playCorrect()

    // check win condition
    const complete = newBoard.every((r, i) => r.every((v, j) => v === solution[i][j]))
    if (complete) {
      setWon(true)
      playFinished()
    }
  }

  return (
    <PokemonSelectProvider>
      <div className="min-h-screen bg-[#0f1923] flex flex-col items-center justify-center gap-4 p-6">
        {/* Header bar */}
        <div className="flex items-center gap-6">
          <h1 className="text-yellow-400 font-bold text-xl tracking-widest">POKÉDOKU</h1>
          <MusicPlayer
            trackTitle={trackTitle}
            musicOn={musicOn}
            onTogglePlay={togglePlay}
            onNextTrack={nextTrack}
            onPrevTrack={prevTrack}
            musicVolume={musicVolume}
            onVolumeChange={setMusicVolume}
            sfxOn={sfxOn}
            onToggleSfx={() => setSfxOn(on => !on)}
          />
          <div className="flex gap-2 text-sm text-gray-400">
            Mistakes:
            {[...Array(MAX_ERRORS)].map((_, i) => (
              <span key={i} className={i < errors ? 'text-red-400' : 'text-gray-600'}>✕</span>
            ))}
          </div>
          <button
            onClick={startNewGame}
            className="px-3 py-1 rounded bg-[#1a2535] border border-gray-600 text-gray-300 text-sm hover:bg-yellow-400 hover:text-black transition"
          >
            New Game
          </button>
          <button
            onClick={erasureSelect}
            className="px-3 py-1 rounded bg-[#1a2535] border border-gray-600 text-gray-300 text-sm hover:bg-red-500 hover:text-white transition"
          >
            Erase ⌫
          </button>
        </div>

        {won && (
          <div className="text-yellow-400 font-bold text-lg animate-bounce">
            🏆 You solved it!
          </div>
        )}

        {errors >= MAX_ERRORS && (
          <div className="text-red-400 font-bold text-lg">
            ✕ Too many mistakes — starting new game...
          </div>
        )}

        <div className="flex items-start gap-6">
          <Sidebar />
          <Board
            board={board}
            locked={locked}
            selected={selected}
            mistakes={mistakes}
            onSelect={handleSelect}
            onDrop={handleDrop}
          />
        </div>
      </div>
    </PokemonSelectProvider>
  )
}
