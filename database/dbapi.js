import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";

class DatabaseAPI {
  constructor() {
    this.db = new DB("./database/library.db");

    // Initialize the database and create tables if they don't exist
    this.db.query(`
      CREATE TABLE IF NOT EXISTS GAME (
        id TEXT PRIMARY KEY,
        black TEXT,
        white TEXT,
        handicap INTEGER,
        komi REAL,
        result TEXT,
        content TEXT
      )
    `);

    this.db.query(`
      CREATE TABLE IF NOT EXISTS LIBRARY (
        hash TEXT PRIMARY KEY,
        win_rate REAL,
        next_moves TEXT,
        num_of_games INTEGER,
        game_indices TEXT
      )
    `);

    this.db.query(`
      CREATE TABLE IF NOT EXISTS CONTENT (
        name TEXT,
        text TEXT
      )
    `);
  }

  addContent(name, text) {
    try {
      this.db.query(
        `
        INSERT INTO CONTENT (name, text)
        VALUES (?, ?)
      `,
        [name, text]
      );
      console.log("Content added successfully");
    } catch (error) {
      console.error("Failed to add content:", error);
    }
  }


  getGameByName(name) {
    try {
      const result = this.db.query("SELECT * FROM CONTENT WHERE name = ?", [
        name,
      ]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Failed to get game:", error);
      return null;
    }
  }

  addGame(id, black, white, handicap, komi, result, contentName) {
    try {
      this.db.query(
        `
        INSERT INTO GAME (id, black, white, handicap, komi, result, content)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [id, black, white, handicap, komi, result, contentName]
      );
      console.log("Game added successfully");
    } catch (error) {
      console.error("Failed to add game:", error);
    }
  }

  generateGameId() {
    const result = this.db.query("SELECT MAX(id) FROM GAME");
    return result[0][0] + 1;
  }

  removeGame(id) {
    try {
      this.db.query("DELETE FROM GAME WHERE id = ?", [id]);
      console.log("Game removed successfully");
    } catch (error) {
      console.error("Failed to remove game:", error);
    }
  }

  setGameBlackPlayer(id, black) {
    try {
      this.db.query("UPDATE GAME SET black = ? WHERE id = ?", [black, id]);
      console.log("Game black player updated successfully");
    } catch (error) {
      console.error("Failed to update black player:", error);
    }
  }

  setGameWhitePlayer(id, white) {
    try {
      this.db.query("UPDATE GAME SET white = ? WHERE id = ?", [white, id]);
      console.log("Game white player updated successfully");
    } catch (error) {
      console.error("Failed to update white player:", error);
    }
  }

  setGameKomi(id, komi) {
    try {
      this.db.query("UPDATE GAME SET komi = ? WHERE id = ?", [komi, id]);
      console.log("Game komi updated successfully");
    } catch (error) {
      console.error("Failed to update komi:", error);
    }
  }

  setGameResult(id, result) {
    try {
      this.db.query("UPDATE GAME SET result = ? WHERE id = ?", [result, id]);
      console.log("Game result updated successfully");
    } catch (error) {
      console.error("Failed to update result:", error);
    }
  }

  setGameFile(id, moves) {
    try {
      this.db.query("UPDATE GAME SET moves = ? WHERE id = ?", [moves, id]);
      console.log("Game file updated successfully");
    } catch (error) {
      console.error("Failed to update game file:", error);
    }
  }

  getGameID(id) {
    try {
      const result = this.db.query("SELECT * FROM GAME WHERE id = ?", [id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Failed to get game:", error);
      return null;
    }
  }

  getGameBlackPlayer(id) {
    try {
      const result = this.db.query("SELECT black FROM GAME WHERE id = ?", [id]);
      return result.length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error("Failed to get black player:", error);
      return null;
    }
  }

  getGameWhitePlayer(id) {
    try {
      const result = this.db.query("SELECT white FROM GAME WHERE id = ?", [id]);
      return result.length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error("Failed to get white player:", error);
      return null;
    }
  }

  getGameKomi(id) {
    try {
      const result = this.db.query("SELECT komi FROM GAME WHERE id = ?", [id]);
      return result.length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error("Failed to get komi:", error);
      return null;
    }
  }

  getGameResult(id) {
    try {
      const result = this.db.query("SELECT result FROM GAME WHERE id = ?", [
        id,
      ]);
      return result.length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error("Failed to get result:", error);
      return null;
    }
  }

  getGameFile(id) {
    try {
      const result = this.db.query("SELECT moves FROM GAME WHERE id = ?", [id]);
      return result.length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error("Failed to get game file:", error);
      return null;
    }
  }

  getAllGames() {
    try {
      const result = this.db.query("SELECT * FROM GAME");
      return result.map(([id, black, white, handicap, komi, result, content_name]) => ({
        id,
        black,
        white,
        handicap,
        komi,
        result,
        content_name,
      }));
    } catch (error) {
      console.error("Failed to get all games:", error);
      return [];
    }
  }

  addBoardState(hash, winRate, nextMoves, numOfGames, gameIndices) {
    try {
      this.db.query(
        `
        INSERT INTO LIBRARY (hash, win_rate, next_moves, num_of_games, game_indices)
        VALUES (?, ?, ?, ?, ?)
      `,
        [hash, winRate, nextMoves, numOfGames, gameIndices]
      );
      console.log("Board state added successfully");
    } catch (error) {
      console.error("Failed to add board state:", error);
    }
  }

  removeBoardState(hash) {
    try {
      this.db.query("DELETE FROM LIBRARY WHERE hash = ?", [hash]);
      console.log("Board state removed successfully");
    } catch (error) {
      console.error("Failed to remove board state:", error);
    }
  }

  setBoardStateWinRate(hash, winRate) {
    try {
      this.db.query("UPDATE LIBRARY SET win_rate = ? WHERE hash = ?", [
        winRate,
        hash,
      ]);
      console.log("Board state win rate updated successfully");
    } catch (error) {
      console.error("Failed to update win rate:", error);
    }
  }

  setBoardStateTotalGames(hash, totalGames) {
    try {
      this.db.query("UPDATE LIBRARY SET num_of_games = ? WHERE hash = ?", [
        totalGames,
        hash,
      ]);
      console.log("Board state total games updated successfully");
    } catch (error) {
      console.error("Failed to update total games:", error);
    }
  }

  setBoardStateListGames(hash, listGames) {
    try {
      this.db.query("UPDATE LIBRARY SET game_indices = ? WHERE hash = ?", [
        listGames,
        hash,
      ]);
      console.log("Board state list games updated successfully");
    } catch (error) {
      console.error("Failed to update list games:", error);
    }
  }

  getBoardStateHash(hash) {
    try {
      const result = this.db.query("SELECT * FROM LIBRARY WHERE hash = ?", [
        hash,
      ]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Failed to get board state:", error);
      return null;
    }
  }

  getBoardStateWinRate(hash) {
    try {
      const result = this.db.query(
        "SELECT win_rate FROM LIBRARY WHERE hash = ?",
        [hash]
      );
      return result.length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error("Failed to get win rate:", error);
      return null;
    }
  }

  getBoardStateTotalGames(hash) {
    try {
      const result = this.db.query(
        "SELECT num_of_games FROM LIBRARY WHERE hash = ?",
        [hash]
      );
      return result.length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error("Failed to get total games:", error);
      return null;
    }
  }

  getBoardStateListGames(hash) {
    try {
      const result = this.db.query(
        "SELECT game_indices FROM LIBRARY WHERE hash = ?",
        [hash]
      );
      return result.length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error("Failed to get list games:", error);
      return null;
    }
  }
}

export default DatabaseAPI;
