import { ProgressBar } from "./progressBar.js";

class FileLoader {
  async loadFiles(amount) {
    const SGF_DIR = "C:/Fox/Library";
    const DIR_READER = Deno.readDir;

    const files = [];
    const loadBar = new ProgressBar('Loading Files', amount);

    for await (const file of DIR_READER(SGF_DIR)) {
      if (file.isFile && file.name.endsWith(".sgf")) {
        files.push(`${SGF_DIR}/${file.name}`);
        loadBar.update();
        if (files.length >= amount) break;
      }
    }
    return files;
  }
}

export default FileLoader;
