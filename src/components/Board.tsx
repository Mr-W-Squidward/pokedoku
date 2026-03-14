import Cell from './Cell'

type BoardData = number[][]

interface SelectedCell {
  row: number
  col: number
}

interface BoardProps {
  board: BoardData
  locked: boolean[][]
  selected: SelectedCell | null
  onSelect: (row: number, col: number) => void
  onDrop: (row: number, col: number, pokemonName: string) => void
}

export default function Board({ board, locked, selected, onSelect, onDrop }: BoardProps) {
  const selectedValue = selected ? board[selected.row][selected.col] : 0

  return (
    <div className="grid grid-cols-9 gap-[1px] bg-gray-800 p-1 rounded-md">
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const isSelected = selected?.row === rowIndex && selected?.col === colIndex
          const isHighlighted = !!selected && !!isSelected &&
            (selected.row === rowIndex || selected.col === colIndex || (Math.floor(selected.row / 3) === Math.floor(rowIndex / 3) && Math.floor(selected.col / 3) === Math.floor(colIndex / 3)))
          const sameValue = selectedValue > 0 && value > 0 && value === selectedValue

          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              locked={locked[rowIndex][colIndex]}
              selected={isSelected}
              highlighted={isHighlighted}
              sameValue={sameValue}
              onSelect={() => onSelect(rowIndex, colIndex)}
              onDrop={(pokemonName) => onDrop(rowIndex, colIndex, pokemonName)}
            />
          )
        })
      )}
    </div>
  )
}
