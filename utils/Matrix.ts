import { DEFAULT_COR_NUM, DEFAULT_ROW_NUM } from "@/constants/note.constant"

export const nextIndex = (current: number, size: number) => {
  return current + 1 === size ? 0 : current + 1
}

export const prevIndex = (current: number, size: number) => {
  return current === 0 ? size - 1 : current - 1
}

const up = (current: number, colSize: number=DEFAULT_COR_NUM, rowSize: number=DEFAULT_ROW_NUM) =>
  current < colSize ? current + (colSize * (rowSize - 1)) : current - colSize;

const down = (current: number, colSize: number=DEFAULT_COR_NUM, rowSize: number=DEFAULT_ROW_NUM) =>
  current >= (colSize * (rowSize - 1)) ? current % colSize : current + colSize;

const right = (current: number, colSize: number=DEFAULT_COR_NUM, rowSize: number=DEFAULT_ROW_NUM) =>
  (current + 1) % colSize === 0 ? current - (colSize - 1) : current + 1;

const left = (current: number, colSize: number=DEFAULT_COR_NUM, rowSize: number=DEFAULT_ROW_NUM) =>
  current % colSize === 0 ? current + (colSize - 1) : current - 1;

const Matrix = {
  up: up,
  down: down,
  right: right,
  left: left
}

export default Matrix
