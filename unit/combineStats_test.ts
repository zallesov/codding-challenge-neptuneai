import { assertEquals } from "@std/assert";
import { combineStats, combineVariance } from "../combineStats.ts";
import type { Stats } from "../Stats.ts";

Deno.test("combineStats should correctly combine two Stats objects", () => {
    const stat1: Stats = {
        avg: 10,
        variance: 2,
        min: 5,
        max: 30,
        last: 12,
        count: 10,
    };

    const stat2: Stats = {
        avg: 10,
        variance: 2,
        min: 5,
        max: 30,
        last: 12,
        count: 10,
    };

    const combined = combineStats(stat1, stat2);

    assertEquals(combined.avg, 10);
    assertEquals(combined.min, 5);
    assertEquals(combined.max, 30);
    assertEquals(combined.last, 12);
    assertEquals(combined.count, 20);
    assertEquals(combined.variance, 1.894736842105263);
});


Deno.test("combineVariance", () => {

    const variacne = combineVariance(5, 10, 4, 8, 12, 6);

    assertEquals(variacne, 5.858974358974359);
});
