import sgf from "npm:sgf-parser";
import Zobrist from "../zobrist.js";
import Board from "../board.js";

const SGF_DIR = "C:/Fox/Library";
const FSLENGTH = 50000;
const DIR_READER = Deno.readDirSync;
const READER = Deno.readTextFile;

// Initialize Zobrist hashing
const zobrist = new Zobrist();

// Initialize a Map to store all intermediate hashes
const hashMap = new Map();

function sgfCoordToBoardCoord(sgfCoord) {
  if (sgfCoord.length !== 2) throw new Error("Invalid SGF coordinate");
  const x = sgfCoord.charCodeAt(0) - "a".charCodeAt(0);
  const y = sgfCoord.charCodeAt(1) - "a".charCodeAt(0);
  return [x, y];
}

function processSgfNodes(nodes, board, zobrist, gamePath) {
  let moveNumber = 0;
  for (const node of nodes) {
    for (const property in node) {
      if (moveNumber >= 50) return;

      if (property === "B" || property === "W") {
        moveNumber++;
        const move = sgfCoordToBoardCoord(node[property]);
        const color = property === "B" ? board.BLACK : board.WHITE;
        board.add(move, color, zobrist);

        // Generate all symmetrical versions of the board and compute their hashes
        const symmetries = board.generateSymmetries();
        const hashes = symmetries.map((symBoard) =>
          zobrist.computeHash(symBoard)
        );

        // Check for conflicts in all symmetries
        let conflict = false;
        for (const hash of hashes) {
          if (hashMap.has(hash)) {
            hashMap.get(hash).push(gamePath);
            conflict = true;
            break;
          }
        }

        // If no conflicts, store the minimal hash
        if (!conflict) {
          const minHash = Math.min(...hashes);
          if (!hashMap.has(minHash)) {
            hashMap.set(minHash, []);
          }
          hashMap.get(minHash).push(gamePath);
        }
      }
    }

    if (node.children) {
      processSgfNodes(node.children, board, zobrist, gamePath);
    }
  }
}

function showProgress(current, total) {
  const percentage = (current / total) * 100;
  const progress = Math.round((percentage / 100) * 50);
  const progressBar = "[" + "=".repeat(progress) + " ".repeat(50 - progress) + "]";
  console.clear();
  console.log(`Processing files: ${current}/${total}`);
  console.log(progressBar + ` ${percentage.toFixed(2)}%`);
}


// Read the SGF directory and get all file paths
const filePaths = [];
for (const entry of DIR_READER(SGF_DIR)) {
  if (entry.isFile && entry.name.endsWith(".sgf")) {
    filePaths.push(`${SGF_DIR}/${entry.name}`);
  }
}

// Process only the first 1000 SGF files
const filesToProcess = filePaths.slice(0, FSLENGTH);

for (let i = 0; i < FSLENGTH; i++) {
  const filePath = filesToProcess[i];
  const sgfContent = await READER(filePath);
  const parsedSgf = sgf.parse(sgfContent);

  // Initialize an empty board for each game
  const board = new Board();

  // Start processing the SGF nodes from the root
  processSgfNodes(parsedSgf, board, zobrist, filePath);

  // Show progress
  showProgress(i + 1, FSLENGTH);
}

for (const [key, value] of hashMap) {
  if (value.length > 1000) {
    console.log(`Hash: ${key}, Games: ${value.length}`);
  }
}
