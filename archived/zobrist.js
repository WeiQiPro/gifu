const BOARD_SIZE = 19;

class Zobrist {
  constructor() {
    this.table = [];
    this.initZobristTable();
  }

  random(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  initZobristTable() {
    let seed = 1;
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.table[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.table[i][j] = [
          Math.floor(this.random(seed++) * 0xFFFFFFFF),
          Math.floor(this.random(seed++) * 0xFFFFFFFF),
          Math.floor(this.random(seed++) * 0xFFFFFFFF),
        ];
      }
    }
  }

  computeHash(board) {
    let hash = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const piece = board[i][j];
        if (piece !== 0) { // Assuming 0 is EMPTY
          hash ^= this.table[i][j][piece];
        }
      }
    }
    return hash;
  }

  updateHash(currentHash, move, piece) {
    const [x, y] = move;
    return currentHash ^ this.table[x][y][piece];
  }
}

export default Zobrist;
