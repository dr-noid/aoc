const fs = require("fs");

const opts = {
  red: 12,
  green: 13,
  blue: 14,
};

type GameRecord = {
  red?: number;
  green?: number;
  blue?: number;
};

type Game = {
  id: number;
  records: GameRecord[];
};

function checkGamePossible(game: Game) {
  for (const record of game.records) {
    for (const [color, num] of Object.entries(record)) {
      if (num > opts[color]) {
        return false;
      }
    }
  }
  return true;
}

function parseGameRecords(gameRecords: string): GameRecord[] {
  const rawRecords = gameRecords.split(";");

  // 3 blue, 2 green, 1 red

  const r = rawRecords.map((rawRecord) => {
    const shows = rawRecord.split(",");

    let record: GameRecord = {};
    for (const show of shows) {
      const trimmed = show.trim();
      const split = trimmed.split(" ");
      const num = parseInt(split[0]);
      const color = split[1];
      record[color] = num;
    }

    return record;
  });

  return r;
}

function parseGame(gameLine: string): Game {
  const id = gameLine.slice(5, gameLine.search(":"));

  const records = parseGameRecords(gameLine.slice(gameLine.search(":") + 2));

  const game: Game = {
    id: parseInt(id),
    records: records,
  };

  return game;
}

// Part 2
function getGamePower(game: Game) {
  const max = {
    red: 0,
    green: 0,
    blue: 0,
  };

  for (const record of game.records) {
    for (const [color, num] of Object.entries(record)) {
      if (num > max[color]) {
        max[color] = num;
      }
    }
  }

  return (max.blue ?? 1) * (max.green ?? 1) * (max.red ?? 1);
}

function main() {
  const input = fs.readFileSync("./input.txt", "utf-8");
  const games: string[] = input.split("\n");

  let totalIds = 0;
  for (const game of games) {
    const g = parseGame(game);

    const possible = checkGamePossible(g);
    if (possible) {
      totalIds += g.id;
    }
  }
  console.log(`Part 1: ${totalIds}`);

  let totalPower = 0;
  for (const game of games) {
    const g = parseGame(game);

    const gamePower = getGamePower(g);
    totalPower += gamePower;
  }
  console.log(`Part 2: ${totalPower}`);
}

main();
