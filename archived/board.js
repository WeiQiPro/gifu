const BOARD_SIZE = 19;

class Board {
  constructor() {
    this.EMPTY = 0;
    this.BLACK = 1;
    this.WHITE = 2;
    this.position = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(this.EMPTY));
    this.hash = 0;
  }

  add(move, color, zobrist) {
    const [x, y] = move;
    if (this.position[x][y] !== this.EMPTY) return;
    this.position[x][y] = color;
    this.hash = zobrist.updateHash(this.hash, move, color);
    this.checkCapture(move, color, zobrist);
  }

  remove(move, zobrist) {
    const [x, y] = move;
    const piece = this.position[x][y];
    if (piece === this.EMPTY) return;
    this.hash = zobrist.updateHash(this.hash, move, piece);
    this.position[x][y] = this.EMPTY;
  }

  checkCapture(move, color, zobrist) {
    const opponentColor = color === this.BLACK ? this.WHITE : this.BLACK;
    const [x, y] = move;
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const toRemove = [];

    const checkGroup = (i, j) => {
      const queue = [[i, j]];
      const visited = new Set();
      const group = [];
      let hasLiberty = false;

      while (queue.length > 0) {
        const [cx, cy] = queue.pop();
        if (visited.has(`${cx},${cy}`)) continue;
        visited.add(`${cx},${cy}`);
        group.push([cx, cy]);

        for (const [dx, dy] of directions) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) continue;
          if (this.position[nx][ny] === this.EMPTY) {
            hasLiberty = true;
          } else if (this.position[nx][ny] === opponentColor && !visited.has(`${nx},${ny}`)) {
            queue.push([nx, ny]);
          }
        }
      }

      if (!hasLiberty) {
        toRemove.push(...group);
      }
    };

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) continue;
      if (this.position[nx][ny] === opponentColor) {
        checkGroup(nx, ny);
      }
    }

    toRemove.forEach(([rx, ry]) => this.remove([rx, ry], zobrist));
  }

  // Generate all symmetrical versions of the board
  generateSymmetries() {
    const symmetries = [];

    // Original
    symmetries.push(this.position);

    // Rotations and Flips
    symmetries.push(this.rotate90(this.position));
    symmetries.push(this.rotate90(this.flip(this.position)));
    symmetries.push(this.rotate180(this.position));
    symmetries.push(this.rotate180(this.flip(this.position)));
    symmetries.push(this.rotate270(this.position));
    symmetries.push(this.rotate270(this.flip(this.position)));
    symmetries.push(this.flip(this.position));

    return symmetries;
  }

  rotate90(board) {
    const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(this.EMPTY));
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        newBoard[j][BOARD_SIZE - 1 - i] = board[i][j];
      }
    }
    return newBoard;
  }

  rotate180(board) {
    return this.rotate90(this.rotate90(board));
  }

  rotate270(board) {
    return this.rotate90(this.rotate180(board));
  }

  flip(board) {
    const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(this.EMPTY));
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        newBoard[i][BOARD_SIZE - 1 - j] = board[i][j];
      }
    }
    return newBoard;
  }
}

export default Board;
