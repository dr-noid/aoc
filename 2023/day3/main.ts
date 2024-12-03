import fs from "fs";

type Cord = {
  x: number;
  y: number;
};

type Part = {
  number: number;
  cords: Cord[];
};

type FilteredPart = Part & {
  symbol: string;
};

type Gear = {
  cord: Cord;
  ratio: number;
};

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const filler = ".";

function getSymbol(map: string[][], cord: Cord): string | null {
  const cordsToCheck: Cord[] = [
    { x: cord.x - 1, y: cord.y },
    { x: cord.x + 1, y: cord.y },
    { x: cord.x, y: cord.y - 1 },
    { x: cord.x, y: cord.y + 1 },
    { x: cord.x - 1, y: cord.y - 1 },
    { x: cord.x + 1, y: cord.y + 1 },
    { x: cord.x - 1, y: cord.y + 1 },
    { x: cord.x + 1, y: cord.y - 1 },
  ];

  const width = map[0].length;
  const height = map.length;

  for (const toCheck of cordsToCheck) {
    if (toCheck.y < 0 || toCheck.y >= height) continue;
    if (toCheck.x < 0 || toCheck.x >= width) continue;
    const symbol = map[toCheck.y][toCheck.x];

    if (symbol !== filler && !numbers.includes(symbol)) {
      return symbol;
    }
  }
  return null;
}

function findParts(lines: string[]): Part[] {
  const parts: Part[] = [];

  for (const [lineIdx, line] of lines.entries()) {
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (!numbers.includes(char)) continue;

      const cords: Cord[] = [];
      let fullNumber = char;

      cords.push({ x: i, y: lineIdx });

      do {
        i++;
        cords.push({ x: i, y: lineIdx });
        fullNumber += line[i];
      } while (numbers.includes(line[i + 1]));

      const part = {
        number: parseInt(fullNumber),
        cords: cords,
      };
      parts.push(part);
    }
  }
  return parts;
}

function filterParts(map: string[][], parts: Part[]): FilteredPart[] {
  const filteredParts: FilteredPart[] = [];
  for (const part of parts) {
    for (const cord of part.cords) {
      const adjSymbol = getSymbol(map, cord);
      if (adjSymbol) {
        filteredParts.push({ ...part, symbol: adjSymbol });
        break;
      }
    }
  }

  return filteredParts;
}

function findStars(lines: string[]): Cord[] {
  const cords: Cord[] = [];

  for (const [lineIdx, line] of lines.entries()) {
    for (const [charIdx, char] of line.split("").entries()) {
      if (char !== "*") continue;

      cords.push({ x: charIdx, y: lineIdx });
    }
  }

  return cords;
}

function findGears(stars: Cord[], map: string[][], parts: Part[]): Gear[] {
  // gears are stars that are adjacent to exactly two numbers
  const gears: Gear[] = [];

  for (const star of stars) {
    const seenPartIds: number[] = [];

    const cordsToCheck: Cord[] = [
      { x: star.x - 1, y: star.y },
      { x: star.x + 1, y: star.y },
      { x: star.x, y: star.y - 1 },
      { x: star.x, y: star.y + 1 },
      { x: star.x - 1, y: star.y - 1 },
      { x: star.x + 1, y: star.y + 1 },
      { x: star.x - 1, y: star.y + 1 },
      { x: star.x + 1, y: star.y - 1 },
    ];

    const width = map[0].length;
    const height = map.length;
    let foundCount = 0;

    for (const toCheck of cordsToCheck) {
      if (toCheck.y < 0 || toCheck.y >= height) continue;
      if (toCheck.x < 0 || toCheck.x >= width) continue;
      const symbol = map[toCheck.y][toCheck.x];

      if (numbers.includes(symbol)) {
        const part = parts.find((p) => p.cords.some((c) => c.x === toCheck.x && c.y === toCheck.y));
        if (!part) {
          console.error("Part not found");
          break;
        }
        if (seenPartIds.includes(part.number)) continue;
        seenPartIds.push(part.number);
        foundCount++;
      }

      if (foundCount == 2) {
        const [part1, part2] = seenPartIds;
        const gearRatio = part1 * part2;
        gears.push({ cord: star, ratio: gearRatio });
        break;
      }
    }
  }

  return gears;
}

function main() {
  const input: string = fs.readFileSync("input.txt", "utf-8");
  const lines: string[] = input.split("\n");

  const map: string[][] = [];
  for (const line of lines) {
    map.push(line.split(""));
  }

  const parts = findParts(lines);
  const filteredParts = filterParts(map, parts);

  const partOneTotal = filteredParts.reduce((acc, part) => acc + part.number, 0);
  console.log(`Part One: ${partOneTotal}`);

  const stars = findStars(lines);
  const gears = findGears(stars, map, parts);

  const partTwoTotal = gears.reduce((acc, gear) => acc + gear.ratio, 0);
  console.log(`Part Two: ${partTwoTotal}`);
}

main();
