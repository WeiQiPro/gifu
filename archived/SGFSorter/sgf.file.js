import sgf from "npm:sgf-parser";

// File path
const FILE = "C:/Fox/Library/1359601245019999468.sgf";

// Read the file
const READER = Deno.readFile;

// Convert Uint8Array to string
const FILECONTENT = await READER(FILE);
const SGFCONTENT = new TextDecoder("utf-8").decode(FILECONTENT);

// Parse the SGF content
const SGF_NODES = sgf.parse(SGFCONTENT);

// Start traversing from the root node
let move = 0;
traverseNodes(SGF_NODES[0], move);
move = 0;
iterateNodes(SGF_NODES, move);

function traverseNodes(node, move) {
  while (node) {
    for (const property in node) {
      if (property === "B" || property === "W") {
        console.log(`Traversal - Move ${move}: ${property} ${node[property]}`);
      }
    }
    move++;
    if (node._next) {
      node = node._next;
    } else {
      node = null;
    }
  }
  console.log("Traversal Complete. Total Moves:", move);
}

function iterateNodes(SGF, move) {
  if (SGF.length > 0) {
    const firstNode = SGF[0];
    console.log("Properties of the first node:");
    for (const property in firstNode) {
      console.log(`${property}: ${firstNode[property]}`);
    }
  }

  for (const node of SGF) {
    for (const property in node) {
      if (property === "B" || property === "W") {
        console.log(`Iteration - Move ${move}: ${property} ${node[property]}`);
      }
    }
    move++;
  }
  console.log("Iteration Complete. Total Moves:", move);
}
