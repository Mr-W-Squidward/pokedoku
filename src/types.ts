export type Difficulty = 'easy' | 'medium' | 'hard' | 'custom'

export interface GameConfig {
  difficulty: Difficulty
  prefilled: number // how many cells are NOT blank (prefilled at the start)
  hints: number
}

export const DIFFICULTY_PRESETS: Record<Exclude<Difficulty, 'custom'>, GameConfig> = {
  easy: { difficulty: 'easy', prefilled: 65, hints: 5 },
  medium: { difficulty: 'medium', prefilled: 55, hints: 3 },
  hard: { difficulty: 'hard', prefilled: 45, hints: 1 },
}