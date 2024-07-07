class FileReader {
  async readFile(filePath) {
    const READER = Deno.readTextFile;
    return await READER(filePath);
  }
}

export default FileReader;
