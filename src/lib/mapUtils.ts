
type GridPoint = { grid_row: number; grid_col: number };

export const getDistance = (dept1: GridPoint, dept2: GridPoint): number => {
    // Using Manhattan distance for grid-like movement to simulate aisles
    return Math.abs(dept1.grid_col - dept2.grid_col) + Math.abs(dept1.grid_row - dept2.grid_row);
};
