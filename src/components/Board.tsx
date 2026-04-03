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
  mistakes: boolean[][]
  onSelect: (row: number, col: number) => void
  onDrop: (row: number, col: number, pokemonName: string) => void
}

export default function Board({ board, locked, selected, mistakes, onSelect, onDrop }: BoardProps) {
  const selectedValue = selected ? board[selected.row][selected.col] : 0

  return (
    <div className="grid grid-cols-9 gap-[1px] bg-gray-800 p-1 rounded-md">
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const isSelected = selected?.row === rowIndex && selected?.col === colIndex
          const isHighlighted = !!selected && !isSelected &&
            (selected.row === rowIndex || selected.col === colIndex || (Math.floor(selected.row / 3) === Math.floor(rowIndex / 3) && Math.floor(selected.col / 3) === Math.floor(colIndex / 3)))
          const sameValue = selectedValue > 0 && value > 0 && value === selectedValue

          // separation for 3x3 boxes
          const borderRow = (rowIndex + 1) % 3 === 0 && rowIndex < 8 ? 'border-b-[3px] border-b-gray-900 mb-1' : 'border-b border-b-gray-800'
          const borderCol = (colIndex + 1) % 3 === 0 && colIndex < 8 ? 'border-r-[3px] border-r-gray-900 mr-1' : 'border-r border-r-gray-800'

          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              locked={locked[rowIndex][colIndex]}
              selected={isSelected}
              highlighted={isHighlighted}
              sameValue={sameValue}
              mistake={mistakes[rowIndex][colIndex]}
              extraBorder={`${borderRow} ${borderCol}`}
              onSelect={() => onSelect(rowIndex, colIndex)}
              onDrop={(pokemonName) => onDrop(rowIndex, colIndex, pokemonName)}
            />
          )
        })
      )}
    </div>
  )
}
