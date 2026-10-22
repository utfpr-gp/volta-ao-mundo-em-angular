function percentOfWorld(visited: number, total: number): number {
  return Math.round((visited / total) * 100);
}

const percent = percentOfWorld(12, 195);
