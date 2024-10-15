import type { Stats } from "./Stats.ts";

export function calculateStats(values: number[]): Stats {
    console.log("calculating stats", values)
    const { sum, count, min, max, last, sumOfSquares } = values.reduce((acc, value) => {
        acc.sum += value;
        acc.count += 1;
        acc.min = Math.min(acc.min, value);
        acc.max = Math.max(acc.max, value);
        acc.last = value;
        acc.sumOfSquares += value * value;
        return acc;
    }, { sum: 0, count: 0, min: Infinity, max: -Infinity, last: values[0], sumOfSquares: 0 });

    const avg = count > 0 ? sum / count : 0;
    const variance = count > 0 ? (sumOfSquares / count) - (avg * avg) : 0;

    return {
        avg,
        variance,
        min,
        max,
        last,
        count: values.length,
    };
}
