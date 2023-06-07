export const nextIndex = (current: number, size: number) => {
  return current + 1 === size ? 0 : current + 1;
}

export const prevIndex = (current: number, size: number) => {
  return current === 0 ? size - 1 : current - 1;
}

export default class Matrix<T> {
  public table: (T|null)[];
  public colSize: number;
  public rowSize: number;
  public cellSize: number;

  constructor(col: number, row: number) {
    this.table = [...Array(col * row)].map(() => null);
    this.colSize = col;
    this.rowSize = row;
    this.cellSize = col * row;
  }

  public upIndex(current: number) {
    return current < this.colSize ? current + (this.colSize * (this.rowSize - 1)) : current - this.colSize;
  }

  public downIndex(current: number) {
    return current >= (this.colSize * (this.rowSize - 1)) ? current % this.colSize : current + this.colSize;
  }

  public rightIndex(current: number) {
    return (current + 1) % this.colSize === 0 ? current - (this.colSize - 1) : current + 1;
  }

  public leftIndex(current: number) {
    return current % this.colSize === 0 ? current + (this.colSize - 1) : current - 1;
  }
}
