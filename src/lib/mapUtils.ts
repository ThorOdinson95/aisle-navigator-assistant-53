
type GridPoint = { grid_row: number; grid_col: number };

export const getDistance = (dept1: GridPoint, dept2: GridPoint): number => {
    // Using Manhattan distance for grid-like movement to simulate aisles
    return Math.abs(dept1.grid_col - dept2.grid_col) + Math.abs(dept1.grid_row - dept2.grid_row);
};

export const generatePath = (points: GridPoint[]): GridPoint[] => {
  if (points.length < 2) return points;

  const fullPath: GridPoint[] = [points[0]];

  for (let i = 0; i < points.length - 1; i++) {
    let current = { ...points[i] };
    const end = points[i + 1];

    // Walk horizontally first
    while (current.grid_col !== end.grid_col) {
      current.grid_col += Math.sign(end.grid_col - current.grid_col);
      fullPath.push({ ...current });
    }
    // Then walk vertically
    while (current.grid_row !== end.grid_row) {
      current.grid_row += Math.sign(end.grid_row - current.grid_row);
      fullPath.push({ ...current });
    }
  }

  // Deduplicate
  return fullPath.filter((point, index, self) => 
    index === self.findIndex(p => p.grid_row === point.grid_row && p.grid_col === point.grid_col)
  );
};
