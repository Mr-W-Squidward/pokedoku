import { createContext, useContext, useState, ReactNode } from 'react';

interface Ctx {
  tappedPokemon: string | null
  setTappedPokemon: (name: string | null) => void
}

const PokemonSelectContext = createContext<Ctx>({ tappedPokemon: null, setTappedPokemon: () => {} })

export function PokemonSelectProvider({ children }: { children: ReactNode }) {
  const [tappedPokemon, setTappedPokemon] = useState<string | null>(null)
  return (
    <PokemonSelectContext.Provider value={{ tappedPokemon, setTappedPokemon }}>
      {children}
    </PokemonSelectContext.Provider>
  )
}

export const usePokemonSelect = () => useContext(PokemonSelectContext)