import { assertEquals, assertStrictEquals } from "@std/assert";
import { Stats } from "../Stats.ts";

Deno.test("Should Initialize", () => {
    const stats = new Stats(10);
    assertStrictEquals(stats.count, 0);
    assertStrictEquals(stats.avg, null);
    assertStrictEquals(stats.variance, 0);
    assertStrictEquals(stats.min, null);
    assertStrictEquals(stats.max, null);
    assertStrictEquals(stats.last, null);
});
Deno.test("addValue - Should add value one by one and calculate stats", () => {
    const stats = new Stats(10);
    stats.addValue(5);
    assertStrictEquals(stats.count, 1);
    assertEquals(stats.avg, 5);
    assertEquals(stats.variance, 0);
    assertEquals(stats.last, 5);

    stats.addValue(10);
    assertStrictEquals(stats.count, 2);
    assertEquals(stats.avg, 7.5);
    assertEquals(stats.variance, 6.25);
    assertEquals(stats.last, 10);

    stats.addValue(15);
    assertStrictEquals(stats.count, 3);
    assertEquals(stats.avg, 10);
    assertEquals(stats.variance, 16.666666666666668);
    assertEquals(stats.last, 15);
});
Deno.test("removeValue - Should remove value one by one", () => {
    const stats = new Stats(10);
    stats.addValue(5);
    stats.addValue(10);
    stats.addValue(15);
    stats.removeValue();

    assertEquals(stats.count, 2);
    assertEquals(stats.avg, 12.5);
    assertEquals(stats.variance, 6.25);
    assertEquals(stats.last, 15);

    stats.removeValue();
    assertEquals(stats.count, 1);
    assertEquals(stats.avg, 15);
    assertEquals(stats.variance, 0);
    assertEquals(stats.last, 15);

    stats.removeValue();
    assertEquals(stats.count, 0);
    assertEquals(stats.avg, null);
    assertEquals(stats.variance, 0);
    assertEquals(stats.last, null);
});
Deno.test("addValues - Should add multiple values and calculate stats", () => {
    const stats = new Stats(10);
    stats.addValues([5, 10, 15]);
    assertEquals(stats.count, 3);
    assertEquals(stats.avg, 10);
    assertEquals(stats.variance, 16.666666666666668);
    assertEquals(stats.last, 15);
    assertEquals(stats.values, [5, 10, 15]);
    assertEquals(stats.min, 5);
    assertEquals(stats.max, 15);
});

Deno.test("addValues - With values over max size should remove oldest values", () => {
    const stats = new Stats(5);
    stats.addValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assertEquals(stats.count, 5);
    assertEquals(stats.avg, 8);
    assertEquals(stats.variance, 2);
    assertEquals(stats.last, 10);
    assertEquals(stats.values, [6, 7, 8, 9, 10]);
    assertEquals(stats.min, 6);
    assertEquals(stats.max, 10);
});



// Deno.test("Stats Class - Add Values", () => {
//     const stats = new Stats(10);
//     stats.addValue(5);
//     assertStrictEquals(stats.count, 1);
//     assertEquals(stats.avg, 5);
//     assertEquals(stats.variance, 0);
//     assertEquals(stats.last, 5);

//     stats.addValue(10);
//     assertStrictEquals(stats.count, 2);
//     assertEquals(stats.avg, 7.5);
//     assertEquals(stats.variance, 6.25);
//     assertEquals(stats.min, 5);
//     assertEquals(stats.max, 10);
//     assertEquals(stats.last, 10);

//     stats.addValue(15);
//     assertStrictEquals(stats.count, 3);
//     assertEquals(stats.avg, 10);
//     assertEquals(stats.variance, 16.666666666666668);
//     assertEquals(stats.last, 15);
// });

// Deno.test("Stats Class - Remove Value", () => {
//     const stats = new Stats(10);
//     stats.addValue(5);
//     stats.addValue(10);
//     stats.addValue(15);
//     stats.removeValue();

//     assertEquals(stats.count, 2);
//     assertEquals(stats.avg, 12.5);
//     assertEquals(stats.variance, 6.25);
//     assertEquals(stats.last, 15);

//     stats.removeValue();
//     assertEquals(stats.count, 1);
//     assertEquals(stats.avg, 15);
//     assertEquals(stats.variance, 0);
//     assertEquals(stats.last, 15);
// });

// Deno.test("Stats Class - Remove All", () => {
//     const stats = new Stats(10);
//     stats.addValue(5);
//     stats.addValue(10);
//     stats.addValue(15);
//     stats.removeValue();
//     stats.removeValue();
//     stats.removeValue();

//     assertEquals(stats.count, 0);
//     assertEquals(stats.avg, null);
//     assertEquals(stats.variance, 0);
//     assertEquals(stats.min, null);
//     assertEquals(stats.max, null);
//     assertEquals(stats.last, null);
// });
