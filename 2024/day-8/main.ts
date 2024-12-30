import input from './input';

interface Point {
  x: number;
  y: number;
}

interface Antenna {
  position: Point;
  frequency: string;
}

class Solution {
  private grid: string[][];
  private antennas: Map<string, Antenna[]> = new Map();
  private antinodes: Set<string> = new Set();

  constructor(input: string) {
    // Parse input into grid and build antenna map
    this.grid = input.split('\n').map((line) => line.split(''));
    this.parseAntennas();
  }

  private parseAntennas(): void {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        const char = this.grid[y][x];
        if (char !== '.') {
          const antenna = { position: { x, y }, frequency: char };
          if (!this.antennas.has(char)) {
            this.antennas.set(char, []);
          }
          this.antennas.get(char)!.push(antenna);
        }
      }
    }
  }

  private isInBounds(point: Point): boolean {
    return point.y >= 0 && point.y < this.grid.length && point.x >= 0 && point.x < this.grid[0].length;
  }

  private findAntinodes(ant1: Antenna, ant2: Antenna): Point[] {
    // Vector from ant1 to ant2
    const dx = ant2.position.x - ant1.position.x;
    const dy = ant2.position.y - ant1.position.y;

    // Distance between antennas
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Unit vector perpendicular to the line between antennas
    const perpX = -dy / distance;
    const perpY = dx / distance;

    // Calculate both potential antinode positions
    // One antenna should be twice as far as the other
    const antinodeDistance = distance / 3;

    const midX = ant1.position.x + dx / 3;
    const midY = ant1.position.y + dy / 3;

    return [
      {
        x: Math.round(midX + perpX * antinodeDistance),
        y: Math.round(midY + perpY * antinodeDistance),
      },
      {
        x: Math.round(midX - perpX * antinodeDistance),
        y: Math.round(midY - perpY * antinodeDistance),
      },
    ];
  }

  public solve(): number {
    // For each frequency
    for (const [freq, antennas] of this.antennas) {
      // For each pair of antennas with same frequency
      for (let i = 0; i < antennas.length; i++) {
        for (let j = i + 1; j < antennas.length; j++) {
          const antinodes = this.findAntinodes(antennas[i], antennas[j]);

          // Add in-bounds antinodes to set
          for (const antinode of antinodes) {
            if (this.isInBounds(antinode)) {
              this.antinodes.add(`${antinode.x},${antinode.y}`);
            }
          }
        }
      }
    }

    return this.antinodes.size;
  }
}

const solver = new Solution(input);
const result = solver.solve();
console.log(result);
