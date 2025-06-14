
export const parsePercent = (s: string): number => parseFloat(s.replace('%', ''));

export const getDistance = (dept1: { top: string; left: string }, dept2: { top: string; left: string }): number => {
    const p1 = { x: parsePercent(dept1.left), y: parsePercent(dept1.top) };
    const p2 = { x: parsePercent(dept2.left), y: parsePercent(dept2.top) };
    // Using Manhattan distance for grid-like movement to simulate aisles
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
};

export function getPermutations<T>(array: T[]): T[][] {
    const result: T[][] = [];
    function permute(arr: T[], l: number, r: number) {
        if (l === r) {
            result.push([...arr]);
        } else {
            for (let i = l; i <= r; i++) {
                [arr[l], arr[i]] = [arr[i], arr[l]];
                permute(arr, l + 1, r);
                [arr[l], arr[i]] = [arr[i], arr[l]]; // backtrack
            }
        }
    }
    if (array.length > 0) {
      permute(array, 0, array.length - 1);
    }
    return result;
}
