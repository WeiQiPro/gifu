export function processSgfNodes(nodes, board, zobrist, library, gameId) {
  let moveNumber = 0;
  for (const node of nodes) {
    for (const property in node) {
      if (moveNumber >= 50) return;

      if (property === "B" || property === "W") {
        moveNumber++;
        const move = sgfCoordToBoardCoord(node[property]);
        const color = property === "B" ? board.BLACK : board.WHITE;
        board.add(move, color, zobrist);

        const symmetries = board.generateSymmetries(zobrist);
        libraryUpdateFunction(symmetries, library, gameId);
      }
    }
  }
}

function libraryUpdateFunction(symmetries, library, gameId) {
  const conflict = zobristHashCollisions(symmetries, library, gameId);

  if (!conflict) {
    const minHash = Math.min(...symmetries);
    if (!library.has(minHash)) {
      library.set(minHash, []);
    }
    library.get(minHash).push(gameId);
  }
}

function zobristHashCollisions(symmetries, library) {
  let conflict = false;
  for (const hash of symmetries) {
    if (library.has(hash)) {
      library.get(hash).push(gameId);
      conflict = true;
      break;
    }
  }
  return conflict;
}

export function sgfCoordToBoardCoord(sgfCoord) {
  if (sgfCoord.length !== 2) throw new Error("Invalid SGF coordinate");
  const x = sgfCoord.charCodeAt(0) - "a".charCodeAt(0);
  const y = sgfCoord.charCodeAt(1) - "a".charCodeAt(0);
  return [x, y];
}
