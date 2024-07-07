import { ensureDir, exists } from "https://deno.land/std@0.105.0/fs/mod.ts";
import sgf from "npm:sgf-parser";

const FOX_DIR = "C:/Fox/library";
const GIFU_UNCLASS = "./Fox/unclassified";
const GIFU_DIR = "./Fox";
const SIZE = [9, 13, 19];
const HANDICAP = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const RANK = generateRanks();

const READER = {
  DIR: Deno.readDir,
  FILE: Deno.readFile,
  RENAME: Deno.rename,
  WRITE: Deno.writeFile,
};

function generateRanks() {
  const dan_ranks_total = 10;
  const kyu = "级";
  const dan = "段";

  const ranks = [];

  for (let i = 18; i >= 1; i--) {
    ranks.push(i + kyu);
  }

  for (let i = 1; i <= dan_ranks_total; i++) {
    ranks.push(i + dan);
  }
  for(let i = 1; i<= dan_ranks_total; i++) {
    ranks.push(`P` + i + dan)
  }

  return ranks;
}

async function loadFoxDirectory(dir, limit) {
  const SGFS = [];
  let count = 0;

  async function traverseDirectory(currentDir) {
    for await (const entry of READER.DIR(currentDir)) {
      const fullPath = `${currentDir}/${entry.name}`;
      if (entry.isFile && entry.name.endsWith('.sgf')) {
        SGFS.push(fullPath);
        count++;
        if (count >= limit) {
          return;
        }
      } else if (entry.isDirectory) {
        await traverseDirectory(fullPath);
        if (count >= limit) {
          return;
        }
      }
    }
  }

  await traverseDirectory(dir);
  return SGFS;
}

function parseSGFContent(data) {
  try {
    return sgf.parse(data);
  } catch (error) {
    console.error(`Error parsing SGF content: ${error.message}`);
    return null;
  }
}

async function readFileData(path) {
  const file_content = await READER.FILE(path);
  const data = new TextDecoder("utf-8").decode(file_content);
  return data;
}

async function createDirectoryStructure(baseDir) {
  for (const size of SIZE) {
    for (const handicap of HANDICAP) {
      for (const rank of RANK) {
        const dirPath = `${baseDir}/${size}/${handicap}/${rank}`;
        if (!(await exists(dirPath))) {
          await ensureDir(dirPath);
        }
      }
    }
  }
}

function classifySGF(SGF) {
  const properties = SGF[0];
  const PB = properties.PB;
  const PW = properties.PW;
  const BR = properties.BR;
  const WR = properties.WR;
  const DT = properties.DT;
  const RE = properties.RE;
  const SZ = properties.SZ;
  const HA = properties.HA;
  const AB = properties.AB;
  const nextProperty = properties._next;

  let rank = "9段"; // Starting rank value

  if ((!HA && !AB && nextProperty?.W)) {
    rank = "unclassified";
  } else if (!BR && !WR) {
    rank = "9段";
  } else if (BR && !WR) {
    rank = BR;
  } else if (!BR && WR) {
    rank = WR;
  } else if (BR && WR) {
    rank = RANK.indexOf(BR) < RANK.indexOf(WR) ? BR : WR;
  }

  return {
    size: SZ,
    handicap: HA,
    rank: rank,
    dt: DT,
    pb: PB,
    pw: PW,
    re: RE,
    br: BR,
    wr: WR,
  };
}

function sanitizeFileName(fileName) {
  // deno-lint-ignore no-control-regex
  return fileName.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '_');
}

function generateFileName({ dt, pb, br, pw, wr, re }, index) {
  try {
    const formattedDT = typeof dt === 'string' ? dt.replace(/-/g, '_') : 'unknown_date';
    const formattedPB = typeof pb === 'string' ? pb.replace(/\s/g, '_') : 'unknown_black';
    const formattedBR = typeof br === 'string' ? br.replace(/\s/g, '_') : '';
    const formattedPW = typeof pw === 'string' ? pw.replace(/\s/g, '_') : 'unknown_white';
    const formattedWR = typeof wr === 'string' ? wr.replace(/\s/g, '_') : '';
    const formattedRE = typeof re === 'string' ? re.replace(/\s/g, '_') : 'unknown_result';

    const fileName = `${formattedPB}${formattedBR}B_vs_${formattedPW}${formattedWR}W_${formattedRE}_${formattedDT}.sgf`;
    return sanitizeFileName(fileName);
  } catch (_error) {
    return `unclassified_${index}.sgf`;
  }
}

async function moveSGFFile(path, classification, index) {
  let destDir;
  if (classification.rank === 'unclassified') {
    destDir = GIFU_UNCLASS;
  } else {
    destDir = `${GIFU_DIR}/${classification.size}/${classification.handicap}/${classification.rank}`;
  }

  if (!(await exists(destDir))) {
    await ensureDir(destDir);
  }

  let newFileName = generateFileName(classification, index);
  let destPath = `${destDir}/${newFileName}`;
  let counter = 1;

  while (await exists(destPath)) {
    newFileName = generateFileName(classification, index).replace('.sgf', `_${counter}.sgf`);
    destPath = `${destDir}/${newFileName}`;
    counter++;
  }

  await READER.RENAME(path, destPath);
}

function showProgress(current, total) {
  const percentage = (current / total) * 100;
  const progress = Math.round((percentage / 100) * 50);
  const progressBar = "[" + "█".repeat(progress) + " ".repeat(50 - progress) + "]";
  const message = `\rProcessing files: ${current}/${total} ${progressBar} ${percentage.toFixed(2)}%`;
  const encoder = new TextEncoder();
  Deno.stdout.writeSync(encoder.encode(message));
}


async function sortSGFFiles(limit) {
  await createDirectoryStructure(GIFU_DIR);
  const SGFS = await loadFoxDirectory(FOX_DIR, limit);

  const totalFiles = SGFS.length;
  for (let i = 0; i < totalFiles; i++) {
    const path = SGFS[i];
    const data = await readFileData(path);
    const SGF = await parseSGFContent(data);
    if (!SGF) continue;
    
    const classification = classifySGF(SGF);
    await moveSGFFile(path, classification, i + 1);

    showProgress(i + 1, totalFiles);
  }


}

sortSGFFiles(50000);