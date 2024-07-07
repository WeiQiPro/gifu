import FileLoader from "./fileLoader.js";
import FileReader from "./fileReader.js";
import FileParser from "./fileParser.js";
import HashUpdater from "./hashUpdater.js";
import GameUploader from "./gameUploader.js";
import DatabaseAPI from "../../database/dbapi.js";
import { ProgressBar } from "./progressBar.js";
import Board from "../board.js";
import Zobrist from "../zobrist.js";

class Engine {
  fileLoader;
  fileReader;
  fileParser;
  hashUpdater;
  gameUploader;
  databaseAPI;
  board;
  zobrist;

  constructor() {
    this.databaseAPI = new DatabaseAPI();
    this.fileLoader = new FileLoader();
    this.fileReader = new FileReader();
    this.fileParser = new FileParser();
    this.hashUpdater = new HashUpdater(this.databaseAPI);
    this.gameUploader = new GameUploader(this.databaseAPI);
    this.zobrist = new Zobrist();
  }

  async loadFiles(amount) {
    const files = await this.fileLoader.loadFiles(amount);
    const loadBar = new ProgressBar('Loading Files', files.length);

    for (const file of files) {
      const content = await this.fileReader.readFile(file);
      const game = this.fileParser.parseFile(content);

      const name = this.gameUploader.generateGameName(game);
      const existingGame = this.databaseAPI.getGameByName(name);

      if (!existingGame) {
        let board = new Board();
        const gameId = this.databaseAPI.generateGameId();
        this.gameUploader.uploadGame(gameId, name, content, game);
        this.hashUpdater.updateHashes(game, gameId, board, this.zobrist);
      } else {
        console.log(`Game ${name} already exists in the database.`);
      }
      loadBar.update();
    }

    console.log('\nProcessing complete.');
    this.databaseAPI.getAllGames();
  }
}

export default Engine;
