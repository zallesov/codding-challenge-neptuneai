import { assertEquals } from "@std/assert";
import { calculateStats } from "../calculateStats.ts";

Deno.test("calculateStats should return correct statistics", () => {
    const values = [1, 2, 3, 4, 5];

    const expected = {
        avg: 3,
        variance: 2,
        min: 1,
        max: 5,
        last: 5,
    };

    const result = calculateStats(values);

    assertEquals(result.avg, expected.avg);
    assertEquals(result.variance, expected.variance);
    assertEquals(result.min, expected.min);
    assertEquals(result.max, expected.max);
    assertEquals(result.last, expected.last);
});
