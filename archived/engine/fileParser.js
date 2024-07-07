import sgf from "npm:sgf-parser";

class FileParser {
  parseFile(content) {
    return sgf.parse(content);
  }
}

export default FileParser;
