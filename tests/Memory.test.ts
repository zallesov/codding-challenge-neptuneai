import { assertEquals, assertExists } from "@std/assert";
import { Memory } from "../Memory.ts";
import { Stats } from "../Stats.ts";

Deno.test("Return stats for a given k", () => {
    const memory = new Memory(3);
    const stats = memory.getStats(1);
    assertEquals(stats, new Stats(10));

    const stats2 = memory.getStats(2);
    assertEquals(stats2, new Stats(100));

    const stats3 = memory.getStats(3);
    assertEquals(stats3, new Stats(1000));
});

Deno.test("Return Undefined for values over initial K", () => {
    const memory = new Memory(2);
    const stats = memory.getStats(3);
    assertEquals(stats, undefined);
});


Deno.test("Calculates stats for single batch", () => {
    const memory = new Memory(2);
    memory.addValues([1, 2, 3]);
    const stats = memory.getStats(1);
    assertExists(stats);
    assertEquals(stats!.count, 3);
    assertEquals(stats!.avg, 2);
});

Deno.test("Calculates stats for multiple batches", () => {
    const memory = new Memory(2);
    memory.addValues([2, 2, 2]);
    memory.addValues([2, 2, 2]);
    memory.addValues([2, 2, 2]);
    const stats = memory.getStats(1);
    assertExists(stats);
    assertEquals(stats!.count, 9);
    assertEquals(stats!.avg, 2);
});

Deno.test("Calculates same stats for multiple levels", () => {
    const memory = new Memory(3);
    memory.addValues([2, 2, 2]);
    memory.addValues([2, 2, 2]);
    memory.addValues([2, 2, 2]);
    const stats1 = memory.getStats(1);
    assertExists(stats1);
    assertEquals(stats1!.count, 9);
    assertEquals(stats1!.avg, 2);

    const stats2 = memory.getStats(2);
    assertExists(stats2);
    assertEquals(stats2!.count, 9);
    assertEquals(stats2!.avg, 2);

    const stats3 = memory.getStats(3);
    assertExists(stats3);
    assertEquals(stats3!.count, 9);
    assertEquals(stats3!.avg, 2);
});


Deno.test("Combine Stats Correctly", () => {
    const memory = new Memory(2);
    memory.addValues([1, 2, 3]);
    memory.addValues([4, 5, 6]);
    const combinedStats = memory.getStats(2);
    assertExists(combinedStats);
    assertEquals(combinedStats!.count, 6);
    assertEquals(combinedStats!.avg, 3.5);
});


Deno.test("Calculates small stats from different levels", () => {
    const memory = new Memory(8);
    const values = Array.from({ length: 100 }, (_, i) => i);
    memory.addValues(values);

    const stats1 = memory.getStats(1);

    const values1 = [90, 91, 92, 93, 94, 95, 96, 97, 98, 99];

    assertExists(stats1);
    assertEquals(stats1.count, 10);
    assertEquals(stats1.avg, values1.reduce((a, b) => a + b, 0) / values1.length);
    assertEquals(stats1.values, values1);

    const stats2 = memory.getStats(2);

    const values2 = values;

    assertExists(stats2);
    assertEquals(stats2.count, 100);
    assertEquals(stats2.avg, values2.reduce((a, b) => a + b, 0) / values2.length);
    assertEquals(stats2.values, values2);

});