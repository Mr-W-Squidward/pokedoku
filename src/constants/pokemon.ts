export interface Pokemon {
  id: number
  name: string
  image: string
}

export const POKEMON: Pokemon[] = [
  { id: 1, name: 'Ellodie', image: '../assets/images/ellodie-scaled.png' },
  { id: 2, name: 'Binky', image: '../assets/images/binky-scaled.png' },
  { id: 3, name: 'Lapdrie', image: '../assets/images/lapdrie-scaled.png' },
  { id: 4, name: 'Eternatus', image: '../assets/images/eternatus-scaled.png' },
  { id: 5, name: 'Morpeko', image: '../assets/images/morpeko-scaled.png' },
  { id: 6, name: 'Psyduck', image: '../assets/images/psyduck-scaled.png' },
  { id: 7, name: 'Bunnelby', image: '../assets/images/bunnelby-scaled.png' },
  { id: 8, name: 'Slugma', image: '../assets/images/slugma-scaled.png' },
  { id: 9, name: 'Sunflora', image: '../assets/images/sunflora-scaled.png' }
]