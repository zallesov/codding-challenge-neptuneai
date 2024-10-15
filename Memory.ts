import { calculateStats } from "./calculateStats.ts";
import { combineStats } from "./combineStats.ts";
import type { Stats, Batch } from "./Stats.ts";

export class Memory {
    constructor(public readonly _k: number) {
        this._k = _k
        this._maxSize = Math.pow(10, _k)
    }

    private _batches: Batch[] = []
    private _total = 0
    private _maxSize = 0

    get maxSize(): number {
        return this._maxSize;
    }

    get total(): number {
        return this._total;
    }

    get batches(): Batch[] {
        return this._batches;
    }

    get k(): number {
        return this._k;
    }

    get values(): number[] {
        return this._batches.flatMap(stat => stat.values)
    }

    addValues(values: number[]) {
        if (values.length === 0) {
            return
        }
        // Reversing the values to maintain the FIFO order
        // This is not really necessary for calculating the stats and can be optimized
        // But it makes it easier to work with the values
        const reversedValues = values.reverse()

        const batch = { values: reversedValues, stats: calculateStats(reversedValues) }
        this._batches.unshift(batch)
        this._total += values.length

        while (this._batches.length > 0 && this._total > this._maxSize) {
            const statsToRemove = this._batches.pop()

            this._total = this._total - statsToRemove!.stats.count;

            if (this._total < this._maxSize) {
                const batchLength = this._maxSize - this._total
                const batchValues = statsToRemove!.values.slice(0, batchLength)
                const replacementBatch = { values: batchValues, stats: calculateStats(batchValues) }
                this._batches.push(replacementBatch)
                this._total = this._maxSize

                return
            }
        }
    }

    getStats(k: number): Stats | null {
        const windowSize = Math.pow(10, k)
        let i = 0;
        let count = 0
        let stats = null
        console.log("get stats", windowSize, this.batches.length)

        while (count < windowSize && i < this.batches.length) {
            let batch = this.batches[i]

            if (count + batch.stats.count > windowSize) {
                const batchValues = batch.values.slice(0, windowSize - count)
                batch = { values: batchValues, stats: calculateStats(batchValues) }
            }

            stats = stats ? combineStats(stats, batch.stats) : batch.stats
            count += this.batches[i].stats.count
            i++
        }

        return stats;
    }
}
