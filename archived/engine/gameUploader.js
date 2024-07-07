class GameUploader {
  constructor(databaseAPI) {
    this.databaseAPI = databaseAPI;
  }

  generateGameName(game) {
    const black = game[0].PB;
    const white = game[0].PW;
    const result = game[0].RE;
    const date = game[0].DT;
    return `${black}_${white}_${result}_${date}`;
  }

  uploadGame(id, name, content, game) {
    const black = game[0].PB;
    const white = game[0].PW;
    const handicap = game[0].HA || 0;
    const komi = game[0].KM || 0.0;
    const result = game[0].RE;

    console.log(name);
    this.databaseAPI.addContent(name, content);
    this.databaseAPI.addGame(id, black, white, handicap, komi, result, name);
  }
}

export default GameUploader;
