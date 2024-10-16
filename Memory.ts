import { Stats } from "./Stats.ts";

export class Memory {
    private windowSizes: number[] = [];
    private stats: Map<number, Stats> = new Map()
    constructor(public readonly _k: number) {
        this._k = _k
        for (let i = 1; i <= _k; i++) {
            const size = Math.pow(10, i)
            this.windowSizes.push(size)
            this.stats.set(size, new Stats(size))
        }
    }

    get k(): number {
        return this._k;
    }

    addValues(values: number[]) {
        if (values.length === 0) {
            return
        }

        for (const size of this.windowSizes) {
            const stat = this.stats.get(size)!;

            stat.addValues(values)
        }

    }

    getStats(k: number): Stats | null {
        const size = Math.pow(10, k)
        return this.stats.get(size)!;
    }
}
