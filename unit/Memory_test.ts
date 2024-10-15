import { assertEquals, assertExists, assertStrictEquals } from "@std/assert";
import { Memory } from "../Memory.ts";

Deno.test("maxSize is calculated correctly", () => {
    const memory = new Memory(2);
    assertEquals(memory.maxSize, 100);
});

Deno.test("Return Null if No Stats Available", () => {
    const memory = new Memory(2);
    const stats = memory.getStats(1);
    assertStrictEquals(stats, null);
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

Deno.test("Inserts in first in FIFO order", () => {
    const memory = new Memory(2);
    memory.addValues([1, 1, 1]);
    memory.addValues([2, 2, 2]);
    memory.addValues([3, 3, 3]);
    const values = memory.values;
    assertEquals(values, [3, 3, 3, 2, 2, 2, 1, 1, 1]);
});

Deno.test("Handle Exceeding Max Size, removing oldest values", () => {
    const memory = new Memory(2);
    memory.addValues([1, 1, 1]); // to be removed
    memory.addValues([2, 2, 2]); // to be removed partially

    const values3 = Array.from({ length: 99 }, (_) => 3);
    memory.addValues(values3);

    assertStrictEquals(memory.batches.length <= 100, true);
    assertEquals(memory.values, [...values3, 2]);
});


Deno.test("Handle values order correctly", () => {
    const memory = new Memory(2);
    const values1 = Array.from({ length: 100 }, (_, i) => i + 1);
    memory.addValues([...values1]);
    memory.addValues([101]);

    assertStrictEquals(memory.batches.length <= 100, true);
    assertEquals(memory.values, [101, ...values1.reverse().slice(0, 99)]);
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


Deno.test("Calculates small size stats from bigger batches", () => {
    const memory = new Memory(8);
    const values = Array.from({ length: 50 }, (_) => 1);
    memory.addValues(values);
    memory.addValues(values);
    memory.addValues(values);
    const stats = memory.getStats(1);
    assertExists(stats);
    assertEquals(stats.count, 10);
    assertEquals(stats.avg, 1);
});