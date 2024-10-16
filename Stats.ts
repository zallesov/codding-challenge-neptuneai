
export class Stats {

    constructor(private size: number) {
        this.size = size
    }

    avg: number | null = null
    varianceAgg: number | null = null
    min: number | null = null
    max: number | null = null

    values: number[] = []
    minMax: number[] = []

    addValues(values: number[]) {

        const min = Math.min(...values)
        const max = Math.max(...values)

        values.forEach(value => {

            if (this.count === this.size) {
                this.removeValue()
            }

            this.addValue(value)
        })

        console.log(this.values)
        console.log(this.min)
        console.log(min)
        this.min = this.min == null || min <= this.min ? min : Math.min(...this.values) // O(n) 
        this.max = this.max == null || max >= this.max ? max : Math.max(...this.values) // O(n)
    }

    addValue(value: number) {
        this.values.push(value)

        if (this.avg === null) {
            this.avg = value;
            this.varianceAgg = 0;
        } else {
            const oldAvg = this.avg;
            this.avg = oldAvg + (value - oldAvg) / this.count;

            // Update the variance using Welford's method
            const diff = value - oldAvg;
            this.varianceAgg = this.varianceAgg! + diff * (value - this.avg);
        }
    }

    removeValue() {
        if (this.count === 0) return;

        const removedValue = this.values.shift()!;

        if (this.count === 1) {
            // Reset everything if removing the last element
            this.avg = this.min = this.max = this.last;
            this.varianceAgg = 0;
            return;
        }

        if (this.count === 0) {
            this.avg = this.min = this.max = this.varianceAgg = null;
            return;
        }

        // Recalculate avg (old avg restored with removed value)
        const oldAvg = this.avg!;
        this.avg = (oldAvg * (this.count + 1) - removedValue) / this.count;

        // Recalculate variance
        const diff = removedValue - oldAvg;
        this.varianceAgg = this.varianceAgg! - diff * (removedValue - this.avg!);

    }

    get variance(): number | null {
        return this.varianceAgg && this.count > 1 ? this.varianceAgg / (this.count) : 0;
    }

    get count(): number {
        return this.values.length;
    }

    get last(): number | null {
        return this.values[this.values.length - 1] ?? null;
    }

    toJSON(): string {
        return JSON.stringify({
            avg: this.avg,
            variance: this.variance,
            min: this.min,
            max: this.max,
            count: this.count,
            last: this.last,
        })
    }
}