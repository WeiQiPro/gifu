import { processSgfNodes } from "./utils.js";

class HashUpdater {
  constructor(databaseAPI) {
    this.databaseAPI = databaseAPI;
  }

  updateHashes(game, gameId, board, zobrist) {
    const library = new Map();
    processSgfNodes(game, board, zobrist, library, gameId);

    for (const [hash, gameIds] of library) {
      const existingHash = this.databaseAPI.getBoardStateHash(hash);
      if (existingHash) {
        const newGameIndices = existingHash.game_indices.split(',').concat(gameIds).join(',');
        const newNumOfGames = existingHash.num_of_games + gameIds.length;
        const newWinRate = this.calculateWinRate(existingHash, gameIds.length, newNumOfGames); 
        const newNextMoves = this.calculateNextMoves(existingHash.next_moves, gameIds);
        this.databaseAPI.updateBoardState(hash, newWinRate, newNextMoves, newNumOfGames, newGameIndices);
      } else {
        this.databaseAPI.addBoardState(hash, 0, "", gameIds.length, gameIds.join(','));
      }
    }
  }

  calculateWinRate(existingHash, newGamesCount, totalGames) {
    const existingWinRate = existingHash.win_rate;
    const existingGamesCount = existingHash.num_of_games;
    return (existingWinRate * existingGamesCount + newGamesCount) / totalGames;
  }

  calculateNextMoves(existingNextMoves, _newGameIds) {
    return existingNextMoves;
  }
}

export default HashUpdater;
