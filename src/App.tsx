import { useState, useEffect, useCallback } from 'react'
import Board from './components/Board'
import Sidebar from './components/Sidebar'
import { generatePokedoku } from './logic/pokedoku_generator'
import { POKEMON } from './constants/pokemon'
import { useAudio } from './hooks/useAudio'
import MusicPlayer from './components/MusicPlayer'
import { PokemonSelectProvider } from './context/PokemonSelectContext'
import { DIFFICULTY_PRESETS, Difficulty, GameConfig } from './types'

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

  // config / difficulty / levels
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [config, setConfig] = useState<GameConfig>(DIFFICULTY_PRESETS.easy)
  const [hintsLeft, setHintsLeft] = useState(DIFFICULTY_PRESETS.easy.hints)
  const [showingConfig, setShowingConfig] = useState(false)
  const [customPrefilled, setCustomPrefilled] = useState(DIFFICULTY_PRESETS.easy.prefilled)
  const [customHints, setCustomHints] = useState(DIFFICULTY_PRESETS.easy.hints)

  const MAX_ERRORS = 3

  const startNewGame = useCallback((cfg: GameConfig) => {
    const generated = generatePokedoku(cfg.prefilled)
    setBoard(generated.pokedoku)
    setSolution(generated.solution)
    setLocked(generated.locked)
    setSelected(null)
    setErrors(0)
    setMistakes(Array.from({ length: 9 }, () => new Array(9).fill(false)))
    setWon(false)
    setHintsLeft(cfg.hints)
  }, [])

  useEffect(() => { startNewGame(config) }, [startNewGame])

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d)
    if (d !== 'custom') {
      const cfg = DIFFICULTY_PRESETS[d]
      setConfig(cfg)
      startNewGame(cfg)
    }
  }

  const handleCustomConfigStart = () => {
    const cfg: GameConfig = { difficulty: 'custom', prefilled: customPrefilled, hints: customHints }
    setConfig(cfg)
    startNewGame(cfg)
    setShowingConfig(false)
  }

  const handleHint = () => {
    if (hintsLeft <= 0) return
    const emptyCells: [number, number][] = []
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (!locked[i][j] && board[i][j] === 0) {
          emptyCells.push([i, j])
        }
      }
    }

    if (emptyCells.length === 0) return
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    
    const newBoard = board.map(row => [...row])
    newBoard[row][col] = solution[row][col]
    setBoard(newBoard)
    setHintsLeft(hintsLeft => hintsLeft - 1)

    const complete = newBoard.every((r, i) => r.every((v, j) => v === solution[i][j]))
    if (complete) {
      setWon(true)
      playFinished()
    }
  }

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
        setTimeout(() => startNewGame(config), 1000)
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
      <div className="min-h-screen bg-[#0f1923] flex flex-col items-center gap-4 p-6 pt-8">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <h1 className="text-yellow-400 font-bold text-2xl tracking-widest mr-2">POKÉDOKU</h1>

          {/* Difficulty selector */}
          <div className="flex gap-1 bg-[#1a2535] rounded-lg p-1">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition 
                  ${difficulty === d 
                  ? 'bg-yellow-400 text-black' 
                  : 'text-gray-400 hover:text-white'}`}
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => { setDifficulty('custom'); setShowingConfig(s => !s)}}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition 
                ${difficulty === 'custom'
                  ? 'bg-yellow-400 text-black' 
                  : 'text-gray-400 hover:text-white'}`}
            >
              custom
            </button>
            
            <button
              onClick={() => startNewGame(config)}
              className="px-4 py-1 rounded-md text-xs font-semibold text-gray-400 hover:text-white transition"
            >
              ↺ New
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-center">
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

            {/* Hints */}
            <button
              onClick={handleHint}
              disabled={hintsLeft <= 0 || won}
              className="px-3 py-1 rounded bg-[#1a2535] border border-gray-600 text-gray-300 text-sm 
                hover:bg-yellow-400 hover:text-black 
                transition disabled:opacity-50 disabled:hover:bg-[#1a2535] 
                disabled:hover:text-gray-300"
            >
              💡 Hint ({hintsLeft})
            </button>

            <button
              onClick={erasureSelect}
              className="px-3 py-1 rounded bg-[#1a2535] border border-gray-600 text-gray-300 text-sm hover:bg-red-500 hover:text-white transition"
            >
              Erase ⌫
            </button>

            {/* MISTAKES */}
            <div className="flex gap-2 text-sm text-gray-400">
              Mistakes:
              {[...Array(MAX_ERRORS)].map((_, i) => (
                <span key={i} className={i < errors ? 'text-red-400' : 'text-gray-600'}>✕</span>
              ))}
            </div>
          </div>
        </div>

        {/* CUSTOM CONFIG */}
        {showingConfig && (
          <div className="bg-[#1a2535] border border-gray-600 rounded-xl p-5 flex flex-col gap-4 w-72">
            <div>
              <label className="text-xs mb-1 block text-gray-400">
                <span className="text-gray-600 ml-2">({70 - customPrefilled} to solve)</span>
              </label>
              <input 
                type="range" min={17} max={70} value={customPrefilled}
                onChange={e => setCustomPrefilled(Number(e.target.value))}
                className="w-full accent-yellow-400"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>17 (hardest)</span> 
                <span>70 (easiest)</span>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-2 block">
                Hints: <span className="text-yellow-400 font-bold">{customHints}</span>
              </label>
              <input
                type="range" min={0} max={10} value={customHints}
                onChange={e => setCustomHints(Number(e.target.value))}
                className="w-full accent-yellow-400"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0</span>
                <span>10</span>
              </div>
            </div>
            <button
              onClick={handleCustomConfigStart}
              className="bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-yellow-300 transition"
            >
              Start Custom Game
            </button>
          </div>
        )}

        {won && (
          <div className="text-yellow-400 font-bold text-lg animate-bounce">
            🏆 You solved it!
          </div>
        )}

        {errors >= MAX_ERRORS && (
          <div className="text-red-400 font-bold">
            ✕ Too many mistakes — starting new game...
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 w-full md:w-auto">
          <Board
            board={board}
            locked={locked}
            selected={selected}
            mistakes={mistakes}
            onSelect={handleSelect}
            onDrop={handleDrop}
          />
          <Sidebar />
        </div>
      </div>
    </PokemonSelectProvider>
  )
}
