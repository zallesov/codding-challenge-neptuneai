import { AVLTree } from "./AVLTree.ts";

/**
 * Class representing statistical measures of a dataset.
 */
export class Stats {

    constructor(private size: number) {
        this.size = size
    }

    private _avg: number | null = null
    private _varianceAgg: number | null = null
    private _min: number | null = null
    private _max: number | null = null

    private _values: number[] = []
    private _minMaxTree: AVLTree<number> = new AVLTree<number>()

    /**
     * Add multiple values to the stats and update the min-max tree.
     * @param values - The values to add.
     */
    addValues(values: number[]) {


        values.forEach(value => {

            if (this.count === this.size) {
                this._removeValue()
            }

            this._addValue(value)
        })

        // this.min = Math.min(...this.values) // O(n) 
        // this.max = Math.max(...this.values) // O(n)

        this._min = this._minMaxTree.findMin() // O(log n)
        this._max = this._minMaxTree.findMax() // O(log n)
    }

    /**
     * @private
     * Add a value to the stats and update the min-max tree.
     * @param value - The value to add.
     */
    _addValue(value: number) {
        this._values.push(value)
        this._minMaxTree.insertKey(value)

        if (this._avg === null) {
            this._avg = value;
            this._varianceAgg = 0;
        } else {
            const oldAvg = this._avg;
            this._avg = oldAvg + (value - oldAvg) / this.count;

            // Update the variance using Welford's method
            const diff = value - oldAvg;
            this._varianceAgg = this._varianceAgg! + diff * (value - this._avg);
        }
    }

    /**
     * @private
     * Remove a value from the stats and update the min-max tree.
     */
    _removeValue() {
        if (this.count === 0) return;

        const removedValue = this._values.shift()!;
        this._minMaxTree.removeKey(removedValue)

        if (this.count === 1) {
            // Reset everything if removing the last element
            this._avg = this._min = this._max = this.last;
            this._varianceAgg = 0;
            return;
        }

        if (this.count === 0) {
            this._avg = this._min = this._max = this._varianceAgg = null;
            return;
        }

        // Recalculate avg (old avg restored with removed value)
        const oldAvg = this._avg!;
        this._avg = (oldAvg * (this.count + 1) - removedValue) / this.count;

        // Recalculate variance
        const diff = removedValue - oldAvg;
        this._varianceAgg = this._varianceAgg! - diff * (removedValue - this._avg!);

    }

    get variance(): number | null {
        return this._varianceAgg && this.count > 1 ? this._varianceAgg / (this.count) : 0;
    }

    get count(): number {
        return this._values.length;
    }

    get last(): number | null {
        return this._values[this._values.length - 1] ?? null;
    }

    get min(): number | null {
        return this._min
    }

    get max(): number | null {
        return this._max
    }

    get avg(): number | null {
        return this._avg
    }

    get values(): number[] {
        return this._values
    }


    toJSON(): string {
        return JSON.stringify({
            avg: this._avg,
            variance: this.variance,
            min: this.min,
            max: this.max,
            count: this.count,
            last: this.last,
        })
    }
}