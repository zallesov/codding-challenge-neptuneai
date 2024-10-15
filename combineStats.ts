import type { Stats } from "./Stats.ts";

export function combineStats(stat1: Stats, stat2: Stats): Stats {
    return {
        variance: combineVariance(stat1.count, stat1.avg, stat1.variance, stat2.count, stat2.avg, stat2.variance),
        avg: (stat1.avg * stat1.count + stat2.avg * stat2.count) / (stat1.count + stat2.count), // Combine avg
        min: Math.min(stat1.min, stat2.min), // Combine min
        max: Math.max(stat1.max, stat2.max), // Combine max
        last: stat2.last, // Assuming last is from stat2
        count: stat1.count + stat2.count, // Combine count
    };
}

export function combineVariance(
    count1: number,
    avg1: number,
    variance1: number,
    count2: number,
    avg2: number,
    variance2: number
): number {
    // Calculate the weighted sum of variances
    const combinedVariance = (
        (count1 - 1) * variance1 +
        (count2 - 1) * variance2 +
        (count1 * count2) / (count1 + count2) * Math.pow(avg1 - avg2, 2)
    ) / (count1 + count2 - 1);

    return combinedVariance;
}
