export type Board = number[][];

function isValid(board: Board, row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  // in mini 3x3 grid (board)
  const boardrow = Math.floor(row / 3) * 3;
  const boardcol = Math.floor(col / 3) * 3;

  // in any row or column, if the number is already present, return false
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (board[boardrow+x][boardcol+y] === num) {
        return false;
      }
    }
  }

  return true;
};

function solve(board: Board): boolean {
  // backtracking, if there is an empty cell, fill it with a number from 1 to 9 -> check if it works
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5); // shuffle numbers to get different solutions each time
        for (const v of nums) {
          if (isValid(board, row, col, v)) {
            board[row][col] = v;
            if (solve(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

export function generatePokedoku(prefilled: number=65): { pokedoku: Board, solution: Board, locked: boolean[][] } {

  // stuck between 17 and 70 cells (min and max to play...)
  const clampPrefilled = Math.max(17, Math.min(prefilled, 70));
  const toRemove = 81 - clampPrefilled;

  // generate a random board
  const solution: Board = Array.from({ length: 9 }, () => new Array(9).fill(0));
  solve(solution)

  const pokedoku = solution.map(row => row.slice());
  const locked: boolean[][] = Array.from({ length: 9 }, () => new Array(9).fill(true)); // lock some numbers from the board to create a puzzle

  const cells = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5); // create an array of cell indices

  for (let i = 0; i < toRemove; i++) {
    const row = Math.floor(cells[i] / 9);
    const col = cells[i] % 9;
    pokedoku[row][col] = 0; // remove the number from the puzzle
    locked[row][col] = false; // players can fill (since it's locked)
  }

  return { pokedoku, solution, locked }
}