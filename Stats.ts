import * as z from "zod";

export const Stats = z.object({
    avg: z.number(),
    variance: z.number(),
    min: z.number(),
    max: z.number(),
    last: z.number(),
    count: z.number(),
});

export const Batch = z.object({
    values: z.array(z.number()),
    stats: Stats,
});

export type Batch = z.infer<typeof Batch>;
export type Stats = z.infer<typeof Stats>;